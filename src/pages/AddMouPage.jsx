import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSql } from '../sql_connect';

const AddMouPage = () => {
    const navigate = useNavigate();
    const { addRow } = useSql();
    const [formData, setFormData] = useState({ Name: '', Owner: '', Faculty: '', Budget: '', Year: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Structure the data to match MariaDB columns
        const newMou = {
            Name: formData.Name,
            Owner: formData.Owner,
            Faculty: formData.Faculty,
            Budget: parseFloat(formData.Budget),
            Year: formData.Year
        };

        // 2. Add to MariaDB via Context -> Backend
        await addRow(newMou);
        alert("เพิ่มข้อมูล MOU สำเร็จ");
        
        // 3. Navigate back to Mou Page
        navigate('/add-Mou');

    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-8 sm:p-10 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-900">เพิ่มข้อมูล MOU ใหม่</h1>
                    <p className="mt-2 text-sm text-gray-500">กรุณากรอกข้อมูลรายละเอียดของ MOU ให้ครบถ้วนเพื่อบันทึกเข้าสู่ระบบ</p>
                </div>
                
                <form className="px-6 py-8 sm:p-10 space-y-6" onSubmit={handleSubmit}>


                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">ชื่อ MOU</label>
                        <input type="text" id="title" placeholder="ระบุชื่อ MOU" value={formData.Name} onChange={(e) => setFormData({...formData, Name: e.target.value})} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">ผู้รับผิดชอบ</label>
                            <input type="text" id="author" placeholder="ระบุชื่อผู้รับผิดชอบ" value={formData.Owner} onChange={(e) => setFormData({...formData, Owner: e.target.value})} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>

                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">งบประมาณ (บาท)</label>
                            <input type="number" id="budget" placeholder="เช่น 500000" value={formData.Budget} onChange={(e) => setFormData({...formData, Budget: e.target.value})} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">คณะ</label>
                            <input type="text" id="faculty" placeholder="ระบุคณะ" value={formData.Faculty} onChange={(e) => setFormData({...formData, Faculty: e.target.value})} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>

                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">ปี (พ.ศ.)</label>
                            <input type="text" id="year" placeholder="เช่น 2569" value={formData.Year} onChange={(e) => setFormData({...formData, Year: e.target.value})} className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>
                    </div>
                    
                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={() => navigate('/Mou')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
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

export default AddMouPage;
