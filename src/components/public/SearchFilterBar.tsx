'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { TenantCategory } from '@/types/database';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: TenantCategory;
  onSelectCategory: (category: TenantCategory) => void;
}

const CATEGORIES: TenantCategory[] = [
  'Semua',
  'Jajanan Viral',
  'Makanan Berat',
  'Minuman',
  'Dessert',
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}: SearchFilterBarProps) {
  return (
    <div className="mb-6 space-y-3">
      {/* Search Bar Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C] dark:text-[#A8A29E]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari toko, sate, es, crepes, laksa..."
          className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#78716C] dark:placeholder:text-[#A8A29E]/60 focus:outline-none focus:border-[#D9531E] transition duration-200 min-h-[48px]"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#78716C] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition duration-200 min-h-[40px] flex items-center ${
                isActive
                  ? 'bg-[#D9531E] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] dark:text-[#A8A29E] hover:border-[#D9531E]/40'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
