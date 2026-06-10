import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center mr-8">
                            <span className="max-w-10"><img src="ennulogo.png" alt="NU MouHub" /></span>
                        </div>
                        <div className="hidden md:flex space-x-1">
                            <Link to="/" className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium transition duration-150 ${location.pathname === '/' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Home
                            </Link>
                            <Link to="/MouPage" className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium transition duration-150 ${location.pathname === '/MouPage' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                จัดการ MOU
                            </Link>
                        </div>
                    </div>
                    <div className="flex">
                        {localStorage.getItem('auth') === 'true' ? (
                            <button onClick={() => { localStorage.removeItem('auth'); window.location.href = '/'; }} className="inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium transition duration-150 border-transparent text-gray-500 hover:text-red-600 hover:border-red-300">
                                ออกจากระบบ
                            </button>
                        ) : (
                            <Link to="/login" className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium transition duration-150 ${location.pathname === '/login' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                เข้าสู่ระบบ
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
