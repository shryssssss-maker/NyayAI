'use client';
import React from 'react';
import { Sidebar } from '../../../../components/sidebar';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f1e3f] overflow-hidden">
      <div className="shrink-0 h-screen z-50 md:sticky md:top-0 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-none bg-white dark:bg-[#0a152e]">
        <Sidebar />
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-serif text-[#997953] dark:text-[#cdaa80]">Settings</h1>
        <p className="text-gray-600 dark:text-white/60 mt-4">Configuration and account settings will appear here.</p>
      </div>
    </div>
  );
}
