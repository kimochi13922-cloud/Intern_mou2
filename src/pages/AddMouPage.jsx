import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSql } from '../sql_connect';

const AddMouPage = () => {
    const navigate = useNavigate();
    const { addRow } = useSql();
    const [formData, setFormData] = useState({ Name: '', Owner: '', Faculty: '', Year: '', country_check: 'Inside' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Structure the data to match MariaDB columns
        const newMou = {
            Name: formData.Name,
            Owner: formData.Owner,
            Faculty: formData.Faculty,

            Year: formData.Year,
            country_check: formData.country_check
        };

        // 2. Add to MariaDB via Context -> Backend
        await addRow(newMou);
        alert("เพิ่มข้อมูล MOU สำเร็จ");
        
        // 3. Navigate back to Mou Page
        navigate('/add-Mou');

    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-xl font-bold text-gray-900">เพิ่มข้อมูล MOU ใหม่</h1>
                    <p className="mt-1 text-sm text-gray-500">กรุณากรอกข้อมูลรายละเอียดของ MOU ให้ครบถ้วนเพื่อบันทึกเข้าสู่ระบบ</p>
                </div>
                
                <form className="px-5 py-5 sm:px-8 sm:py-6 space-y-4" onSubmit={handleSubmit}>


                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">ชื่อ MOU</label>
                        <input type="text" id="title" placeholder="ระบุชื่อ MOU" value={formData.Name} onChange={(e) => setFormData({...formData, Name: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">ผู้รับผิดชอบ</label>
                            <input type="text" id="author" placeholder="ระบุชื่อผู้รับผิดชอบ" value={formData.Owner} onChange={(e) => setFormData({...formData, Owner: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>


                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">คณะ</label>
                            <input type="text" id="faculty" placeholder="ระบุคณะ" value={formData.Faculty} onChange={(e) => setFormData({...formData, Faculty: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>

                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">ปี (พ.ศ.)</label>
                            <input type="text" id="year" placeholder="เช่น 2569" value={formData.Year} onChange={(e) => setFormData({...formData, Year: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="country_check" className="block text-sm font-medium text-gray-700">ประเภท MOU (ภายใน/ต่างประเทศ)</label>
                            <select id="country_check" value={formData.country_check} onChange={(e) => setFormData({...formData, country_check: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                                <option value="Inside">ภายในประเทศ (Inside)</option>
                                <option value="InsideSpecial">ภายในประเทศ ลักษณะเฉพาะกิจ</option>
                                <option value="Outside">ต่างประเทศ (Outside)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={() => navigate('/MouPage')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            ยกเลิก
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200">
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMouPage;
