import Link from 'next/link'
import { prisma } from '../../../lib/prisma'
import { 
  BarChart3, Box, CircleDollarSign, FileText, Package, 
  Receipt, Settings2, ShoppingCart, TrendingDown, TrendingUp, Truck,
  LogOut, KeyRound // 👈 NAYA: KeyRound icon yahan add kiya hai
} from 'lucide-react'
import { logout } from '@/app/login/actions' 

// Backend Data Fetching Structure - Now 100% Dynamic!
async function getDashboardData() {
  // 1. Database se live materials fetch karo
  const dbMaterials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  })

  // 2. Map to Stock Table format
  const liveStock = dbMaterials.map(item => {
    const qty = item.stock; 
    return {
      name: item.name,
      qty: qty.toLocaleString('en-IN'),
      unit: item.unit || 'Pcs',
      status: qty <= 10 ? 'Limited' : 'In Stock' 
    }
  })

  // 3. Calculate Total Stock Value
  const totalValue = dbMaterials.reduce((sum, item) => {
    return sum + (item.stock * item.currentRate) 
  }, 0)

  const formattedTotalValue = new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(totalValue)

  // 4. Count Low Stock Items
  const lowStockCount = dbMaterials.filter(item => item.stock <= 10).length
  const lowStockText = lowStockCount < 10 ? `0${lowStockCount} items` : `${lowStockCount} items`

  // 5. Fetch This Month's Ledger Transactions for Aaya/Bika Values
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const thisMonthLedger = await prisma.ledger.findMany({
    where: {
      createdAt: {
        gte: startOfMonth, // Sirf is mahine ka data
      }
    },
    include: { material: true }
  });

  let maalAayaValue = 0;
  let maalBikaValue = 0;

  thisMonthLedger.forEach(entry => {
    const transactionValue = entry.quantity * entry.material.currentRate;
    if (entry.type === 'AAYA') {
      maalAayaValue += transactionValue;
    } else if (entry.type === 'BIKA') {
      maalBikaValue += transactionValue;
    }
  });

  const formattedMaalAaya = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(maalAayaValue);

  const formattedMaalBika = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(maalBikaValue);

  // 6. Fetch REAL Recent Activity from Ledger
  const dbLedger = await prisma.ledger.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { material: true }
  })

  const realRecentActivity = dbLedger.map(entry => {
    const isAaya = entry.type === 'AAYA'
    const title = `${entry.material.name} · ${entry.quantity} ${entry.material.unit} ${isAaya ? 'received' : 'sold'}`
    const time = new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const meta = `${isAaya ? 'Maal Aaya' : 'Maal Bika'} · ${time}`
    const Icon = isAaya ? Truck : ShoppingCart
    
    return [title, meta, Icon] as const
  })

  return {
    stock: liveStock,
    stats: [
      ['Total stock value', formattedTotalValue, CircleDollarSign, 'text-gold'],
      ['Maal aaya this month', formattedMaalAaya, TrendingUp, 'text-emerald-600'], 
      ['Maal bika this month', formattedMaalBika, TrendingDown, 'text-blue-600'],  
      ['Low stock items', lowStockText, Package, 'text-red-500']
    ] as const,
    recentActivity: realRecentActivity.length > 0 ? realRecentActivity : [
      ['No activity yet', 'System · Start by adding purchases', Box]
    ] as const
  }
}

// 👈 NAYA: Yahan list mein sabse niche 'Change Password' add kiya gaya hai
const nav = [
  ['Dashboard', '/admin/dashboard', BarChart3], 
  ['Current Stock', '/admin/current-stock', Box], 
  ['Maal Aaya / Purchases', '/admin/purchases', Truck], 
  ['Maal Bika / Sales', '/admin/sales', ShoppingCart], 
  ['Rates', '/admin/rates', Settings2], 
  ['Recent Activity', '/admin/recent-activity', Receipt], 
  ['Reports', '/admin/reports', FileText],
  ['Change Password', '/admin/settings', KeyRound] 
] as const

