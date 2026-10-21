import React from 'react';
import { Category, Product } from '../types';
import { GroceryImage } from './common/GroceryImage';
import { ArrowRight } from 'lucide-react';

interface CategoriesSectionProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
}) => {
  // Only show visible categories
  const visibleCategories = categories
    .filter((c) => c.isVisible)
    .sort((a, b) => a.order - b.order);

  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName && p.status === 'active').length;
  };

  return (
    <section id="categories-section" className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#15803D] uppercase tracking-wider mb-1">
              <span>Browse by Department</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              All Grocery Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a category to explore fresh essentials, staples, dairy and household needs.
            </p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => onSelectCategory('')}
              className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 16 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = getProductCount(cat.name);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.name);
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group flex flex-col items-center text-center p-3 rounded-2xl transition-all border text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#F0FDF4] border-[#15803D] ring-2 ring-[#15803D]/20 shadow-xs'
                    : 'bg-[#F8FAF8] hover:bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2.5 bg-white shadow-xs group-hover:scale-105 transition-transform">
                  <GroceryImage
                    src={cat.imageUrl}
                    alt={cat.name}
                    category={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3
                  className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                    isSelected ? 'text-[#15803D]' : 'text-gray-900 group-hover:text-[#15803D]'
                  }`}
                >
                  {cat.name}
                </h3>

                <span className="text-[11px] text-gray-400 font-medium mt-1">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
