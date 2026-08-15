import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import PrintInvoiceButton from './PrintInvoiceButton'

// Store Settings
const STORE_NAME_HI = "किसान गल्ला भंडार एवं किसान सेवा केंद्र"
const STORE_NAME_EN = "Kishan Galla Bhandar & Kishan Seva Kendra"
const PROPRIETOR = "Prop. Bijendra Prasad"
const STORE_ADDRESS_1 = "VMQ9+CVW, SH 82, Roh"
const STORE_ADDRESS_2 = "Bihar 805141, India"
const STORE_CONTACT = "+91-7909095602, +91-9801436351"
const STORE_GSTIN = "10BGUPD3647XXXX"

const BANK_NAME = "STATE BANK OF INDIA"
const BANK_BRANCH = "Roh"
const BANK_ACC = "20412XXXX05"
const BANK_IFSC = "SBIN003XXXX"
const BANK_UPI = "kishangalla@sbi"
const JURISDICTION = "Nawada"

function numberToWords(num: number) {
  if (num === 0) return 'Zero'
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const numStr = Math.floor(num).toString()
  if (numStr.length > 9) return 'Overflow'
  const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
  if (!n) return ''
  let str = ''
  str += (n[1] != '00') ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : ''
  str += (n[2] != '00') ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : ''
  str += (n[3] != '00') ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : ''
  str += (n[4] != '0') ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : ''
  str += (n[5] != '00') ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : ''
  return 'Rupees ' + str.trim() + ' Only'
}

