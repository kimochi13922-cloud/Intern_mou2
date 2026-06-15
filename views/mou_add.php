<?php
session_start();
// mou_add.php - Form to add a new MOU
require_once 'includes/auth.php';
require_once 'config/db.php';

// List of nations for dropdown
$nations = array('Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Timor-Leste', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe');
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>เพิ่มข้อมูล MOU ใหม่ - ระบบจัดการฐานข้อมูล MOU</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/intern_mou2/assets/css/style.css">
    <script>
        function handleNationChange(select) {
            var otherContainer = document.getElementById('other-nation-container');
            var selectContainer = document.getElementById('nation-select');
            
            if (select.value === 'Other') {
                selectContainer.style.display = 'none';
                otherContainer.style.display = 'flex';
                document.getElementById('nation_custom').required = true;
            }
        }
        
        function cancelCustomNation() {
            var otherContainer = document.getElementById('other-nation-container');
            var selectContainer = document.getElementById('nation-select');
            var customInput = document.getElementById('nation_custom');
            
            customInput.value = '';
            customInput.required = false;
            otherContainer.style.display = 'none';
            selectContainer.style.display = 'block';
            selectContainer.value = '';
        }
    </script>
</head>
<body>
    <div class="app-container">
        <?php include 'includes/navbar.php'; ?>

        <main class="main-content fade-up" style="max-width: 800px;">
            <div class="card">
                <div class="card-header">
                    <h3>เพิ่มข้อมูล MOU ใหม่</h3>
                    <p class="text-muted mt-2">กรุณากรอกข้อมูลรายละเอียดของ MOU ให้ครบถ้วน</p>
                </div>
                
                <div class="card-body">
                    <form method="POST" action="/intern_mou2/actions/process_mou.php">
                        <input type="hidden" name="action" value="create">
                        
                        <div class="form-group">
                            <label class="form-label">ชื่อ MOU <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control" required placeholder="ระบุชื่อ MOU">
                        </div>

                        <div class="form-row">
                            <div class="form-col form-group">
                                <label class="form-label">สถาบันที่ร่วม</label>
                                <input type="text" name="institution" class="form-control" placeholder="ระบุสถาบันที่ร่วม">
                            </div>
                            <div class="form-col form-group">
                                <label class="form-label">ผู้ประสานงานและที่อยู่ติดต่อคู่สัญญา</label>
                                <input type="text" name="contact" class="form-control" placeholder="ระบุผู้ประสานงานและที่อยู่ติดต่อคู่สัญญา">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col form-group">
                                <label class="form-label">ผู้รับผิดชอบ</label>
                                <input type="text" name="staff" class="form-control" placeholder="ระบุผู้รับผิดชอบ">
                            </div>
                            <div class="form-col form-group">
                                <label class="form-label">ระยะเวลา</label>
                                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center;">
                                    <input type="date" name="period_start" class="form-control" style="width: 100%;">
                                    <span style="color:var(--text-muted);">ถึง</span>
                                    <input type="date" name="period_end" class="form-control" style="width: 100%;">
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col form-group">
                                <label class="form-label">ประเภทเอกสาร</label>
                                <select name="type" class="form-control">
                                    <option value="">เลือกประเภท</option>
                                    <option value="MOU">MOU</option>
                                    <option value="MOA">MOA</option>
                                    <option value="LOI">LOI</option>
                                    <option value="LOA">LOA</option>
                                </select>
                            </div>
                            <div class="form-col form-group">
                                <label class="form-label">ประเทศ</label>

                                <select name="nation" id="nation-select" class="form-control" onchange="handleNationChange(this)">
                                    <option value="">เลือกประเทศ</option>
                                    <option value="ไทย">ไทย</option>
                                    <?php foreach ($nations as $n): ?>
                                    <option value="<?php echo htmlspecialchars($n, ENT_COMPAT, 'UTF-8'); ?>"><?php echo htmlspecialchars($n, ENT_COMPAT, 'UTF-8'); ?></option>
                                    <?php endforeach; ?>
                                    <option value="Other">Other (ระบุเอง)</option>
                                </select>
                                
                                <div id="other-nation-container" style="display: none; gap: 0.5rem;">
                                    <input type="text" name="nation_custom" id="nation_custom" class="form-control" placeholder="ระบุประเทศด้วยตนเอง">
                                    <button type="button" class="btn btn-secondary" onclick="cancelCustomNation()">ยกเลิก</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">ขอบเขต</label>
                            <select name="country_check" class="form-control">
                                <option value="Inside">ภายในประเทศ (Inside)</option>
                                <option value="InsideSpecial">ภายในประเทศ ลักษณะเฉพาะกิจ</option>
                                <option value="Outside">ต่างประเทศ (Outside)</option>
                            </select>
                        </div>
                        
                        <div class="flex justify-between mt-8" style="border-top: 1px solid var(--border); padding-top: 1.5rem;">
                            <a href="/intern_mou2/mou/list" class="btn btn-secondary">ยกเลิก</a>
                            <button type="submit" class="btn btn-primary">บันทึกข้อมูล</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</body>
</html>



