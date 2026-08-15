'use client'

import { useState } from 'react'
import { Trash2, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { addMaterial, deleteMaterial } from './actions'

type Material = {
  id: number
  name: string
  category: string | null
  unit_price: any
  stock_quantity: number
}

export default function RatesClient({ materials }: { materials: Material[] }) {
  const [loading, setLoading] = useState(false)

  async function handleAdd(formData: FormData) {
    setLoading(true)
    await addMaterial(formData)
    setLoading(false)
    // Form reset karne ke liye
    const form = document.getElementById('add-form') as HTMLFormElement
    form.reset()
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      setLoading(true)
      await deleteMaterial(id)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] p-5 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
            <ArrowLeft size={20} className="text-navy" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-navy">Rate Management</h1>
            <p className="text-sm text-muted-foreground">Add or remove materials and update their rates.</p>
          </div>
        </div>

        {/* Add New Material Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
            <Plus size={18} className="text-gold" /> Add New Material
          </h2>
          <form id="add-form" action={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Material Name</label>
              <input type="text" name="name" required placeholder="e.g. Red Bricks" className="w-full mt-1 p-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Unit</label>
              <select name="category" required className="w-full mt-1 p-2 border border-border rounded-lg text-sm">
                <option value="Bags">Bags</option>
                <option value="Ton">Ton</option>
                <option value="Pcs">Pcs</option>
                <option value="SqFt">SqFt</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Rate (₹)</label>
              <input type="number" name="unit_price" required min="0" step="0.01" placeholder="0.00" className="w-full mt-1 p-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Initial Stock</label>
              <input type="number" name="stock_quantity" required min="0" placeholder="0" className="w-full mt-1 p-2 border border-border rounded-lg text-sm" />
            </div>
            <div className="sm:col-span-5 flex justify-end mt-2">
              <button type="submit" disabled={loading} className="bg-navy text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Material'}
              </button>
            </div>
          </form>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Material Name</th>
                <th className="px-5 py-4">Unit</th>
                <th className="px-5 py-4">Current Rate</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No materials found.</td>
                </tr>
              ) : (
                materials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-semibold text-navy">{item.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-5 py-3 font-bold text-green-700">₹ {Number(item.unit_price).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-navy">{item.stock_quantity}</td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}