// ⚠️ FIX: params ki type badli gayi hai aur use await kiya gaya hai
export default async function ViewInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  // Yahan params ko await karna zaroori hai naye Next.js versions mein
  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id: id }
  })

  if (!invoice) notFound()

  let cart: any[] = []
  try {
    cart = typeof invoice.cartData === 'string' ? JSON.parse(invoice.cartData) : (invoice.cartData as any[]) || []
  } catch (e) {
    cart = []
  }

  const totalQty = cart.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0)
  const totalTaxable = cart.reduce((sum: number, item: any) => sum + (Number(item.taxable) || 0), 0)
  const totalGstAmt = cart.reduce((sum: number, item: any) => sum + (Number(item.gstAmt) || 0), 0)
  const grandTotal = totalTaxable + totalGstAmt
  const roundedGrandTotal = Math.round(grandTotal)
  const roundOff = roundedGrandTotal - grandTotal
  const cgst = totalGstAmt / 2
  const sgst = totalGstAmt / 2

  const displayDate = invoice.invoiceDate.split('-').reverse().join('-')

  return (
    <main className="min-h-screen bg-[#f3f6f8] text-navy p-4 sm:p-8 print:p-0 print:bg-white">
      <div className="max-w-[850px] mx-auto space-y-4">
        
        {/* Navigation & Print Actions */}
        <div className="flex items-center justify-between print:hidden">
          <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-navy">
            <ArrowLeft size={16} /> Back to Saved Invoices
          </Link>
          <PrintInvoiceButton />
        </div>

        {/* ================= EXACT INVOICE DOCUMENT ================= */}
        <div className="bg-white border border-black font-sans text-[11px] leading-tight text-black shadow-xl print:shadow-none print:border-black mx-auto">
          
          {/* 1. Top Bar */}
          <div className="flex justify-between border-b border-black px-2 py-1 bg-white">
            <span className="opacity-0 w-32">Tax Invoice</span>
            <span className="font-bold text-center flex-1 text-sm">Tax Invoice</span>
            <span className="w-32 text-right">Original /Duplicate Bill</span>
          </div>

          {/* 2. Header Info */}
          <div className="flex flex-col border-b border-black p-3 bg-white">
            <div className="font-bold text-[11px] mb-1">GSTIN : {STORE_GSTIN}</div>
            
            {/* Hindi Store Name */}
            <div className="text-[26px] md:text-[32px] font-black text-black leading-tight tracking-wide" style={{ fontFamily: 'system-ui, "Mangal", "Nirmala UI", sans-serif' }}>
              {STORE_NAME_HI}
            </div>
            
            {/* English Sub-Name */}
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-800">{STORE_NAME_EN}</span>
              <span className="text-xs font-bold text-slate-700">({PROPRIETOR})</span>
            </div>
            
            <div className="text-slate-900">{STORE_ADDRESS_1}</div>
            <div className="text-slate-900">{STORE_ADDRESS_2}</div>
            <div className="text-slate-900 mt-0.5">Contact No. : {STORE_CONTACT}</div>
          </div>

          {/* 3. Address & Details Split */}
          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black">
              <div className="bg-[#e6f2f8] border-b border-black px-2 py-1 font-bold">Bill To</div>
              <div className="p-2 grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5">
                <span>Name :</span><span className="font-semibold">{invoice.customerName || 'Cash Customer'}</span>
                <span>Address :</span><span>{invoice.customerPhone || '__________________'}</span>
                <span>State :</span><span>Bihar - 10</span>
                <span>GSTIN :</span><span></span>
              </div>
              <div className="bg-[#e6f2f8] border-y border-black px-2 py-1 font-bold">Shipp To</div>
              <div className="p-2 grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5">
                <span>Name :</span><span className="font-semibold">{invoice.customerName || 'Cash Customer'}</span>
                <span>Address :</span><span>{invoice.customerPhone || '__________________'}</span>
                <span>State :</span><span>Bihar - 10</span>
                <span>GSTIN :</span><span></span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="p-2 grid grid-cols-[110px_1fr] gap-x-2 gap-y-0.5 border-b border-black h-1/2">
                <span># Inv. No. :</span><span className="font-semibold">{invoice.invoiceNo}</span>
                <span>Inv. Date :</span><span className="font-bold">{displayDate}</span>
                <span>Payment Mode :</span><span>CASH / UPI</span>
                <span>Reverse Charge :</span><span>NO</span>
              </div>
              <div className="p-2 grid grid-cols-[110px_1fr] gap-x-2 gap-y-0.5 h-1/2">
                <span>Buyer's Order No :</span><span></span>
                <span>Supplier's Ref. :</span><span></span>
                <span>Vehicle Number :</span><span></span>
                <span>Delivery Date :</span><span>{displayDate}</span>
                <span>Transport Details :</span><span></span>
                <span>Terms Of Delivery :</span><span></span>
              </div>
            </div>
          </div>

          {/* 4. Table */}
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e6f2f8] border-b border-black">
                <th className="border-r border-black font-normal py-1 w-8" rowSpan={2}>Sr</th>
                <th className="border-r border-black font-normal" rowSpan={2}>Goods & Service Discription</th>
                <th className="border-r border-black font-normal w-12" rowSpan={2}>HSN</th>
                <th className="border-r border-black font-normal w-16" rowSpan={2}>Quantity</th>
                <th className="border-r border-black font-normal w-16" rowSpan={2}>Rate</th>
                <th className="border-r border-black font-normal w-20" rowSpan={2}>Taxable</th>
                <th className="border-r border-black font-normal border-b" colSpan={2}>GST</th>
                <th className="font-normal w-20" rowSpan={2}>Total</th>
              </tr>
              <tr className="bg-[#e6f2f8] border-b border-black">
                <th className="border-r border-black font-normal py-1 w-10">%</th>
                <th className="border-r border-black font-normal w-14">Amt.</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item: any, index: number) => (
                <tr key={item.id || index}>
                  <td className="border-r border-black p-1">{index + 1}</td>
                  <td className="border-r border-black p-1 text-left pl-2 capitalize">{item.name}</td>
                  <td className="border-r border-black p-1">{item.hsn || '-'}</td>
                  <td className="border-r border-black p-1">{item.quantity}</td>
                  <td className="border-r border-black p-1 text-right pr-1">{Number(item.rate).toFixed(2)}</td>
                  <td className="border-r border-black p-1 text-right pr-1">{Number(item.taxable).toFixed(2)}</td>
                  <td className="border-r border-black p-1">{item.gstPercent || 0}%</td>
                  <td className="border-r border-black p-1 text-right pr-1">{Number(item.gstAmt || 0).toFixed(2)}</td>
                  <td className="p-1 text-right pr-1">{Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
              {cart.length < 8 && Array.from({ length: 8 - cart.length }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border-r border-black p-1 h-5"></td><td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td><td className="p-1"></td>
                </tr>
              ))}
              
              <tr className="border-t border-black">
                <td colSpan={3} className="border-r border-black p-1 text-right pr-2 font-bold">Sub-Total:</td>
                <td className="border-r border-black p-1 font-bold">{totalQty}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right pr-1 font-bold">{totalTaxable.toFixed(2)}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right pr-1 font-bold">{totalGstAmt.toFixed(2)}</td>
                <td className="p-1 text-right pr-1 font-bold">{grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* 5. Footer Split Sections */}
          <div className="grid grid-cols-[1fr_250px] border-t border-black">
            <div className="border-r border-black flex flex-col">
              <div className="p-2 flex-1">
                <div className="mb-1 font-bold">Our Bank Details</div>
                <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-0.5">
                  <span>Bank Name :</span><span className="font-semibold">{BANK_NAME}</span>
                  <span>Branch :</span><span>{BANK_BRANCH}</span>
                  <span>Account No :</span><span>{BANK_ACC}</span>
                  <span>IFSC Code :</span><span>{BANK_IFSC}</span>
                  <span>UPI ID :</span><span>{BANK_UPI}</span>
                </div>
              </div>
              <div className="border-t border-black p-2 bg-[#e6f2f8]">
                <div className="mb-1 font-bold">Invoice Total in Word</div>
                <div className="font-semibold text-[12px]">{numberToWords(roundedGrandTotal)}</div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 bg-[#e6f2f8] border-b border-black">
                <div className="p-1 text-center font-bold border-r border-black">SUMMERY</div>
                <div className="p-1 text-center font-bold">AMOUNT</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black">CGST Amt :</div><div className="p-1 pr-2">{cgst.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black">SGST Amt :</div><div className="p-1 pr-2">{sgst.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black">IGST Amt :</div><div className="p-1 pr-2">0.00</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black">Freight Charges :</div><div className="p-1 pr-2"></div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black">Round off :</div><div className="p-1 pr-2">{roundOff.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right bg-[#e6f2f8]">
                <div className="p-1 border-r border-black font-bold">Total Amount :</div>
                <div className="p-1 pr-2 font-black text-[13px]">{roundedGrandTotal.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* 6. Declarations & Signature */}
          <div className="grid grid-cols-[1fr_100px_250px] border-t border-black p-2 items-end">
            <div>
              <div className="font-bold mb-1">Declaration</div>
              <div>1. Subject to {JURISDICTION} jurisdiction</div>
              <div>2. Terms & conditions are subject to our trade policy</div>
              <div>3. Our risk & responsibility ceases after the delivery of goods.</div>
              <div className="mt-2 font-bold">E. & O.E.</div>
            </div>
            
            <div className="flex justify-center items-center pb-2">
              <div className="w-[70px] h-[70px] border border-black flex items-center justify-center text-[8px] text-center p-1 font-bold">
                STORE QR
              </div>
            </div>

            <div className="text-right flex flex-col justify-between h-full pt-1">
              <div className="font-bold uppercase">For, {STORE_NAME_EN}</div>
              <div className="mt-12 text-center">Authorised Signatory</div>
            </div>
          </div>

          <div className="text-center border-t border-black py-1 font-bold text-xs bg-white">
            Thank You For Business With US!
          </div>

        </div>

      </div>
    </main>
  )
}