const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// อนุญาตให้ React App (Frontend) เข้าถึง Backend ได้
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Parses JSON bodies with increased limit for base64 BLOBs
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==== File Upload Setup (multer) ====
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR); // สร้างโฟลเดอร์ถ้ายังไม่มี

// เสิร์ฟไฟล์รูปภาพจากโฟลเดอร์ uploads
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    // เก็บชื่อไฟล์เป็น timestamp + ชื่อเดิม เพื่อหลีกเลี่ยงชื่อซ้ำ
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ที่ 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
             && allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files are allowed!'));
  }
});

// ==== MySQL / MariaDB Database Connection Setup ====
// เชื่อมต่อกับฐานข้อมูล test ใน MariaDB
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // MariaDB username
  password: '',         // MariaDB password
  database: 'test',     // ชื่อฐานข้อมูลที่คุณตั้งไว้
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ==== Routes ====

// 1. GET /api/mou_data - ดึงข้อมูลทั้งหมดไปแสดงผลใน React
app.get('/api/mou_data', async (req, res) => {
  try {
    const [rows] = await dbPool.execute(`
      SELECT 
        ID, name, institution, contact, staff, period, type, status, country_check,
        approval_date, submit_date, analyze_date, accept_date, edit_date, sign_date,
        legal_date, manager_date, council_date, notice_date, nation,
        CASE WHEN mou_pdf IS NOT NULL AND LENGTH(mou_pdf) > 0 THEN 1 ELSE 0 END AS has_mou_pdf 
      FROM mou_data ORDER BY ID DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 1.1 GET /api/mou_data/:id/pdf - ดึงไฟล์ PDF เฉพาะเมื่อต้องการดู
app.get('/api/mou_data/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await dbPool.execute('SELECT mou_pdf FROM mou_data WHERE ID = ?', [id]);
    
    if (rows.length === 0 || !rows[0].mou_pdf) {
      return res.status(404).send('PDF not found');
    }
    
    const pdfData = rows[0].mou_pdf;
    let buffer;
    
    if (Buffer.isBuffer(pdfData)) {
      const str = pdfData.toString('utf8');
      if (str.startsWith('data:application/pdf;base64,')) {
        buffer = Buffer.from(str.split(',')[1], 'base64');
      } else {
        buffer = pdfData;
      }
    } else if (typeof pdfData === 'string' && pdfData.startsWith('data:application/pdf;base64,')) {
      buffer = Buffer.from(pdfData.split(',')[1], 'base64');
    } else {
      buffer = Buffer.from(pdfData); // fallback
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="mou_${id}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
});

// 2. POST /api/mou_data - เพิ่มข้อมูลใหม่จากฟอร์มใน React
app.post('/api/mou_data', async (req, res) => {
  try {
    const { 
      name = '', institution = '', contact = '', staff = '',
      period = '', type = '', nation = '',
      status = '', country_check = 'Inside',
      approval_date = '', submit_date = '', analyze_date = '', accept_date = '', 
      edit_date = '', sign_date = '', legal_date = '', manager_date = '', 
      council_date = '', notice_date = '', mou_pdf = null
    } = req.body;

    const [result] = await dbPool.execute(
      `INSERT INTO mou_data (
        name, institution, contact, staff, period, type, nation, status, country_check,
        approval_date, submit_date, analyze_date, accept_date, edit_date, sign_date,
        legal_date, manager_date, council_date, notice_date, mou_pdf
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        name, institution, contact, staff, period, type, nation, status, country_check,
        approval_date, submit_date, analyze_date, accept_date, edit_date, sign_date,
        legal_date, manager_date, council_date, notice_date, mou_pdf
      ]
    );

    res.status(201).json({ message: 'mou_data added successfully', id: result.insertId });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to add data' });
  }
});

