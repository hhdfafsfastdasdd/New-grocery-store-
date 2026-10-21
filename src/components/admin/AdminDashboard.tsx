import React, { useState, useMemo } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  MessageCircle,
  RefreshCw,
  Download,
  Upload,
  ArrowLeft,
  Filter,
  Check,
  TrendingUp,
  AlertTriangle,
  Sliders,
  DollarSign,
  Shield,
  FileText,
} from 'lucide-react';
import {
  Category,
  CustomOrderRequest,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
} from '../../types';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
  saveStoreSettings,
  resetToSeedData,
  saveProducts,
  getCustomOrders,
  updateCustomOrderStatus,
} from '../../services/storage';
import { logoutAdmin } from '../../services/auth';
import { openCustomerChatWhatsApp } from '../../services/whatsapp';
import { showToast } from '../common/Toast';
import { GroceryImage } from '../common/GroceryImage';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  onExit: () => void;
}

type AdminTab = 'overview' | 'products' | 'categories' | 'orders' | 'custom-orders' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  settings,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Product edit/create state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Category edit state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Orders filter state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderAreaFilter, setOrderAreaFilter] = useState<string>('all');

  // Custom orders state
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>(getCustomOrders());

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });

  // Metrics
  const activeProducts = products.filter((p) => p.status === 'active');
  const outOfStockProducts = products.filter((p) => !p.inStock || p.stock <= 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.finalTotal, 0);

  // Filtered Products for table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCatFilter && p.category !== productCatFilter) return false;
      if (productStockFilter === 'in-stock' && (!p.inStock || p.stock <= 0)) return false;
      if (productStockFilter === 'out-of-stock' && p.inStock && p.stock > 0) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, productCatFilter, productStockFilter, productSearch]);

  // Filtered Orders for table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderAreaFilter !== 'all' && o.customer.area !== orderAreaFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.customer.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderAreaFilter, orderSearch]);

  const handleLogout = () => {
    logoutAdmin();
    showToast('Logged out of Admin Portal.', 'info');
    onExit();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settingsForm);
    showToast('Store settings updated successfully!', 'success');
  };

  const handleExportData = () => {
    const data = {
      products,
      categories,
      orders,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_grocery_backup_${Date.now()}.json`;
    a.click();
    showToast('Backup file downloaded.', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products) saveProducts(parsed.products);
        if (parsed.settings) saveStoreSettings(parsed.settings);
        showToast('Catalog & store data restored successfully!', 'success');
      } catch (err) {
        showToast('Failed to parse backup JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-900">
      {/* Top Admin Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Store</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#15803D] flex items-center justify-center text-white">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold leading-none text-white">
                    Smart Grocery Control Center
                  </h1>
                  <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                    Owner Dashboard · Khordha & Jatani
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300 font-mono">
                bgmia3412@gmail.com
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-semibold transition-colors cursor-pointer border border-red-800/50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-medium border-t border-gray-800/60 pt-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'products', label: `Products (${products.length})`, icon: Package },
              { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
              { id: 'custom-orders', label: `Custom Orders (${customOrders.length})`, icon: MessageCircle },
              { id: 'settings', label: 'Store Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#15803D] text-white font-bold shadow-xs'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Total Catalog</p>
                <p className="text-2xl font-black text-gray-900 font-mono mt-1">{products.length}</p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-1">100+ active items</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Active Products</p>
                <p className="text-2xl font-black text-[#15803D] font-mono mt-1">{activeProducts.length}</p>
                <p className="text-[10px] text-gray-500 mt-1">Available to buy</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Out of Stock</p>
                <p className="text-2xl font-black text-amber-600 font-mono mt-1">{outOfStockProducts.length}</p>
                <p className="text-[10px] text-gray-500 mt-1">Needs restock</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Total Orders</p>
                <p className="text-2xl font-black text-gray-900 font-mono mt-1">{orders.length}</p>
                <p className="text-[10px] text-gray-500 mt-1">WhatsApp & Web</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Pending Orders</p>
                <p className="text-2xl font-black text-orange-600 font-mono mt-1">{pendingOrders.length}</p>
                <p className="text-[10px] text-orange-700 font-semibold mt-1">Awaiting action</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Total Sales</p>
                <p className="text-2xl font-black text-[#15803D] font-mono mt-1">₹{totalRevenue}</p>
                <p className="text-[10px] text-gray-500 mt-1">INR Gross Value</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Recent Customer Orders</h3>
                  <p className="text-xs text-gray-500">Live incoming deliveries across Khordha and Jatani</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#15803D] hover:underline cursor-pointer"
                >
                  Manage All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-bold border-y border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Area</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">{ord.orderNumber}</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{ord.customer.name}</p>
                          <p className="text-gray-400 font-mono text-[11px]">{ord.customer.phone}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            {ord.customer.area}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {ord.items.length} items ({ord.items.map((i) => i.name).slice(0, 2).join(', ')}...)
                        </td>
                        <td className="py-3 px-3 font-mono font-black text-gray-900">₹{ord.finalTotal}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => openCustomerChatWhatsApp(ord.customer.whatsapp, `Hello ${ord.customer.name}! Regarding your Smart Grocery order ${ord.orderNumber}:`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3 text-[#15803D]" />
                            <span>WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Product Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product name, brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
                  />
                </div>

                {/* Category select */}
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Stock select */}
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="py-2 px-3 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 cursor-pointer"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in-stock">In-Stock Only</option>
                  <option value="out-of-stock">Out-of-Stock Only</option>
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full md:w-auto px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-3">Item</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Selling Price</th>
                      <th className="py-3 px-3">Original / Disc.</th>
                      <th className="py-3 px-3">Weight</th>
                      <th className="py-3 px-3">Stock Units</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Featured</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200">
                              <GroceryImage
                                src={p.imageUrl}
                                alt={p.name}
                                category={p.category}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="max-w-[200px]">
                              <p className="font-bold text-gray-900 truncate" title={p.name}>
                                {p.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 font-medium">{p.category}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-900">₹{p.price}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-500">
                          {p.originalPrice > p.price ? (
                            <span>
                              ₹{p.originalPrice} ({p.discountPercent}%)
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-gray-700">{p.weight}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) })}
                            className="w-16 px-1.5 py-1 rounded border border-gray-200 text-xs text-center"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() =>
                              updateProduct(p.id, {
                                status: p.status === 'active' ? 'inactive' : 'active',
                              })
                            }
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                              p.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {p.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => updateProduct(p.id, { featured: !p.featured })}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              p.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            ★
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete product "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                  showToast('Product deleted.', 'info');
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. CATEGORIES TAB ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Manage 16 Departments</h3>
                <p className="text-xs text-gray-500">
                  Control category visibility on customer website (e.g. toggle "Eggs & Meat" on/off)
                </p>
              </div>

              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <div
                    key={c.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full aspect-16/9 rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100">
                        <GroceryImage
                          src={c.imageUrl}
                          alt={c.name}
                          category={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-gray-900 text-sm">{c.name}</h4>
                        <span className="text-[11px] font-bold text-gray-400 font-mono">
                          {count} items
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{c.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => updateCategory(c.id, { isVisible: !c.isVisible })}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          c.isVisible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {c.isVisible ? 'Visible' : 'Hidden from store'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCategory(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete category "${c.name}"?`)) {
                              deleteCategory(c.id);
                              showToast('Category deleted.', 'info');
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer name, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={orderAreaFilter}
                  onChange={(e) => setOrderAreaFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 cursor-pointer"
                >
                  <option value="all">All Service Areas</option>
                  <option value="Khordha">Khordha</option>
                  <option value="Jatani">Jatani</option>
                </select>
              </div>

              <span className="text-xs font-bold text-gray-500">
                Found {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {/* Orders Feed */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No matching orders found</p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {ord.orderNumber}
                        </span>
                        <div>
                          <p className="font-extrabold text-sm text-gray-900">{ord.customer.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {new Date(ord.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            updateOrderStatus(ord.id, e.target.value as OrderStatus);
                            showToast(`Order status set to ${e.target.value}`, 'success');
                          }}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : ord.status === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : ord.status === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-blue-50 text-blue-800 border-blue-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">Phone & WhatsApp</p>
                        <p className="font-mono font-bold text-gray-900 mt-0.5">{ord.customer.phone}</p>
                        {ord.customer.whatsapp !== ord.customer.phone && (
                          <p className="text-[10px] text-gray-500 font-mono">WA: {ord.customer.whatsapp}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">Delivery Area & Address</p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold mr-1">
                            {ord.customer.area}
                          </span>
                          {ord.customer.address}
                        </p>
                        {ord.customer.landmark && (
                          <p className="text-[11px] text-gray-500 mt-0.5">Landmark: {ord.customer.landmark}</p>
                        )}
                      </div>

                      <div className="flex md:justify-end items-center gap-2">
                        <button
                          onClick={() =>
                            openCustomerChatWhatsApp(
                              ord.customer.whatsapp,
                              `Hello ${ord.customer.name}! This is Smart Grocery regarding your order ${ord.orderNumber}.`
                            )
                          }
                          className="px-3 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat Customer</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Breakdown */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden text-xs">
                      <div className="bg-gray-50 px-3 py-1.5 font-bold text-gray-500 flex justify-between">
                        <span>Ordered Items ({ord.items.length})</span>
                        <span>Item Total</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="px-3 py-2 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900">{i.name}</span>
                              <span className="text-gray-400 text-[11px] ml-2">
                                ({i.weight} × {i.quantity})
                              </span>
                            </div>
                            <span className="font-mono font-bold text-gray-900">₹{i.itemTotal}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-emerald-50/50 px-3 py-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                        <span>
                          Subtotal: ₹{ord.subtotal} + Delivery ({ord.customer.area}): ₹{ord.deliveryCharge}
                        </span>
                        <span className="text-sm font-black text-[#15803D] font-mono">
                          Total: ₹{ord.finalTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= 5. CUSTOM ORDERS TAB ================= */}
        {activeTab === 'custom-orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Custom Grocery Order Requests</h3>
                <p className="text-xs text-gray-500">
                  Requests sent by customers for unlisted grocery products
                </p>
              </div>
              <button
                onClick={() => setCustomOrders(getCustomOrders())}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
                title="Refresh requests"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {customOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
                  <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No custom grocery requests yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    When customers use the "Request Custom Order" form, requests will appear here.
                  </p>
                </div>
              ) : (
                customOrders.map((req) => (
                  <div key={req.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{req.customerName}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {req.phone} · {req.area} · {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => {
                            updateCustomOrderStatus(req.id, e.target.value as any);
                            setCustomOrders(getCustomOrders());
                            showToast(`Status updated to ${e.target.value}`, 'success');
                          }}
                          className="py-1 px-2 rounded-lg text-xs font-bold border border-gray-200 bg-white cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Fulfilled">Fulfilled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() =>
                            openCustomerChatWhatsApp(
                              req.phone,
                              `Hello ${req.customerName}! Regarding your custom grocery order request:`
                            )
                          }
                          className="px-2.5 py-1 bg-[#15803D] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl text-xs font-mono text-gray-800 whitespace-pre-line border border-gray-100">
                      {req.requestedItems}
                    </div>

                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Delivery Address:</span> {req.address}
                      {req.additionalRequirements && ` · Note: ${req.additionalRequirements}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= 6. STORE SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Store Identity & Pricing Policies</h3>
                <p className="text-xs text-gray-500">
                  Settings are saved persistently in database and immediately apply across the entire shop.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Owner WhatsApp Order Number (Digits only, e.g. 919437012345)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.ownerWhatsApp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerWhatsApp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.minimumOrderAmount}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, minimumOrderAmount: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={settingsForm.openingHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Service Areas Configuration */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Delivery Areas (Khordha & Jatani)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {settingsForm.serviceAreas.map((area, idx) => (
                    <div key={area.name} className="p-3 bg-[#F8FAF8] rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between font-bold text-xs text-gray-900">
                        <span>{area.name} Area</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={area.enabled}
                            onChange={(e) => {
                              const updated = [...settingsForm.serviceAreas];
                              updated[idx].enabled = e.target.checked;
                              setSettingsForm({ ...settingsForm, serviceAreas: updated });
                            }}
                            className="accent-[#15803D]"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-gray-500 font-semibold">Delivery Fee (₹)</label>
                          <input
                            type="number"
                            value={area.deliveryCharge}
                            onChange={(e) => {
                              const updated = [...settingsForm.serviceAreas];
                              updated[idx].deliveryCharge = Number(e.target.value);
                              setSettingsForm({ ...settingsForm, serviceAreas: updated });
                            }}
                            className="w-full p-1.5 rounded border border-gray-200 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 font-semibold">Free Delivery Above (₹)</label>
                          <input
                            type="number"
                            value={area.freeDeliveryAbove}
                            onChange={(e) => {
                              const updated = [...settingsForm.serviceAreas];
                              updated[idx].freeDeliveryAbove = Number(e.target.value);
                              setSettingsForm({ ...settingsForm, serviceAreas: updated });
                            }}
                            className="w-full p-1.5 rounded border border-gray-200 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Announcement */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Top Header Announcement Bar</label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcementActive}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })
                      }
                      className="accent-[#15803D]"
                    />
                    <span>Show on Customer Website</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  placeholder="e.g. 🌿 Fresh Morning Harvest: Free delivery in Khordha & Jatani on orders above ₹499."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Store Settings
              </button>
            </form>

            {/* Catalog Backup & Restore Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-gray-900">Data Management & Backup</h3>
              <p className="text-xs text-gray-500">
                Export complete store products, categories, and settings as JSON or reset to the 100+ starter catalog.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>

                <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Restore from JSON</span>
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm('Reset all products and categories back to factory 100+ seed catalog?')) {
                      resetToSeedData();
                      showToast('Factory catalog restored successfully!', 'success');
                    }
                  }}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset to 100+ Seed Catalog</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit / Add Product Modal */}
      {(editingProduct || isAddProductOpen) && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setEditingProduct(null);
            setIsAddProductOpen(false);
          }}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
              showToast('Product updated successfully!', 'success');
            } else {
              addProduct(data as any);
              showToast('Product added to catalog!', 'success');
            }
            setEditingProduct(null);
            setIsAddProductOpen(false);
          }}
        />
      )}

      {/* Edit / Add Category Modal */}
      {(editingCategory || isAddCategoryOpen) && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
            setIsAddCategoryOpen(false);
          }}
          onSave={(data) => {
            if (editingCategory) {
              updateCategory(editingCategory.id, data);
              showToast('Category updated!', 'success');
            } else {
              addCategory(data as any);
              showToast('Category created!', 'success');
            }
            setEditingCategory(null);
            setIsAddCategoryOpen(false);
          }}
        />
      )}
    </div>
  );
};

// ---------------- Helper Modals ----------------

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || 'Smart Grocery Select');
  const [category, setCategory] = useState(product?.category || categories[0]?.name || 'Fresh Vegetables');
  const [price, setPrice] = useState(product?.price || 50);
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 60);
  const [weight, setWeight] = useState(product?.weight || '1 kg');
  const [unit, setUnit] = useState<Product['unit']>(product?.unit || 'kg');
  const [stock, setStock] = useState(product?.stock ?? 50);
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80');
  const [featured, setFeatured] = useState(product?.featured || false);
  const [status, setStatus] = useState<Product['status']>(product?.status || 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      brand,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      weight,
      unit,
      stock: Number(stock),
      description,
      imageUrl,
      featured,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 my-8">
        <div className="p-4 sm:p-5 bg-gray-900 text-white flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base">
            {product ? `Edit Product: ${product.name}` : 'Add New Grocery Product'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. India Gate Basmati Rice Feast"
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Fortune, Amul, Tata"
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Original Price (₹)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Initial Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Pack Size / Weight *</label>
              <input
                type="text"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 1 kg, 500 g, 1 Litre"
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Measurement Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="litre">litre</option>
                <option value="ml">ml</option>
                <option value="pack">pack</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Product Photograph URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl border border-gray-200 font-mono"
            />
            <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
                <GroceryImage src={imageUrl} alt="preview" category={category} className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] text-gray-500">Live preview (will fall back cleanly if image fails to load)</p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short helpful product description..."
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#15803D]"
              />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={status === 'active'}
                onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                className="accent-[#15803D]"
              />
              <span>Active in Store</span>
            </label>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl font-bold cursor-pointer"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
  const [isVisible, setIsVisible] = useState(category?.isVisible ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description,
      imageUrl,
      isVisible,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
          <h3 className="font-extrabold text-sm">{category ? 'Edit Category' : 'Add New Category'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Category Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="accent-[#15803D]"
            />
            <span>Visible to Customers on Website</span>
          </label>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#15803D] text-white rounded-xl font-bold cursor-pointer"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
