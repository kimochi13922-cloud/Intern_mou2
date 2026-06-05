import React from 'react';
import { Link } from 'react-router-dom';

const ResearchPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">ตารางข้อมูลงานวิจัย</h1>
          <Link to="/add-research" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 shadow-sm">
              + เพิ่มงานวิจัย
          </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสงานวิจัย</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่องานวิจัย</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้แต่ง</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">งบประมาณ</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">RES-2026-001</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">การพัฒนา AI สำหรับการเกษตรอัจฉริยะ</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ดร. สมชาย ใจดี</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿500,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">แก้ไข</a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">RES-2026-002</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">วัสดุศาสตร์สำหรับแบตเตอรี่รุ่นใหม่</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">รศ. หญิง สมศรี รักเรียน</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿1,200,000</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">แก้ไข</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearchPage;
