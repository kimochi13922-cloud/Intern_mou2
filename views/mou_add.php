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
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <style>
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    </style>
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
<body class="font-sans antialiased text-slate-900 bg-slate-50">
    <div class="min-h-screen flex flex-col">
        <?php include 'includes/navbar.php'; ?>

        <main class="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 fade-up">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-6 md:p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <h3 class="text-2xl font-bold text-slate-900 font-['Chakra_Petch']">เพิ่มข้อมูล MOU ใหม่</h3>
                    <p class="text-slate-500 mt-2">กรุณากรอกข้อมูลรายละเอียดของ MOU ให้ครบถ้วน</p>
                </div>
                
                <div class="p-6 md:p-8">
                    <form method="POST" action="/intern_mou2/actions/process_mou.php">
                        <input type="hidden" name="action" value="create">
                        
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-slate-700 mb-2">ชื่อ MOU <span class="text-red-500">*</span></label>
                            <input type="text" name="name" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" required placeholder="ระบุชื่อ MOU">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">สถาบันที่ร่วม</label>
                                <input type="text" name="institution" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="ระบุสถาบันที่ร่วม">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">ผู้ประสานงานและที่อยู่ติดต่อคู่สัญญา</label>
                                <input type="text" name="contact" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="ระบุผู้ประสานงานและที่อยู่ติดต่อคู่สัญญา">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">ผู้รับผิดชอบ</label>
                                <input type="text" name="staff" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="ระบุผู้รับผิดชอบ">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">ระยะเวลา</label>
                                <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                                    <input type="date" name="period_start" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm">
                                    <span class="text-slate-500">ถึง</span>
                                    <input type="date" name="period_end" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm">
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">ประเภทเอกสาร</label>
                                <select name="type" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm">
                                    <option value="">เลือกประเภท</option>
                                    <option value="MOU">MOU</option>
                                    <option value="MOA">MOA</option>
                                    <option value="LOI">LOI</option>
                                    <option value="LOA">LOA</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">ประเทศ</label>

                                <select name="nation" id="nation-select" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" onchange="handleNationChange(this)">
                                    <option value="">เลือกประเทศ</option>
                                    <option value="ไทย">ไทย</option>
                                    <?php foreach ($nations as $n): ?>
                                    <option value="<?php echo htmlspecialchars($n, ENT_COMPAT, 'UTF-8'); ?>"><?php echo htmlspecialchars($n, ENT_COMPAT, 'UTF-8'); ?></option>
                                    <?php endforeach; ?>
                                    <option value="Other">Other (ระบุเอง)</option>
                                </select>
                                
                                <div id="other-nation-container" class="hidden gap-2">
                                    <input type="text" name="nation_custom" id="nation_custom" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm flex-1" placeholder="ระบุประเทศด้วยตนเอง">
                                    <button type="button" class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm" onclick="cancelCustomNation()">ยกเลิก</button>
                                </div>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-slate-700 mb-2">ขอบเขต</label>
                            <select name="country_check" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm">
                                <option value="Inside">ภายในประเทศ (Inside)</option>
                                <option value="InsideSpecial">ภายในประเทศ ลักษณะเฉพาะกิจ</option>
                                <option value="Outside">ต่างประเทศ (Outside)</option>
                            </select>
                        </div>
                        
                        <div class="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
                            <a href="/intern_mou2/mou/list" class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">ยกเลิก</a>
                            <button type="submit" class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">บันทึกข้อมูล</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
