import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample data — will be replaced by API data later
const allResearch = [
  { id: 1, code: 'RES-2026-001', title: 'การพัฒนา AI สำหรับการเกษตรอัจฉริยะ', author: 'ดร. สมชาย ใจดี', faculty: 'เทคโนโลยีสารสนเทศ', budget: 500000, year: '2569' },
  { id: 2, code: 'RES-2026-002', title: 'วัสดุศาสตร์สำหรับแบตเตอรี่รุ่นใหม่', author: 'รศ. หญิง สมศรี รักเรียน', faculty: 'วิทยาศาสตร์พื้นฐาน', budget: 1200000, year: '2569' },
  { id: 3, code: 'RES-2025-003', title: 'ผลกระทบของ PM2.5 ต่อสุขภาพปอดในเขตเมือง', author: 'ผศ.ดร. วรัญญา ศรีสมบัติ', faculty: 'วิทยาศาสตร์สุขภาพ', budget: 800000, year: '2568' },
  { id: 4, code: 'RES-2025-004', title: 'การประยุกต์ใช้ Blockchain ในระบบห่วงโซ่อุปทาน', author: 'ดร. ณัฐพล ธรรมชัย', faculty: 'วิศวกรรมศาสตร์', budget: 650000, year: '2568' },
  { id: 5, code: 'RES-2024-005', title: 'การศึกษาพฤติกรรมผู้บริโภคออนไลน์ยุค Post-COVID', author: 'รศ.ดร. พิมพ์ชนก อาภรณ์ทิพย์', faculty: 'เศรษฐศาสตร์', budget: 350000, year: '2567' },
  { id: 6, code: 'RES-2026-006', title: 'การวิเคราะห์ความเครียดในโครงสร้างอาคารสูงด้วย IoT', author: 'รศ.ดร. กิตติพงษ์ รัตนโชติ', faculty: 'วิศวกรรมศาสตร์', budget: 920000, year: '2569' },
  { id: 7, code: 'RES-2025-007', title: 'การพัฒนาหลักสูตรออนไลน์สำหรับผู้สูงอายุ', author: 'ผศ.ดร. นิภา เฉลิมพร', faculty: 'ศึกษาศาสตร์', budget: 280000, year: '2568' },
  { id: 8, code: 'RES-2024-008', title: 'การใช้โดรนในการสำรวจพื้นที่ป่าเขตร้อน', author: 'ดร. สุรชัย วงศ์สวัสดิ์', faculty: 'เกษตรศาสตร์', budget: 750000, year: '2567' },
  { id: 9, code: 'RES-2026-009', title: 'การพัฒนายาต้านมะเร็งจากสมุนไพรไทย', author: 'ศ.ดร. อรุณี พงษ์เจริญ', faculty: 'เภสัชศาสตร์', budget: 1500000, year: '2569' },
  { id: 10, code: 'RES-2025-010', title: 'ผลของการเรียนแบบห้องเรียนกลับด้านต่อทักษะการคิดเชิงวิพากษ์', author: 'ผศ.ดร. ธนากร เลิศพงษ์', faculty: 'ศึกษาศาสตร์', budget: 420000, year: '2568' },
  { id: 11, code: 'RES-2024-011', title: 'การศึกษาความเป็นไปได้ของการท่องเที่ยวเชิงนิเวศหลัง COVID-19', author: 'ดร. ประภัสสร สุขศรี', faculty: 'มนุษยศาสตร์', budget: 380000, year: '2567' },
  { id: 12, code: 'RES-2026-012', title: 'การออกแบบวงจรรวมไฟฟ้าแบบ Smart Grid สำหรับชุมชนชนบท', author: 'รศ.ดร. วิรัช เมธาวิทย์', faculty: 'วิศวกรรมศาสตร์', budget: 1100000, year: '2569' },
  { id: 13, code: 'RES-2025-013', title: 'การวิเคราะห์คุณภาพน้ำใต้ดินในพื้นที่เกษตรกรรม', author: 'ดร. อัญชลี พิทักษ์ธรรม', faculty: 'เกษตรศาสตร์', budget: 560000, year: '2568' },
  { id: 14, code: 'RES-2024-014', title: 'การพัฒนาระบบตรวจจับโรคหัวใจด้วย Wearable Sensor', author: 'ผศ.ดร. นภัส กิจวัฒนา', faculty: 'วิทยาศาสตร์สุขภาพ', budget: 980000, year: '2567' },
  { id: 15, code: 'RES-2026-015', title: 'ผลของนโยบายการเงินดิจิทัลต่อ SME ไทย', author: 'ศ.ดร. พรรณราย พัฒนศิริ', faculty: 'เศรษฐศาสตร์', budget: 470000, year: '2569' },
];

const ResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortKey, setSortKey] = useState(null);      // 'code' | 'title' | 'author' | 'faculty' | 'budget' | 'year'
  const [sortDir, setSortDir] = useState('asc');      // 'asc' | 'desc'

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Filter logic
  const filteredResearch = allResearch.filter((item) => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = yearFilter === '' || item.year === yearFilter;

    return matchesSearch && matchesYear;
  });

  // Sort logic
  const sortedResearch = [...filteredResearch].sort((a, b) => {
    if (!sortKey) return 0;
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Sort indicator component
  const SortIcon = ({ column }) => {
    if (sortKey !== column) {
      return (
        <svg className="w-3 h-3 ml-1 text-gray-300 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
      );
    }
    return sortDir === 'asc' ? (
      <svg className="w-3 h-3 ml-1 text-indigo-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
    ) : (
      <svg className="w-3 h-3 ml-1 text-indigo-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">ตารางข้อมูลงานวิจัย</h1>
          <Link to="/add-research" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              เพิ่มงานวิจัย
          </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="ค้นหาชื่องานวิจัย, รหัส, หรือผู้แต่ง..."
                      className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
              </div>

              {/* Year Filter */}
              <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-w-[140px]"
              >
                  <option value="">ปีทั้งหมด</option>
                  <option value="2569">2569</option>
                  <option value="2568">2568</option>
                  <option value="2567">2567</option>
              </select>
          </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
          แสดง {filteredResearch.length} จาก {allResearch.length} รายการ
      </p>

      <div className="bg-white shadow overflow-x-auto sm:rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('code')}>รหัสงานวิจัย <SortIcon column="code" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('title')}>ชื่องานวิจัย <SortIcon column="title" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('author')}>ผู้แต่ง <SortIcon column="author" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('faculty')}>คณะ <SortIcon column="faculty" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('budget')}>งบประมาณ <SortIcon column="budget" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('year')}>ปี <SortIcon column="year" /></th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResearch.length > 0 ? (
              sortedResearch.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.faculty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿{item.budget.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">ดูรายละเอียด</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <p className="text-gray-500 font-medium">ไม่พบข้อมูลที่ค้นหา</p>
                  <p className="text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearchPage;
