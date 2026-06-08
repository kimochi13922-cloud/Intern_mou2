const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// อนุญาตให้ React App (Frontend) เข้าถึง Backend ได้
app.use(cors());
app.use(express.json()); // Parses JSON bodies

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
    const [rows] = await dbPool.execute('SELECT * FROM mou_data ORDER BY Year DESC, ID DESC');
    res.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 2. POST /api/mou_data - เพิ่มข้อมูลใหม่จากฟอร์มใน React
app.post('/api/mou_data', async (req, res) => {
  try {
    const { Name, Owner, Faculty, Year, Status = 'รอดำเนินการ', country_check = 'Inside' } = req.body;
    
    const [result] = await dbPool.execute(
      'INSERT INTO mou_data (Name, Owner, Faculty, Year, Status, country_check) VALUES (?, ?, ?, ?, ?, ?)', 
      [Name, Owner, Faculty, Year, Status, country_check]
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
    const { Status } = req.body;
    if (Status === undefined) return res.status(400).json({ error: 'Status is required' });

    const [result] = await dbPool.execute(
      'UPDATE mou_data SET Status = ? WHERE ID = ?',
      [Status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Row not found in mou_data' });
    }
    res.json({ message: 'Status updated successfully', id, Status });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// 5. PUT /api/mou_data/:id - อัปเดตข้อมูล MOU ทั้งหมด
app.put('/api/mou_data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Owner, Faculty, Year, country_check } = req.body;
    const [result] = await dbPool.execute(
      'UPDATE mou_data SET Name = ?, Owner = ?, Faculty = ?, Year = ?, country_check = ? WHERE ID = ?',
      [Name, Owner, Faculty, Year, country_check, id]
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
    res.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: 'Failed to fetch activity_data' });
  }
});

// 4. POST /api/activity_data - เพิ่มข้อมูลใหม่เข้าตาราง activity_data
app.post('/api/activity_data', async (req, res) => {
  try {
    const { activities_desc, ownerid, activities, activities_pic } = req.body;

    const [result] = await dbPool.execute(
      'INSERT INTO activity_data (activities_desc, ownerid, activities, activities_pic) VALUES (?, ?, ?, ?)',
      [activities_desc, ownerid, activities, activities_pic]
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
    const { activities, activities_desc } = req.body;
    const [result] = await dbPool.execute(
      'UPDATE activity_data SET activities = ?, activities_desc = ? WHERE mouid = ?',
      [activities, activities_desc, id]
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
