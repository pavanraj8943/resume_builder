import React, { useState } from 'react';
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Briefcase } from 'lucide-react';

export function Sidebar() {
    const [active, setActive] = useState('dashboard');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume', label: 'My Resume', icon: FileText },
        { id: 'interview', label: 'Navigate Assistant', icon: MessageSquare },
        { id: 'jobs', label: 'Job Matches', icon: Briefcase },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 transition-all duration-300">


            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${active === item.id
                            ? 'bg-blue-600/10 text-blue-400'
                            : 'hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${active === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* User Info / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
