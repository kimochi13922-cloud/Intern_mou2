import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSql } from '../sql_connect';

const routIdInfo = (navigate, id) => {
    navigate(`/mouInfo?id=${id}`);
}

const MouPage = () => {
  const navigate = useNavigate();
  const { sqlData, loading, refreshData } = useSql();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
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

  // Extract unique options from data for filters
  const uniqueYears = Array.from(new Set((sqlData || []).map(item => String(item.Year || '')).filter(Boolean))).sort((a, b) => b - a);
  const uniqueFaculties = Array.from(new Set((sqlData || []).map(item => String(item.Faculty || '')).filter(Boolean))).sort();

  // Filter logic
  const filteredMou = (sqlData || []).filter((item) => {
    // Gracefully handle potentially missing or undefined fields
    const safeTitle = String(item.Name || '');
    const safeAuthor = String(item.Owner || '');
    const safeFaculty = String(item.Faculty || '');
    const safeYear = String(item.Year || '');

    const matchesSearch = searchTerm === '' ||
      safeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeFaculty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = yearFilter === '' || safeYear === yearFilter;
    const matchesFaculty = facultyFilter === '' || safeFaculty === facultyFilter;

    return matchesSearch && matchesYear && matchesFaculty;
  });

  // Sort logic
  const sortedMou = [...filteredMou].sort((a, b) => {
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
          <h1 className="text-2xl font-bold text-gray-900">ตารางข้อมูล MOU</h1>
          
          <div className="flex gap-3">
              <button 
                  onClick={refreshData}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  รีเฟรชข้อมูล
              </button>
              <Link to="/add-Mou" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  เพิ่ม MOU
              </Link>
          </div>
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
                      placeholder="ค้นหาชื่อ MOU, หรือผู้รับผิดชอบ..."
                      className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
              </div>

              {/* Faculty Filter */}
              <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-w-[140px] max-w-[200px] truncate"
              >
                  <option value="">คณะทั้งหมด</option>
                  {uniqueFaculties.map((faculty, index) => (
                      <option key={index} value={faculty}>{faculty}</option>
                  ))}
              </select>

              {/* Year Filter */}
              <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-w-[120px]"
              >
                  <option value="">ปีทั้งหมด</option>
                  {uniqueYears.map((year, index) => (
                      <option key={index} value={year}>{year}</option>
                  ))}
              </select>
          </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
          แสดง {filteredMou.length} จาก {sqlData ? sqlData.length : 0} รายการ
      </p>

      <div className="bg-white shadow overflow-x-auto sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('Name')}>ชื่อ MOU <SortIcon column="Name" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('Owner')}>ผู้รับผิดชอบ <SortIcon column="Owner" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('Faculty')}>คณะ <SortIcon column="Faculty" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('Budget')}>งบประมาณ <SortIcon column="Budget" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => handleSort('Year')}>ปี <SortIcon column="Year" /></th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
               <tr>
                 <td colSpan="8" className="px-6 py-12 text-center">
                   <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                   </div>
                   <p className="text-gray-500 mt-4 font-medium">กำลังโหลดข้อมูลจาก Database...</p>
                 </td>
               </tr>
            ) : sortedMou.length > 0 ? (
              sortedMou.map((item, index) => {
                const budgetNum = Number(item.Budget) || 0;
                
                return (
                  <tr key={item.ID || index} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Owner}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Faculty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿{budgetNum.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" onClick={(e) => { e.preventDefault(); routIdInfo(navigate, item.ID); }} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">ดูรายละเอียด</a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <p className="text-gray-500 font-medium">
                    {sqlData && sqlData.length === 0 ? "ยังไม่มีข้อมูล MOU ในฐานข้อมูล" : "ไม่พบข้อมูลที่ค้นหา"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                     {sqlData && sqlData.length === 0 ? "เพิ่ม MOU ใหม่เพื่อเริ่มต้น" : "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MouPage;
