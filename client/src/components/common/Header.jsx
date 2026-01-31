import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-200">
            {/* Title / Breadcrumbs */}
            <div className="flex items-center gap-3 transition-opacity">
                <img src="/logo.png" alt="Navigate Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Navigate</h2>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all w-64"
                    />
                </div>



                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </header>
    );
}