export default async function Dashboard() {
  const data = await getDashboardData()

  return (
    <main className="min-h-screen bg-[#f3f6f8] text-navy">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        
        {/* Sidebar */}
        <aside className="relative hidden w-64 shrink-0 bg-navy p-6 text-white lg:block">
          <Link href="/" className="font-heading text-lg font-black tracking-wide">
            KISHAN <span className="text-gold">GALLA BHANDAR</span>
          </Link>
          <p className="mt-1 text-[10px] tracking-widest text-white/50">OWNER CONSOLE</p>
          
          <nav className="mt-12 space-y-2">
            {nav.map(([label, href, Icon], index) => (
              <Link 
                href={href as string} 
                key={label as string} 
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                  index === 0 ? 'bg-gold text-navy' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={17} />
                {label as string}
              </Link>
            ))}
          </nav>

          {/* SECURE LOGOUT BUTTON */}
          <div className="absolute bottom-8 w-52">
            <form action={logout}>
              <button 
                type="submit" 
                className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={17} />
                Secure Logout
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-border bg-white px-5 sm:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Owner dashboard</p>
              <h1 className="font-heading text-xl font-extrabold">Namaskar, Bijendra ji 🙏</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gold font-bold text-navy">BP</div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold">Bijendra Prasad</p>
                <p className="text-xs text-muted-foreground">Proprietor</p>
              </div>
            </div>
          </header>

          <div className="space-y-8 p-5 sm:p-8">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.stats.map(([label, value, Icon, color]) => (
                <div className="rounded-xl border border-border bg-white p-5 shadow-sm" key={label as string}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">{label as string}</p>
                    <Icon className={color as string} size={19} />
                  </div>
                  <p className="mt-4 font-heading text-2xl font-extrabold text-navy">{value as string}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">Live data from database</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              {/* Current Stock Table */}
              <section className="rounded-xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div>
                    <h2 className="font-heading font-extrabold">Current stock</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Closing = Opening + Received - Sold</p>
                  </div>
                  <Link href="/admin/current-stock" className="text-xs font-bold text-blue-700 hover:underline">
                    View all stock
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">Material</th>
                        <th className="px-5 py-3">Closing stock</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.stock.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-muted-foreground">No stock data available.</td>
                        </tr>
                      ) : (
                        data.stock.map((item) => (
                          <tr key={item.name} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3 font-semibold">{item.name}</td>
                            <td className="px-5 py-3">{item.qty} {item.unit}</td>
                            <td className="px-5 py-3">
                              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                                item.status === 'Limited' ? 'bg-gold/20 text-navy' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent Activity */}
              <section className="rounded-xl border border-border bg-white shadow-sm">
                <div className="border-b border-border p-5">
                  <h2 className="font-heading font-extrabold">Recent activity</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Purchases and sales ledger</p>
                </div>
                <div className="divide-y divide-border">
                  {data.recentActivity.map(([title, meta, Icon]) => (
                    <div className="flex items-center gap-3 p-4 hover:bg-slate-50/50" key={title as string}>
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 text-gold">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{title as string}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{meta as string}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Rate Management */}
              <section className="rounded-xl border border-border bg-white p-5 shadow-sm flex flex-col justify-center">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading font-extrabold text-navy">Rate management</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Update current market prices.</p>
                  </div>
                  <Link href="/admin/rates" className="flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-xs font-bold text-white transition-opacity hover:opacity-90 mt-2 sm:mt-0 w-full">
                    <Settings2 size={15} /> Manage rates
                  </Link>
                </div>
              </section>

              {/* BILLING SYSTEM BUTTON */}
              <Link href="/admin/billing" 
                className="rounded-xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:border-gold transition-all group flex items-center justify-between cursor-pointer">
                <div>
                  <h2 className="font-heading font-extrabold text-navy">Generate Bill</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Print instant customer bills.</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-900 group-hover:bg-navy group-hover:text-gold transition-colors shadow-sm">
                  <FileText size={22} />
                </div>
              </Link>

              {/* SAVED BILLS BUTTON */}
              <Link href="/admin/invoices" 
                className="rounded-xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-500 transition-all group flex items-center justify-between cursor-pointer">
                <div>
                  <h2 className="font-heading font-extrabold text-navy">View Saved Bills</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Check old invoice history.</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <Receipt size={22} />
                </div>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  )
}