import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, FileText, ReceiptText, Eye, Plus } from 'lucide-react'

export const revalidate = 0 

export default async function SavedInvoicesPage() {
  // Yahan limit 50 se badha kar 500 kar di gayi hai
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500 
  })

  return (
    <main className="min-h-screen bg-[#f3f6f8] text-navy p-5 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 mb-2">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="font-heading text-3xl font-extrabold flex items-center gap-3">
              <ReceiptText className="text-gold" size={32} />
              Saved Invoices
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Aapke pichle 500 generated bills ki history</p>
          </div>
          
          <Link href="/admin/billing" className="bg-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all">
            <Plus size={18} /> Create New Bill
          </Link>
        </div>

        {/* Invoice List / Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Invoice No.</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                      <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                      Abhi tak koi bill save nahi hua hai.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => {
                    let itemsCount = 0;
                    try {
                      const cart = typeof invoice.cartData === 'string' ? JSON.parse(invoice.cartData) : invoice.cartData;
                      itemsCount = Array.isArray(cart) ? cart.length : 0;
                    } catch (e) {
                      itemsCount = 0;
                    }

                    return (
                      <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-black text-navy">{invoice.invoiceNo}</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">{invoice.invoiceDate}</td>
                        <td className="px-6 py-4 font-bold capitalize">{invoice.customerName || 'Cash Customer'}</td>
                        <td className="px-6 py-4 font-black text-emerald-600 text-[15px]">
                          ₹ {invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-500 font-bold text-xs">
                          {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/admin/invoices/${invoice.id}`}
                            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm"
                          >
                            <Eye size={14} /> View / Print Bill
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  )
}