import React from 'react';
import { Link } from 'react-router-dom';
import { useSql } from '../sql_connect';


const IndexPage = () => {
  const { sqlData, loading } = useSql();
  
  // Calculate statistics
  const safeSqlData = Array.isArray(sqlData) ? sqlData : [];
  const totalMOU = safeSqlData.length;
  const uniqueFaculties = new Set(safeSqlData.map(item => item.Faculty).filter(Boolean)).size;
  return (
    <>
      <section className="hero-bg relative overflow-hidden py-20 md:py-28">
        {/* Decorative dots top-right */}
        <div className="dot-pattern absolute top-0 right-0 w-64 h-64 opacity-60 pointer-events-none"></div>
        {/* Decorative circle */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-100 opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
                    <span className="fade-up inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5 border border-indigo-100">
                        ระบบจัดการฐานข้อมูล MOU
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 fade-up delay-1" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                        ระบบจัดการฐานข้อมูล <span className="text-indigo-600">MOU</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 fade-up delay-2 font-light">
                        รวบรวม จัดเก็บ และเผยแพร่ข้อมูล MOU ทั่วทั้งมหาวิทยาลัย
                    </p>
                    <div className="fade-up delay-3 flex flex-wrap gap-3">
                        <Link to="/MouPage" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            ดู MOU ทั้งหมด
                    </Link>
                    <Link to="/add-Mou" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-sm border border-indigo-200 hover:border-indigo-400 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        เพิ่ม MOU
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 fade-up">
                    <div className="text-3xl font-bold text-indigo-600">
                        {loading ? <span className="animate-pulse">...</span> : totalMOU}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">MOU ทั้งหมด</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 fade-up delay-1">
                    <div className="text-3xl font-bold text-cyan-600">
                        {loading ? <span className="animate-pulse">...</span> : uniqueFaculties}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">คณะ</div>
                </div>

            </div>
        </div>
      </section>



      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-indigo-600 font-bold text-lg" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>ENNU MouHub</span>
            <p className="text-gray-400 text-sm">© 2569 ENNU MouHub · ศูนย์กลางงานวิจัยคณะวิศวกรรมศาสตร์มหาวิทยาลัยนเรศวร</p>
        </div>
      </footer>
    </>
  );
};

export default IndexPage;
