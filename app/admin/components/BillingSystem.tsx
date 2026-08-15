'use client'

import { useState } from 'react'
import { Plus, Printer, Trash2, Loader2 } from 'lucide-react'
import { saveInvoiceData } from '@/app/admin/actions' 

// ==========================================
// 🛠️ UPDATED STORE & BANK SETTINGS
// ==========================================
const STORE_NAME_HI = "किसान गल्ला भंडार एवं किसान सेवा केंद्र"
const STORE_NAME_EN = "Kishan Galla Bhandar & Kishan Seva Kendra"
const PROPRIETOR = "Prop. Bijendra Prasad" // Wapas pehle wala set kar diya
const STORE_ADDRESS_1 = "VMQ9+CVW, SH 82, Roh"
const STORE_ADDRESS_2 = "Bihar 805141, India"
const STORE_CONTACT = "+91-7909095602, +91-9801436351"
const STORE_GSTIN = "10BSAPK3835L1ZY" // Naya GSTIN

const BANK_NAME = "STATE BANK OF INDIA"
const BANK_BRANCH = "Nawada"
const BANK_ACC = "36263886671"
const BANK_IFSC = "SBIN0000141"
const BANK_UPI = "7909095602-3@ybl"
const JURISDICTION = "Nawada"
// ==========================================

type Material = { id: string, name: string, currentRate: number, unit: string }
type CartItem = { id: string, name: string, hsn: string, quantity: number, rate: number, taxable: number, gstPercent: number, gstAmt: number, total: number }

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