// 3. DELETE /api/mou_data/:id - ลบแถวออกจากตาราง mou_data
app.delete('/api/mou_data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Delete related activities first
    await dbPool.execute('DELETE FROM activity_data WHERE ownerid = ?', [id]);
    // Then delete the MOU
    const [result] = await dbPool.execute('DELETE FROM mou_data WHERE ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Row not found in mou_data' });
    }
    res.json({ message: 'mou_data row deleted successfully', id });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to delete mou_data row' });
  }
});

// 4. PATCH /api/mou_data/:id/status - อัปเดตเฉพาะ Status ของ MOU
app.patch('/api/mou_data/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { Status, status } = req.body;
    const finalStatus = status !== undefined ? status : Status;
    if (finalStatus === undefined) return res.status(400).json({ error: 'Status is required' });

    const [result] = await dbPool.execute(
      'UPDATE mou_data SET status = ? WHERE ID = ?',
      [finalStatus, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Row not found in mou_data' });
    }
    res.json({ message: 'Status updated successfully', id, status: finalStatus });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// 5. PUT /api/mou_data/:id - อัปเดตข้อมูล MOU ทั้งหมด
app.put('/api/mou_data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, institution, contact, staff,
      period, type, nation, country_check,
      approval_date, submit_date, analyze_date, accept_date, 
      edit_date, sign_date, legal_date, manager_date, 
      council_date, notice_date, mou_pdf
    } = req.body;

    const [result] = await dbPool.execute(
      `UPDATE mou_data SET 
        name = COALESCE(?, name), 
        institution = COALESCE(?, institution), 
        contact = COALESCE(?, contact), 
        staff = COALESCE(?, staff), 
        country_check = COALESCE(?, country_check),
        period = COALESCE(?, period), 
        type = COALESCE(?, type),
        nation = COALESCE(?, nation),
        approval_date = COALESCE(?, approval_date), 
        submit_date = COALESCE(?, submit_date), 
        analyze_date = COALESCE(?, analyze_date), 
        accept_date = COALESCE(?, accept_date), 
        edit_date = COALESCE(?, edit_date), 
        sign_date = COALESCE(?, sign_date), 
        legal_date = COALESCE(?, legal_date), 
        manager_date = COALESCE(?, manager_date), 
        council_date = COALESCE(?, council_date), 
        notice_date = COALESCE(?, notice_date),
        mou_pdf = COALESCE(?, mou_pdf)
       WHERE ID = ?`,
      [
        name !== undefined ? name : null, 
        institution !== undefined ? institution : null, 
        contact !== undefined ? contact : null, 
        staff !== undefined ? staff : null, 
        country_check !== undefined ? country_check : null,
        period !== undefined ? period : null, 
        type !== undefined ? type : null,
        nation !== undefined ? nation : null,
        approval_date !== undefined ? approval_date : null, 
        submit_date !== undefined ? submit_date : null, 
        analyze_date !== undefined ? analyze_date : null, 
        accept_date !== undefined ? accept_date : null,
        edit_date !== undefined ? edit_date : null, 
        sign_date !== undefined ? sign_date : null, 
        legal_date !== undefined ? legal_date : null, 
        manager_date !== undefined ? manager_date : null,
        council_date !== undefined ? council_date : null, 
        notice_date !== undefined ? notice_date : null,
        mou_pdf !== undefined ? mou_pdf : null,
        id
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Row not found in mou_data' });
    }
    res.json({ message: 'mou_data updated successfully', id });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to update mou_data' });
  }
});

// ==== activity_data Routes ====

