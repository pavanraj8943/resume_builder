import React from 'react';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { ArrowLeft, Bot } from 'lucide-react';

export function InterviewPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
                        <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
                    </div>
                </div>
            </div>

            {/* Main Content - Chat Interface */}
            <div className="h-[calc(100vh-200px)] min-h-[500px]">
                <ChatInterface />
            </div>
        </div>
    );
}