export default function BillingSystem({ materials }: { materials: Material[] }) {
  const today = new Date()
  const localDateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

  const [invDate, setInvDate] = useState(localDateStr)
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`)
  const [websiteUrl, setWebsiteUrl] = useState('https://')
  
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [stateCode, setStateCode] = useState('Bihar - 10')
  const [gstin, setGstin] = useState('')
  
  const [orderNo, setOrderNo] = useState('')
  const [supplierRef, setSupplierRef] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [deliveryDate, setDeliveryDate] = useState(localDateStr)
  const [transportDetails, setTransportDetails] = useState('')
  const [termsDelivery, setTermsDelivery] = useState('')
  
  const [paymentMode, setPaymentMode] = useState('CASH / UPI')
  const [reverseCharge, setReverseCharge] = useState('NO')
  const [freightCharges, setFreightCharges] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState('')
  const [qty, setQty] = useState('')
  const [customRate, setCustomRate] = useState('')
  const [hsn, setHsn] = useState('1001')
  const [gstPercent, setGstPercent] = useState(0)

  const [isSaving, setIsSaving] = useState(false)

  const displayInvDate = invDate.split('-').reverse().join('-')
  const displayDelDate = deliveryDate.split('-').reverse().join('-')
  // Dynamic UPI QR Code generator link update
  const upiQrCodeUrl = BANK_UPI ? `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=${BANK_UPI}&pn=${encodeURIComponent(STORE_NAME_EN)}` : ''

  const handleMaterialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = e.target.value
    setSelectedItem(itemId)
    const mat = materials.find(m => m.id === itemId)
    if (mat) setCustomRate(mat.currentRate.toString())
    else setCustomRate('')
  }

  const handleAddItem = () => {
    if (!selectedItem || !qty || !customRate) return
    const mat = materials.find(m => m.id === selectedItem)
    if (!mat) return

    const quantity = parseFloat(qty)
    const rate = parseFloat(customRate)
    const taxable = quantity * rate
    const gstAmt = (taxable * gstPercent) / 100
    const total = taxable + gstAmt

    setCart([...cart, {
      id: Math.random().toString(), name: mat.name, hsn, quantity, rate, taxable, gstPercent, gstAmt, total
    }])

    setSelectedItem(''); setQty(''); setCustomRate('')
  }

  const removeRow = (id: string) => setCart(cart.filter(item => item.id !== id))

  const numFreight = parseFloat(freightCharges) || 0
  const numPaid = parseFloat(amountPaid) || 0
  
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalTaxable = cart.reduce((sum, item) => sum + item.taxable, 0)
  const totalGstAmt = cart.reduce((sum, item) => sum + item.gstAmt, 0)
  
  const grandTotal = totalTaxable + totalGstAmt + numFreight
  const roundedGrandTotal = Math.round(grandTotal)
  const roundOff = roundedGrandTotal - grandTotal
  const cgst = totalGstAmt / 2
  const sgst = totalGstAmt / 2
  const balanceDue = roundedGrandTotal - numPaid

  const handlePrint = async () => {
    if (cart.length === 0) { alert("Bhai, pehle bill mein item toh add kijiye!"); return; }
    setIsSaving(true);
    try {
      await saveInvoiceData({
        invoiceNo, invoiceDate: invDate, customerName: customerName || 'Cash Customer',
        customerPhone: address, totalAmount: roundedGrandTotal, cart: cart
      });
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); window.print(); }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
      
      {/* ================= LEFT SIDE: ADVANCED FORM ================= */}
      <div className="w-full xl:w-[450px] shrink-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm print:hidden xl:max-h-[80vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
          <Plus className="text-blue-600" size={24} /> Create Bill
        </h2>

        <div className="space-y-6">
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">1. Invoice Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Invoice No.</label>
                <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Invoice Date</label>
                <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Payment Mode</label>
                <input type="text" value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Reverse Charge</label>
                <input type="text" value={reverseCharge} onChange={e => setReverseCharge(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">2. Customer Details</h3>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Rajesh Kumar" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Patna, Bihar" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">State / Code</label>
                <input type="text" value={stateCode} onChange={e => setStateCode(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Customer GSTIN</label>
                <input type="text" value={gstin} onChange={e => setGstin(e.target.value)} placeholder="Optional" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">3. Shipping & Logistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Order No.</label>
                <input type="text" value={orderNo} onChange={e => setOrderNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Supplier Ref.</label>
                <input type="text" value={supplierRef} onChange={e => setSupplierRef(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Vehicle No.</label>
                <input type="text" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Delivery Date</label>
                <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Transport Details</label>
                <input type="text" value={transportDetails} onChange={e => setTransportDetails(e.target.value)} placeholder="e.g. By Road" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Terms of Delivery</label>
                <input type="text" value={termsDelivery} onChange={e => setTermsDelivery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">4. Payment & Charges</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">Freight Charges (₹)</label>
                <input type="number" value={freightCharges} onChange={e => setFreightCharges(e.target.value)} placeholder="0.00" className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-3 py-2 text-sm font-black outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Amount Paid (₹)</label>
                <input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} placeholder="0.00" className="w-full bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-3 py-2 text-sm font-black outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">5. Add Materials</h3>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Item</label>
              <select value={selectedItem} onChange={handleMaterialSelect} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none">
                <option value="">-- Choose Item --</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.name} (DB: ₹{m.currentRate})</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quantity</label>
                <input type="number" step="0.01" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Rate (₹)</label>
                <input type="number" step="0.01" value={customRate} onChange={(e) => setCustomRate(e.target.value)} placeholder="0.00" className="w-full bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-3 py-2 text-sm font-black outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">HSN</label>
                <input type="text" value={hsn} onChange={(e) => setHsn(e.target.value)} placeholder="Code" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">GST %</label>
              <select value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none">
                <option value={0}>0% GST</option>
                <option value={5}>5% GST</option>
                <option value={12}>12% GST</option>
                <option value={18}>18% GST</option>
              </select>
            </div>

            <button onClick={handleAddItem} className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
              Add to Bill
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: EXACT GST INVOICE FORMAT ================= */}
      <div className="flex-1 w-full bg-white p-4 shadow-xl print:shadow-none print:p-0 flex flex-col items-center xl:sticky xl:top-4 overflow-x-auto rounded-3xl xl:rounded-none">
        
        <div className="w-full max-w-[800px] flex justify-end mb-4 print:hidden">
          <button 
            onClick={handlePrint} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FBBF24] hover:bg-yellow-500 text-black px-6 py-2.5 rounded-md font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
            {isSaving ? 'Saving...' : 'Print Invoice'}
          </button>
        </div>

        <div className="min-w-[750px] w-full max-w-[800px] border border-black font-sans text-[11px] leading-tight text-black bg-white shrink-0 mx-auto">
          
          <div className="flex justify-between border-b border-black px-2 py-1 bg-white">
            <span className="opacity-0 w-32">Tax Invoice</span>
            <span className="font-bold text-center flex-1 text-sm">Tax Invoice</span>
            <span className="w-32 text-right">Original /Duplicate Bill</span>
          </div>

          <div className="flex flex-col border-b border-black p-3 bg-white">
            <div className="font-bold text-[11px] mb-1">GSTIN : {STORE_GSTIN}</div>
            <div className="text-[26px] md:text-[32px] font-black text-black leading-tight tracking-wide" style={{ fontFamily: 'system-ui, "Mangal", "Nirmala UI", sans-serif' }}>
              {STORE_NAME_HI}
            </div>
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-800">{STORE_NAME_EN}</span>
              <span className="text-xs font-bold text-slate-700">({PROPRIETOR})</span>
            </div>
            <div className="text-slate-900">{STORE_ADDRESS_1}</div>
            <div className="text-slate-900">{STORE_ADDRESS_2}</div>
            <div className="text-slate-900 mt-0.5">Contact No. : {STORE_CONTACT}</div>
          </div>

          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black">
              <div className="bg-[#e6f2f8] border-b border-black px-2 py-1 font-bold">Bill To</div>
              <div className="p-2 grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5">
                <span>Name :</span><span className="font-semibold border-b border-black border-dashed">{customerName || '__________________'}</span>
                <span>Address :</span><span className="border-b border-black border-dashed">{address || '__________________'}</span>
                <span>State :</span><span>{stateCode}</span>
                <span>GSTIN :</span><span>{gstin}</span>
              </div>
              <div className="bg-[#e6f2f8] border-y border-black px-2 py-1 font-bold">Shipp To</div>
              <div className="p-2 grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5">
                <span>Name :</span><span className="font-semibold border-b border-black border-dashed">{customerName || '__________________'}</span>
                <span>Address :</span><span className="border-b border-black border-dashed">{address || '__________________'}</span>
                <span>State :</span><span>{stateCode}</span>
                <span>GSTIN :</span><span>{gstin}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="p-2 grid grid-cols-[110px_1fr] gap-x-2 gap-y-0.5 border-b border-black h-1/2">
                <span># Inv. No. :</span><span className="font-semibold">{invoiceNo}</span>
                <span>Inv. Date :</span><span className="font-bold">{displayInvDate}</span>
                <span>Payment Mode :</span><span>{paymentMode}</span>
                <span>Reverse Charge :</span><span>{reverseCharge}</span>
              </div>
              <div className="p-2 grid grid-cols-[110px_1fr] gap-x-2 gap-y-0.5 h-1/2">
                <span>Buyer's Order No :</span><span>{orderNo}</span>
                <span>Supplier's Ref. :</span><span>{supplierRef}</span>
                <span>Vehicle Number :</span><span className="font-semibold">{vehicleNo}</span>
                <span>Delivery Date :</span><span>{displayDelDate}</span>
                <span>Transport Details :</span><span>{transportDetails}</span>
                <span>Terms Of Delivery :</span><span>{termsDelivery}</span>
              </div>
            </div>
          </div>

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
                <th className="font-normal w-20 border-r border-black" rowSpan={2}>Total</th>
                <th className="font-normal w-6 print:hidden" rowSpan={2}>X</th>
              </tr>
              <tr className="bg-[#e6f2f8] border-b border-black">
                <th className="border-r border-black font-normal py-1 w-10">%</th>
                <th className="border-r border-black font-normal w-14">Amt.</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td className="border-r border-black p-1">{index + 1}</td>
                  <td className="border-r border-black p-1 text-left pl-2 capitalize">{item.name}</td>
                  <td className="border-r border-black p-1">{item.hsn}</td>
                  <td className="border-r border-black p-1">{item.quantity}</td>
                  <td className="border-r border-black p-1 text-right pr-1">{item.rate.toFixed(2)}</td>
                  <td className="border-r border-black p-1 text-right pr-1">{item.taxable.toFixed(2)}</td>
                  <td className="border-r border-black p-1">{item.gstPercent}%</td>
                  <td className="border-r border-black p-1 text-right pr-1">{item.gstAmt.toFixed(2)}</td>
                  <td className="border-r border-black p-1 text-right pr-1">{item.total.toFixed(2)}</td>
                  <td className="p-1 print:hidden text-center">
                    <button onClick={() => removeRow(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} className="mx-auto" /></button>
                  </td>
                </tr>
              ))}
              {cart.length < 8 && Array.from({ length: 8 - cart.length }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border-r border-black p-1 h-5"></td><td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td><td className="border-r border-black p-1"></td>
                  <td className="p-1 print:hidden"></td>
                </tr>
              ))}
              
              <tr className="border-t border-black">
                <td colSpan={3} className="border-r border-black p-1 text-right pr-2">Sub-Total:</td>
                <td className="border-r border-black p-1 font-bold">{totalQty}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right pr-1 font-bold">{totalTaxable.toFixed(2)}</td>
                <td className="border-r border-black p-1"></td>
                <td className="border-r border-black p-1 text-right pr-1 font-bold">{totalGstAmt.toFixed(2)}</td>
                <td className="border-r border-black p-1 text-right pr-1 font-bold">{(totalTaxable + totalGstAmt).toFixed(2)}</td>
                <td className="print:hidden"></td>
              </tr>
            </tbody>
          </table>

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
                <div className="p-1 border-r border-black font-bold">Freight Charges :</div><div className="p-1 pr-2 font-bold">{numFreight > 0 ? numFreight.toFixed(2) : ''}</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black">Round off :</div><div className="p-1 pr-2">{roundOff.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right bg-[#e6f2f8] border-b border-black">
                <div className="p-1 border-r border-black font-bold">Total Amount :</div>
                <div className="p-1 pr-2 font-black text-[13px]">{roundedGrandTotal.toFixed(2)}</div>
              </div>
              
              <div className="grid grid-cols-[1fr_80px] text-right border-b border-black">
                <div className="p-1 border-r border-black font-bold">Paid Amt :</div>
                <div className="p-1 pr-2 font-bold">{numPaid > 0 ? numPaid.toFixed(2) : '0.00'}</div>
              </div>
              <div className="grid grid-cols-[1fr_80px] text-right bg-red-50">
                <div className="p-1 border-r border-black font-bold text-red-700">Balance Due :</div>
                <div className="p-1 pr-2 font-black text-[13px] text-red-700">{balanceDue.toFixed(2)}</div>
              </div>
              
            </div>
          </div>

          <div className="grid grid-cols-[1fr_100px_250px] border-t border-black p-2 items-end">
            <div>
              <div className="font-bold mb-1">Declaration</div>
              <div>1. Subject to {JURISDICTION} jurisdiction</div>
              <div>2. Terms & conditions are subject to our trade policy</div>
              <div>3. Our risk & responsibility ceases after the delivery of goods.</div>
              <div className="mt-2 font-bold">E. & O.E.</div>
            </div>
            
            <div className="flex justify-center items-center pb-2">
              {upiQrCodeUrl ? (
                <img src={upiQrCodeUrl} alt="Store UPI QR" className="w-[70px] h-[70px] border border-black p-0.5 bg-white" />
              ) : (
                <div className="w-[70px] h-[70px] border border-black flex items-center justify-center text-[8px] text-center p-1">UPI QR Here</div>
              )}
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
    </div>
  )
}