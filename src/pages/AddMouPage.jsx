import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSql } from '../sql_connect';

export const NATION_LIST = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Timor-Leste', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

const AddMouPage = () => {
    const navigate = useNavigate();
    const { addRow } = useSql();
    const [formData, setFormData] = useState({ 
        name: '', 
        institution: '', 
        contact: '', 
        staff: '', 
        period: '',
        type: '',
        nation: '',
        country_check: 'Inside' 
    });
    const [isOtherNation, setIsOtherNation] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const formatToThaiDate = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${parseInt(y) + 543}`;
    };

    useEffect(() => {
        if (startDate || endDate) {
            const startStr = formatToThaiDate(startDate);
            const endStr = formatToThaiDate(endDate);
            const periodStr = `${startStr || '??/??/????'} - ${endStr || '??/??/????'}`;
            setFormData(f => ({ ...f, period: periodStr }));
        } else {
            setFormData(f => ({ ...f, period: '' }));
        }
    }, [startDate, endDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Structure the data to match MariaDB columns
        const newMou = {
            name: formData.name,
            institution: formData.institution,
            contact: formData.contact,
            staff: formData.staff,
            period: formData.period,
            type: formData.type,
            nation: formData.nation,
            country_check: formData.country_check
        };

        // Add to MariaDB via Context -> Backend
        await addRow(newMou);
        alert("เพิ่มข้อมูล MOU สำเร็จ");
        
        // Refresh everything
        window.location.reload();
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อ MOU</label>
                        <input type="text" id="name" placeholder="ระบุชื่อ MOU" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">สถาบันที่ร่วม</label>
                            <input type="text" id="institution" placeholder="ระบุสถาบันที่ร่วม" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">ผู้ประสานงาน</label>
                            <input type="text" id="contact" placeholder="ระบุผู้ประสานงาน" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="staff" className="block text-sm font-medium text-gray-700">ผู้รับผิดชอบ</label>
                            <input type="text" id="staff" placeholder="ระบุผู้รับผิดชอบ" value={formData.staff} onChange={(e) => setFormData({...formData, staff: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ระยะเวลา (วัน/เดือน/ปี)</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                                <span className="text-gray-500">-</span>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">ประเภทความร่วมมือ</label>
                            <select id="type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                                <option value="">เลือกประเภท</option>
                                <option value="MOU">MOU</option>
                                <option value="MOA">MOA</option>
                                <option value="LOI">LOI</option>
                                <option value="LOA">LOA</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="nation" className="block text-sm font-medium text-gray-700">ประเทศ</label>
                            {isOtherNation ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="text" id="nation" placeholder="ระบุประเทศด้วยตนเอง" value={formData.nation} onChange={(e) => setFormData({...formData, nation: e.target.value})} className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                                    <button type="button" onClick={() => { setIsOtherNation(false); setFormData({...formData, nation: ''}); }} className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors whitespace-nowrap">ยกเลิก</button>
                                </div>
                            ) : (
                                <select id="nation" value={formData.nation} onChange={(e) => {
                                    if (e.target.value === 'Other') {
                                        setIsOtherNation(true);
                                        setFormData({...formData, nation: ''});
                                    } else {
                                        setFormData({...formData, nation: e.target.value});
                                    }
                                }} className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                                    <option value="">เลือกประเทศ</option>
                                    <option value="ไทย">ไทย</option>
                                    {NATION_LIST
                                    .sort((a, b) => a.localeCompare(b, 'en'))
                                    .map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                    <option value="Other">Other (ระบุเอง)</option>
                                </select>
                            )}
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
