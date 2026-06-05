import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage = () => {
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
                    ระบบจัดการงานวิจัย
                </span>
                <h1 className="fade-up delay-1 text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                    ศูนย์กลาง<br />
                    <span className="text-indigo-600">งานวิจัยคณะวิศวกรรมศาสตร์</span>
                </h1>
                <p className="fade-up delay-2 text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                    รวบรวม จัดเก็บ และเผยแพร่งานวิจัยจากนักวิจัยทั่วทั้งมหาวิทยาลัย
                </p>
                <div className="fade-up delay-3 flex flex-wrap gap-3">
                    <Link to="/research" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        ดูงานวิจัยทั้งหมด
                    </Link>
                    <Link to="/add-research" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-sm border border-indigo-200 hover:border-indigo-400 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        เพิ่มงานวิจัย
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 fade-up">
                    <div className="text-3xl font-bold text-indigo-600 counter" data-target="0">0</div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">งานวิจัยทั้งหมด</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 fade-up delay-1">
                    <div className="text-3xl font-bold text-cyan-600 counter" data-target="0">0</div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">นักวิจัย</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 fade-up delay-2">
                    <div className="text-3xl font-bold text-violet-600 counter" data-target="0">0</div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">สาขาวิชา</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 fade-up delay-3">
                    <div className="text-3xl font-bold text-emerald-600 counter" data-target="0">0</div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">การดาวน์โหลด</div>
                </div>

            </div>
        </div>
      </section>

      {/* ================= งานวิจัยล่าสุด ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="section-title text-2xl font-bold text-gray-900 fade-up">งานวิจัยล่าสุด</h2>
                    <p className="text-gray-400 mt-4 text-sm fade-up delay-1">อัปเดตล่าสุด · มิถุนายน 2568</p>
                </div>
                <a href="#" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors fade-up">
                    ดูทั้งหมด
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    <p className="text-gray-500 font-medium">ไม่มีข้อมูลงานวิจัย</p>
                    <p className="text-gray-400 text-sm mt-1">กำลังรอการเชื่อมต่อฐานข้อมูล...</p>
                </div>

            </div>
        </div>
      </section>

      {/* ================= หมวดหมู่ / สาขาวิชา ================= */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h2 className="section-title text-2xl font-bold text-gray-900 fade-up">หมวดหมู่ / สาขาวิชา</h2>
                <p className="text-gray-400 mt-4 text-sm fade-up delay-1">เลือกสาขาที่สนใจเพื่อดูงานวิจัยที่เกี่ยวข้อง</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">

                <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-500 font-medium">ไม่มีข้อมูลหมวดหมู่</p>
                </div>

            </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-indigo-600 font-bold text-lg" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>ENNU ResearchHub</span>
            <p className="text-gray-400 text-sm">© 2569 ENNU ResearchHub · ศูนย์กลางงานวิจัยคณะวิศวกรรมศาสตร์มหาวิทยาลัยนเรศวร</p>
        </div>
      </footer>
    </>
  );
};

export default IndexPage;
