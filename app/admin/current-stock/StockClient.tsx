'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PackageSearch, CircleDollarSign, AlertCircle, CheckCircle2, Boxes, Pencil, X, Trash2 } from 'lucide-react'
import { updateMaterialData, deleteMaterialItem } from './actions'

type Material = { id: number; name: string; currentRate: number; stock: number; unit: string }

export default function StockClient({ materials, totalValue }: { materials: Material[], totalValue: number }) {
  const [editingItem, setEditingItem] = useState<Material | null>(null)
  
  // States for Edit Form
  const [editName, setEditName] = useState<string>('')
  const [editStock, setEditStock] = useState<number>(0)
  const [editRate, setEditRate] = useState<number>(0)
  
  // Loading States
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  // Edit Modal Open karne par purana data form mein set karna
  const openEditModal = (mat: Material) => {
    setEditingItem(mat)
    setEditName(mat.name)
    setEditStock(mat.stock)
    setEditRate(mat.currentRate)
  }

  // Save Button Click
  const handleSave = async () => {
    if (!editingItem || !editName.trim()) return // Naam khali na ho
    setIsSaving(true)
    try {
      await updateMaterialData(editingItem.id, editName, Number(editStock), Number(editRate))
      setEditingItem(null)
    } catch (error) {
      console.error("Update failed", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete Button Click
  const handleDelete = async (id: number) => {
    // Delete karne se pehle confirmation
    const isConfirmed = window.confirm("Kya aap sach mein is material ko delete karna chahte hain? Yeh wapas nahi aayega.")
    if (!isConfirmed) return

    setIsDeleting(id)
    try {
      await deleteMaterialItem(id)
    } catch (error) {
      console.error("Delete failed", error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <PackageSearch className="text-yellow-500" size={32} />
            Detailed Current Stock
          </h1>
          <p className="text-slate-300 mt-2 text-sm font-medium">Live inventory tracking and valuation for your godown.</p>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-4">
           <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400">
             <CircleDollarSign size={28} />
           </div>
           <div>
             <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest">Total Inventory Value</p>
             <p className="font-black text-2xl tracking-tight text-white">
               {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalValue)}
             </p>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <Boxes className="text-slate-400" size={20} />
          <h2 className="text-lg font-bold text-slate-800">All Materials List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Material Name</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Current Rate</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Stock Available</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Total Value</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {materials.map((mat) => {
                const itemTotalValue = mat.stock * mat.currentRate;
                return (
                  <tr key={mat.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 font-bold text-slate-700">{mat.name}</td>
                    <td className="p-5 font-medium text-slate-500">₹{mat.currentRate.toLocaleString('en-IN')} <span className="text-xs">/ {mat.unit}</span></td>
                    <td className="p-5">
                      <span className={`font-black text-lg ${mat.stock <= 10 ? 'text-red-600' : 'text-slate-900'}`}>
                        {mat.stock.toLocaleString('en-IN')} <span className="text-sm font-semibold text-slate-500">{mat.unit}</span>
                      </span>
                    </td>
                    <td className="p-5 font-bold text-slate-600">
                      ₹{itemTotalValue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-5 text-center">
                      {mat.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border border-red-200">
                          <AlertCircle size={14} /> Out of Stock
                        </span>
                      ) : mat.stock <= 10 ? (
                        <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border border-yellow-200">
                          <AlertCircle size={14} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border border-emerald-200">
                          <CheckCircle2 size={14} /> In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right flex items-center justify-end gap-2">
                      {/* EDIT BUTTON */}
                      <button 
                        onClick={() => openEditModal(mat)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Item"
                      >
                        <Pencil size={18} />
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => handleDelete(mat.id)}
                        disabled={isDeleting === mat.id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                        <Boxes size={32} />
                      </div>
                      <p className="text-slate-900 font-bold text-lg">No stock available</p>
                      <p className="text-slate-500 text-sm mt-1">
                        <Link href="/admin/rates" className="text-blue-600 hover:underline font-semibold">Manage Items</Link> se apna pehla material add karein.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌟 NAYA EDIT POPUP MODAL (Name Input ke sath) 🌟 */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-xl text-slate-800">Edit Material</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* NAYA: Material Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Material Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
                  placeholder="e.g. UltraTech Cement"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Rate (₹ per {editingItem.unit})</label>
                <input 
                  type="number" 
                  value={editRate} 
                  onChange={(e) => setEditRate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Available ({editingItem.unit})</label>
                <input 
                  type="number" 
                  value={editStock} 
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}