import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Tag,
  Sparkles,
  CheckCircle,
  X,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  cartQuantities: { [productId: string]: number };
  onSelectCategory: (cat: string) => void;
  onSearchChange: (q: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
  onResetFilters: () => void;
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'discount' | 'bestseller';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  selectedCategory,
  searchQuery,
  cartQuantities,
  onSelectCategory,
  onSearchChange,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
  onResetFilters,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(700);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Status check
      if (p.status !== 'active') return false;

      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // In stock filter
      if (inStockOnly && (!p.inStock || p.stock <= 0)) {
        return false;
      }

      // Offers filter
      if (offersOnly && p.discountPercent <= 0) {
        return false;
      }

      // Price limit
      if (p.price > priceMax) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, offersOnly, priceMax]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'discount':
        return list.sort((a, b) => b.discountPercent - a.discountPercent);
      case 'bestseller':
        return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      case 'recommended':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortOption]);

  const activeCategoryObject = categories.find((c) => c.name === selectedCategory);

  return (
    <section id="catalog-section" className="py-10 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-200/80 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <span>Smart Grocery Catalog</span>
              <span>/</span>
              <span className="text-[#15803D] font-bold">
                {selectedCategory || 'All Products'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {selectedCategory ? selectedCategory : 'Browse All Fresh Essentials'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Showing <span className="font-bold text-gray-900">{sortedProducts.length}</span> verified grocery items ready for fast local delivery.
            </p>
          </div>

          {/* Quick Controls: Sort & In-Stock */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 cursor-pointer shadow-xs"
              >
                <option value="recommended">Featured & Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discounts</option>
                <option value="bestseller">Best Selling Items</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                inStockOnly
                  ? 'bg-emerald-50 text-[#15803D] border-[#15803D]'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${inStockOnly ? 'text-[#15803D]' : 'text-gray-400'}`} />
              <span>In-Stock Only</span>
            </button>

            {/* Offers Only Toggle */}
            <button
              onClick={() => setOffersOnly(!offersOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                offersOnly
                  ? 'bg-amber-50 text-amber-800 border-amber-400'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Tag className={`w-3.5 h-3.5 ${offersOnly ? 'text-amber-600' : 'text-gray-400'}`} />
              <span>Discount Deals</span>
            </button>
          </div>
        </div>

        {/* Filter Bar with Horizontal Scrolling Chips & Price Slider */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
            <button
              onClick={() => onSelectCategory('')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-[#15803D] text-white shadow-xs font-bold'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              All Items ({products.filter((p) => p.status === 'active').length})
            </button>

            {categories
              .filter((c) => c.isVisible)
              .map((c) => {
                const isSelected = selectedCategory === c.name;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCategory(c.name)}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#15803D] text-white shadow-xs font-bold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
          </div>

          {/* Price Range Slider & Active Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-gray-200/80 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">Max Price: ₹{priceMax}</span>
              <input
                type="range"
                min="50"
                max="700"
                step="25"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-32 sm:w-48 accent-[#15803D] cursor-pointer"
              />
            </div>

            {/* Reset Filter Button if any filter active */}
            {(selectedCategory || searchQuery || inStockOnly || offersOnly || priceMax < 700) && (
              <button
                onClick={() => {
                  onResetFilters();
                  setInStockOnly(false);
                  setOffersOnly(false);
                  setPriceMax(700);
                  setSortOption('recommended');
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={cartQuantities[product.id] || 0}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          /* Empty Search & Filter State */
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200/80 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#15803D]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No matching groceries found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn't find items matching your search or filters. Try adjusting your query or request a custom order!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  onResetFilters();
                  setInStockOnly(false);
                  setOffersOnly(false);
                  setPriceMax(700);
                }}
                className="px-4 py-2 bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#166534] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