// 3. GET /api/activity_data - ดึงข้อมูลทั้งหมดจากตาราง activity_data
app.get('/api/activity_data', async (req, res) => {
  try {
    const [rows] = await dbPool.execute('SELECT * FROM activity_data ORDER BY mouid DESC');
    
    // MySQL returns BLOB as Buffer. Convert to string for JSON response.
    const formattedRows = rows.map(row => {
      if (row.activities_pic && Buffer.isBuffer(row.activities_pic)) {
        row.activities_pic = row.activities_pic.toString('utf8');
      }
      return row;
    });

    res.json(formattedRows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to fetch activity_data' });
  }
});

// 4. POST /api/activity_data - เพิ่มข้อมูลใหม่เข้าตาราง activity_data
app.post('/api/activity_data', async (req, res) => {
  try {
    const { 
      activities_desc, ownerid, activities, activities_pic,
      staff, activities_type, activities_service, activities_category, activities_name, activities_date, activities_budget
    } = req.body;

    const [result] = await dbPool.execute(
      `INSERT INTO activity_data (
        activities_desc, ownerid, activities, activities_pic,
        staff, activities_type, activities_service, activities_category, activities_name, activities_date, activities_budget
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        activities_desc || '', 
        ownerid || null, 
        activities || '', 
        activities_pic || null,
        staff || null, 
        activities_type || '', 
        activities_service || '', 
        activities_category || '',
        activities_name !== undefined ? activities_name : 0,
        activities_date || '',
        activities_budget ? Number(activities_budget) : null
      ]
    );

    res.status(201).json({ message: 'activity_data added successfully', id: result.insertId });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to add activity_data' });
  }
});

// 6. POST /api/upload - อัปโหลดรูปภาพไปยังโฟลเดอร์ uploads
// ส่งคืนชื่อไฟล์ที่บันทึกไว้ เพื่อนำไปเก็บใน activities_pic ของ activity_data
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // คืนชื่อไฟล์ที่บันทึก เช่น "1717123456789-123456.jpg"
  res.json({
    filename: req.file.filename,
    url: `http://localhost:5000/uploads/${req.file.filename}`
  });
});

// 6. PUT /api/activity_data/:id - อัปเดตข้อมูลกิจกรรม
app.put('/api/activity_data/:id', async (req, res) => {
  try {
    const { id } = req.params; // this is mouid
    const { 
      activities, activities_desc, activities_date,
      staff, activities_type, activities_service, activities_category, activities_name,
      activities_pic, activities_budget
    } = req.body;

    const [result] = await dbPool.execute(
      `UPDATE activity_data SET 
        activities = COALESCE(?, activities), 
        activities_desc = COALESCE(?, activities_desc),
        activities_date = COALESCE(?, activities_date),
        staff = COALESCE(?, staff),
        activities_type = COALESCE(?, activities_type),
        activities_service = COALESCE(?, activities_service),
        activities_category = COALESCE(?, activities_category),
        activities_name = COALESCE(?, activities_name),
        activities_pic = COALESCE(?, activities_pic),
        activities_budget = COALESCE(?, activities_budget)
       WHERE mouid = ?`,
      [
        activities !== undefined ? activities : null, 
        activities_desc !== undefined ? activities_desc : null,
        activities_date !== undefined ? activities_date : null,
        staff !== undefined ? staff : null,
        activities_type !== undefined ? activities_type : null,
        activities_service !== undefined ? activities_service : null,
        activities_category !== undefined ? activities_category : null,
        activities_name !== undefined ? activities_name : null,
        activities_pic !== undefined ? activities_pic : null,
        activities_budget ? Number(activities_budget) : null,
        id
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Row not found in activity_data' });
    }
    res.json({ message: 'activity_data updated successfully', id });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to update activity_data' });
  }
});

// 5. DELETE /api/activity_data/:mouid - ลบแถวออกจากตาราง activity_data
app.delete('/api/activity_data/:mouid', async (req, res) => {
  try {
    const { mouid } = req.params;
    const [result] = await dbPool.execute('DELETE FROM activity_data WHERE mouid = ?', [mouid]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Row not found in activity_data' });
    }
    res.json({ message: 'activity_data row deleted successfully', mouid });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to delete activity_data row' });
  }
});

// ==== Start Server ====
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server (API) is running on http://localhost:${PORT}`);
  console.log(`✅ Ready to link with your React app!`);
  console.log(`❗ Make sure your MariaDB server is running and database 'test' has a table named 'mou_data'!`);
});
