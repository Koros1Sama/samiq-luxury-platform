'use client';

import React from 'react';

const TABS = [
  { id: 'tab-store', label: 'المتجر', href: '#products' },
  { id: 'tab-routine', label: 'روتيني', href: '#routine' },
  { id: 'tab-auth', label: 'تحقق من الدفعة', href: '#authenticity' },
  { id: 'tab-contact', label: 'تواصل', href: '#contact' },
];

export function ClinicNavTabs() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="أقسام المتجر السريري"
      className="w-full bg-[#F2F7F5] border-b border-[#E2ECE9] px-3 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={tab.href}
            onClick={(e) => handleClick(e, tab.href)}
            className="min-h-[40px] px-3.5 rounded-lg inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-[#0F4C4A] hover:bg-[#CFE8E1]/60 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors whitespace-nowrap"
          >
            {tab.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
