import { prisma } from '@/lib/prisma'
import { History, TrendingUp, TrendingDown, CalendarClock, ReceiptText } from 'lucide-react'
// 👇 Import ko sabse upar add kar diya hai
import ResetDashboardButton from '@/app/admin/components/ResetDashboardButton'

export default async function RecentActivityPage() {
  const activity = await prisma.ledger.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      material: true
    }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <History className="text-yellow-500" size={32} />
            Recent Activity Ledger
          </h1>
          <p className="text-slate-300 mt-2 text-sm font-medium">Tracking your last 100 inbound and outbound material transactions.</p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-3">
           <ReceiptText className="text-yellow-400" size={24} />
           <p className="font-bold text-sm tracking-wide">{activity.length} Records Found</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Material</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activity.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <CalendarClock size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">
                          {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                          {new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    {entry.type === 'AAYA' ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border border-emerald-100">
                        <TrendingUp size={14} /> MAAL AAYA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border border-blue-100">
                        <TrendingDown size={14} /> MAAL BIKA
                      </span>
                    )}
                  </td>
                  <td className="p-5 font-black text-slate-700">
                    {entry.material.name}
                  </td>
                  <td className="p-5">
                    <span className="font-black text-lg text-slate-900">
                      {entry.quantity} <span className="text-sm font-semibold text-slate-500">{entry.material.unit}</span>
                    </span>
                  </td>
                  <td className="p-5 text-sm font-medium text-slate-500">
                    {entry.description || '-'}
                  </td>
                </tr>
              ))}

              {activity.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                        <History size={32} />
                      </div>
                      <p className="text-slate-900 font-bold text-lg">No transactions yet</p>
                      <p className="text-slate-500 text-sm mt-1">
                        Aapke godown mein abhi tak koi activity record nahi hui hai.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👇 Table ke theek neeche humara Danger Zone Button aa gaya 👇 */}
      <ResetDashboardButton />

    </div>
  )
}