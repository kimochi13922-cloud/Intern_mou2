import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddResearchPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for future backend integration.
        // For now, simply navigate back to the research page.
        navigate('/research');
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-8 sm:p-10 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-900">เพิ่มข้อมูลงานวิจัยใหม่</h1>
                    <p className="mt-2 text-sm text-gray-500">กรุณากรอกข้อมูลรายละเอียดของงานวิจัยให้ครบถ้วนเพื่อบันทึกเข้าสู่ระบบ</p>
                </div>
                
                <form className="px-6 py-8 sm:p-10 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="researchId" className="block text-sm font-medium text-gray-700">รหัสงานวิจัย</label>
                        <input type="text" id="researchId" placeholder="เช่น RES-2026-003" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">ชื่องานวิจัย</label>
                        <input type="text" id="title" placeholder="ระบุชื่องานวิจัย" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">ผู้แต่ง / หัวหน้าโครงการ</label>
                            <input type="text" id="author" placeholder="ระบุชื่อผู้แต่ง" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>

                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">งบประมาณ (บาท)</label>
                            <input type="number" id="budget" placeholder="เช่น 500000" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>
                    </div>
                    
                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={() => navigate('/research')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            ยกเลิก
                        </button>
                        <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200">
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResearchPage;
