'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  CircleDollarSign,
  Clock3,
  HardHat,
  Headphones,
  Menu,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  X,
  MapPin, 
  PhoneCall,
  Navigation,
} from 'lucide-react'

export type Material = { id: number; name: string; unit: string; rate: number; quantity: number }

const products = [
  { 
    name: 'Cement', 
    detail: 'High strength cement for every foundation.', 
    image: '/product/cement-storage.jpeg' 
  },
  { 
    name: 'Iron Rod / TMT Steel', 
    detail: 'Reliable steel reinforcement for lasting builds.', 
    image: '/product/tmt.jpg' 
  },
  { 
    name: 'Gitti / Aggregate', 
    detail: 'Premium graded aggregate, delivered on schedule.', 
    image: '/product/gitti.png' 
  },
  { 
    name: 'balu/ret / Sand', 
    detail: 'Clean, dependable sand for strong foundations.', 
    image: '/product/sand.jpeg' 
  },
  { 
    name: 'Bricks', 
    detail: 'Consistent, durable bricks for every project.', 
    image: '/product/brick.jpg' 
  },
  { 
    name: 'Stone', 
    detail: 'Construction stone for strength and finish.', 
    image: '/product/stone.avif' 
  }
]

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export default function HomeClient({ dbMaterials }: { dbMaterials: Material[] }) {
  const [materials, setMaterials] = useState<Material[]>(dbMaterials)
  const [delivery, setDelivery] = useState(1000)
  const [gstEnabled, setGstEnabled] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const subtotal = useMemo(() => materials.reduce((sum, item) => sum + item.quantity * item.rate, 0), [materials])
  const gst = gstEnabled ? subtotal * 0.18 : 0
  const total = subtotal + delivery + gst

  const updateMaterial = (id: number, patch: Partial<Material>) => {
    setMaterials((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item))
  }
  
  const addMaterial = () => setMaterials((current) => [...current, { id: Date.now(), name: '', unit: 'Pcs', rate: 0, quantity: 1 }])
  const removeMaterial = (id: number) => setMaterials((current) => current.filter((item) => item.id !== id))

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 🌟 HEADER 🌟 */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="Kishan Galla Bhandar home">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-gold/60 text-gold"><HardHat size={26} /></div>
            <div>
              <div className="font-heading text-lg font-extrabold tracking-tight text-white uppercase">KISHAN GALLA BHANDAR</div>
              <div className="text-[10px] font-bold tracking-[0.15em] text-gold uppercase">& KISHAN SEVA KENDRA</div>
              <div className="text-[8px] tracking-[0.27em] text-white/60">TRUST. QUALITY. STRENGTH.</div>
            </div>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/80 lg:flex">
            <a className="nav-link active" href="#home">HOME</a>
            <a className="nav-link" href="#about">ABOUT US</a>
            <a className="nav-link" href="#products">PRODUCTS</a>
            <a className="nav-link" href="#calculator">PRICE ESTIMATE</a>
            <a className="nav-link" href="#contact">CONTACT US</a>
          </nav>
          <a href="tel:+917909095602" className="hidden rounded-lg bg-gold px-5 py-3 text-right text-xs font-bold text-navy md:block">
            <span className="block text-[10px]">CALL US NOW</span>+91 79090 95602
          </a>
          <button className="text-white lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="flex flex-col gap-5 border-t border-white/10 bg-navy px-6 py-6 text-sm font-semibold text-white lg:hidden">
            <a href="#home" onClick={() => setMobileOpen(false)}>HOME</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>ABOUT US</a>
            <a href="#products" onClick={() => setMobileOpen(false)}>PRODUCTS</a>
            <a href="#calculator" onClick={() => setMobileOpen(false)}>PRICE ESTIMATE</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>CONTACT US</a>
          </nav>
        )}
      </header>

      {/* 🌟 HERO SECTION (Brand Name in Focus & Bright Image) 🌟 */}
      <section id="home" className="relative flex min-h-[720px] w-full items-center overflow-hidden bg-navy pt-[76px]">
        
        {/* BACKGROUND IMAGE & FADE EFFECT (RIGHT SIDE) */}
        <div className="absolute inset-0 z-0 flex justify-end">
          <div className="relative w-full lg:w-[65%] h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/30 to-transparent z-10 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent z-10 lg:hidden" />
            
            <img 
              src="/hero-bg.png" 
              alt="Bijendra Prasad at Store" 
              className="w-full h-full object-cover object-[70%_center]"
            />
          </div>
        </div>
        
        {/* FOREGROUND CONTENT */}
        <div className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-20 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          
          {/* LEFT SIDE: BRAND NAME (Hindi & English) */}
          <div className="max-w-2xl text-white">
            
            {/* Chota Tag */}
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-navy/50 backdrop-blur-sm px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gold"></span>
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Welcome | आपका स्वागत है</p>
            </div>
            
            {/* FIX: Hindi Store Name with Corrected Spelling */}
            <h1 className="font-heading text-[3.5rem] font-black leading-[1.05] tracking-tight sm:text-[5.5rem] drop-shadow-md">
              किसान गल्ला भंडार<br />
              <span className="text-gold text-5xl sm:text-6xl mt-2 block">& किसान सेवा केंद्र</span>
            </h1>
            
            {/* English Store Name */}
            <p className="mt-6 font-sans text-xl sm:text-2xl font-extrabold tracking-[0.15em] text-white/90 uppercase drop-shadow-sm border-l-4 border-gold pl-4">
              Kishan Galla Bhandar<br className="hidden sm:block"/>
              <span className="text-base sm:text-lg text-gold/80 tracking-[0.2em]"> & Kishan Seva Kendra</span>
            </p>
            
            {/* Slogan & Description */}
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/90 font-medium">
              सीमेंट, सरिया, गिट्टी, बालू, ईंट और पत्थर के लिए आपका भरोसेमंद होलसेल पार्टनर। बेहतरीन क्वालिटी, मजबूत निर्माण।
              <span className="mt-3 block text-sm text-white/60 leading-6 font-normal tracking-wide">
                Your trusted wholesale partner for Cement, Iron Rod, Gitti, Chard, Bricks and Stone. We deliver quality you can build your reputation on.
              </span>
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#products" className="gold-button !flex-col !items-start gap-1 py-3 px-6 shadow-xl hover:scale-105 transition-transform cursor-pointer">
                <span className="flex items-center gap-2">Explore products <ArrowRight size={17} /></span>
                <span className="text-[11px] font-medium opacity-80 uppercase tracking-wider">हमारे उत्पाद देखें</span>
              </a>
              <a href="#calculator" className="bg-navy/40 backdrop-blur-md border border-white/20 text-white rounded-lg flex flex-col items-start gap-1 py-3 px-6 shadow-xl transition hover:bg-white hover:text-navy cursor-pointer hover:scale-105">
                <span className="font-bold">Get a quote</span>
                <span className="text-[11px] font-medium opacity-80 uppercase tracking-wider">कोटेशन जानें</span>
              </a>
            </div>

            {/* Badges */}
            <div className="mt-12 flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-white/80">
              <span className="flex items-center gap-2">
                <Check className="text-gold stroke-[3]" size={18} />
                <span>Genuine Quality</span>
              </span>
              <span className="flex items-center gap-2">
                <Check className="text-gold stroke-[3]" size={18} />
                <span>On-time Delivery</span>
              </span>
              <span className="flex items-center gap-2">
                <Check className="text-gold stroke-[3]" size={18} />
                <span>Fair Pricing</span>
              </span>
            </div>
          </div>
          
          {/* RIGHT SIDE: Floating Proprietor Card */}
          <div className="relative mx-auto w-full max-w-[380px] self-end lg:mt-auto mt-10">
            <div className="rounded-2xl border border-gold/40 bg-navy/90 backdrop-blur-lg p-6 shadow-2xl transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-gold text-gold bg-navy/50">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="font-heading text-xl font-extrabold text-gold">Bijendra Prasad</p>
                  <p className="text-xs font-bold tracking-widest text-white uppercase mt-1">Proprietor | बिजेंद्र प्रसाद</p>
                </div>
              </div>
              <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-5 text-white/70">
                Serving builders, contractors and homes with integrity.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* 🌟 ABOUT SECTION 🌟 */}
      <section id="about" className="bg-navy py-6 text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            [ShieldCheck,'PREMIUM QUALITY','Genuine materials, every delivery.'],
            [Truck,'TIMELY DELIVERY','Logistics that keep work moving.'],
            [CircleDollarSign,'BEST PRICE','Transparent pricing, no compromise.'],
            [Headphones,'CUSTOMER SUPPORT','A team ready to help you build.']
          ].map(([Icon, title, text]) => (
            <div className="flex items-start gap-4 border-white/15 py-4 lg:border-r lg:px-5 lg:last:border-0" key={title as string}>
              <Icon className="mt-1 shrink-0 text-gold" size={30} />
              <div>
                <h3 className="text-xs font-bold tracking-wide">{title as string}</h3>
                <p className="mt-2 text-xs leading-5 text-white/65">{text as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🌟 PRODUCTS SECTION 🌟 */}
      <section id="products" className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">OUR PRODUCTS</p>
          <h2>Everything your build needs.</h2>
          <p>Reliable materials, measured honestly and delivered to your site.</p>
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <img src={product.image} alt={product.name} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3>{product.name}</h3>
                  <ArrowRight className="text-gold" size={18} />
                </div>
                <p>{product.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 🌟 CALCULATOR SECTION 🌟 */}
      <section id="calculator" className="bg-[#f3f6f8] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">PRICE ESTIMATE | कीमत का अनुमान</p>
            <h2 className="mt-3 font-heading text-4xl font-extrabold text-navy">Plan your material budget.</h2>
            <p className="mt-3 text-muted-foreground">
              Live demo rates below are structured for the owner Rate Management module. Your final quote is confirmed by our team.
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-border bg-navy px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <Calculator className="text-gold" size={20} />
                  <div>
                    <h3 className="font-heading font-bold">Material estimate <span className="text-xs font-normal text-white/70 ml-1">| सामग्री अनुमान</span></h3>
                    <p className="text-xs text-white/60">Select quantities and units <span className="opacity-70">| मात्रा और इकाई चुनें</span></p>
                  </div>
                </div>
                <button onClick={addMaterial} className="flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-xs font-bold text-navy">
                  <Plus size={15} /> Add <span className="font-medium text-[10px]">| और जोड़ें</span>
                </button>
              </div>
              
              <div className="hidden grid-cols-[1.4fr_.7fr_.8fr_1fr_40px] gap-3 border-b border-border px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:grid">
                <span>Material <span className="lowercase font-medium ml-1">| सामग्री</span></span>
                <span>Quantity <span className="lowercase font-medium ml-1">| मात्रा</span></span>
                <span>Unit <span className="lowercase font-medium ml-1">| इकाई</span></span>
                <span>Current rate <span className="lowercase font-medium ml-1">| वर्तमान भाव</span></span>
                <span />
              </div>
              
              <div className="divide-y divide-border">
                {materials.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">No materials available in database.</div>
                ) : (
                  materials.map((item) => (
                    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1.4fr_.7fr_.8fr_1fr_40px] sm:items-center" key={item.id}>
                      
                      <select 
                        className="input-field text-sm font-bold text-navy" 
                        value={item.name} 
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const foundMaterial = dbMaterials.find(m => m.name === selectedName);
                          if (foundMaterial) {
                            updateMaterial(item.id, { 
                              name: foundMaterial.name, 
                              rate: foundMaterial.rate, 
                              unit: foundMaterial.unit 
                            });
                          }
                        }}
                      >
                        <option value="" disabled>Select Material | सामग्री चुनें</option>
                        {dbMaterials.map((dbItem) => (
                          <option key={dbItem.id} value={dbItem.name}>{dbItem.name}</option>
                        ))}
                      </select>

                      <input className="input-field" type="number" min="0" value={item.quantity} onChange={(e) => updateMaterial(item.id, { quantity: Number(e.target.value) })} aria-label="quantity" />
                      
                      <select className="input-field" value={item.unit} onChange={(e) => updateMaterial(item.id, { unit: e.target.value })} aria-label="unit">
                        <option>Bags</option>
                        <option>Ton</option>
                        <option>Pcs</option>
                        <option>SqFt</option>
                      </select>
                      
                      <div className="input-field flex items-center text-sm font-semibold text-navy">
                        ₹ {item.rate.toLocaleString('en-IN')} 
                        <span className="ml-auto text-[10px] text-muted-foreground text-right leading-[1.1]">
                          owner rate<br/><span className="text-[8px]">मालिक का भाव</span>
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => removeMaterial(item.id)} 
                        className="flex flex-col items-center justify-center text-red-400 transition hover:text-red-600 hover:scale-110 ml-2" 
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                        <span className="text-[8px] font-bold mt-1 text-red-500/70">हटाएं</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="grid gap-4 border-t border-border bg-slate-50 px-5 py-5 sm:grid-cols-2">
                <label className="text-sm font-semibold text-navy">
                  Delivery charge <span className="text-xs font-normal text-muted-foreground">| डिलीवरी चार्ज</span>
                  <input className="input-field mt-2 w-full" type="number" value={delivery} onChange={(e) => setDelivery(Number(e.target.value))} />
                </label>
                <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold text-navy">
                  <input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} className="h-4 w-4 accent-[#F5B82E]" /> 
                  <span>Add GST (18%) <span className="text-xs font-normal text-muted-foreground">| GST जोड़ें</span></span>
                </label>
              </div>
            </div>
            
            <aside className="rounded-2xl bg-navy p-6 text-white shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold">
                Estimate summary <span className="tracking-normal font-medium text-[10px] normal-case ml-1 text-gold/70">| अनुमान सार</span>
              </p>
              <div className="mt-7 space-y-4 text-sm">
                <div className="flex justify-between text-white/70 items-center">
                  <span className="flex flex-col">Subtotal <span className="text-[10px] text-white/40">कुल</span></span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/70 items-center">
                  <span className="flex flex-col">Delivery <span className="text-[10px] text-white/40">डिलीवरी चार्ज</span></span>
                  <span>{formatINR(delivery)}</span>
                </div>
                <div className="flex justify-between text-white/70 items-center">
                  <span className="flex flex-col">GST (18%) <span className="text-[10px] text-white/40">टैक्स</span></span>
                  <span>{formatINR(gst)}</span>
                </div>
              </div>
              <div className="my-7 border-t border-white/15" />
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold flex flex-col">Grand total <span className="text-[10px] font-normal text-white/50">कुल राशि</span></span>
                <strong className="font-heading text-3xl text-gold">{formatINR(total)}</strong>
              </div>
              <button className="mt-7 flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-gold py-3 text-sm font-bold text-navy">
                <div className="flex items-center gap-2">Request this quote <ArrowRight size={16} /></div>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">यह कोटेशन मांगें</span>
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-white/50">
                Final rates confirmed by Kishan Galla Bhandar after enquiry.<br/>
                <span className="text-[10px]">पूछताछ के बाद अंतिम दरों की पुष्टि की जाएगी।</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* 🌟 WHY US SECTION 🌟 */}
      <section className="section-shell">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="eyebrow uppercase">WHY KISHAN GALLA BHANDAR</p>
            <h2 className="mt-3 font-heading text-4xl font-extrabold text-navy">Built on trust.<br />Delivered with care.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">From the first bag to the final truckload, our team helps you source better and build with confidence.</p>
            <a href="#contact" className="mt-7 inline-flex items-center gap-2 font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
              Talk to our team <ArrowRight size={17} />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Wholesale rates for every project','Verified materials and consistent quality','Flexible quantities for builders and homes','Dedicated delivery coordination'].map((item, i) => (
              <div className="rounded-xl border border-border bg-white p-5 shadow-sm" key={item}>
                <div className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold">
                  <span className="font-heading text-lg font-bold">0{i + 1}</span>
                </div>
                <p className="font-bold text-navy">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 CONTACT & MAP SECTION 🌟 */}
      <section id="contact" className="bg-slate-50 py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-extrabold text-navy">Find Us</h2>
          <p className="mt-3 text-lg text-muted-foreground mb-10">
            Visit our godown or get direct directions from your location.
          </p>

          <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 relative mb-12">
            <iframe 
              src="https://maps.google.com/maps?q=VMQ9+CVW,+Roh,+Bihar&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gold font-bold">
                <MapPin size={24} /> <span className="text-navy text-lg">Our Location</span>
              </div>
              <p className="text-sm text-slate-500 font-medium ml-9">
                Kishan Galla Bhandar & Kishan Seva Kendra<br/>
                <span className="text-sm text-navy mt-1 block font-bold">VMQ9+CVW, Roh, Bihar</span>
              </p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=VMQ9%2BCVW%2C%2BRoh%2C%2BBihar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 ml-9 inline-flex w-fit items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy shadow-md hover:scale-105 transition-transform"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gold font-bold">
                <PhoneCall size={24} /> <span className="text-navy text-lg">Call Us</span>
              </div>
              <p className="text-sm text-slate-500 font-medium ml-9 mt-1">
                For bulk orders and enquiries.
              </p>
              <div className="ml-9 mt-2 flex flex-col gap-1">
                <a href="tel:+917909095602" className="text-lg font-black text-navy hover:text-gold transition">
                  +91 79090 95602
                </a>
                <a href="tel:+919801436351" className="text-lg font-black text-navy hover:text-gold transition">
                  +91 98014 36351
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gold font-bold">
                <Clock3 size={24} /> <span className="text-navy text-lg">Business Hours</span>
              </div>
              <p className="text-sm text-slate-500 font-medium ml-9 mt-1 leading-relaxed">
                <span className="text-emerald-600 font-bold">Open All Days (रविवार को भी खुला)</span><br/>
                8:00 AM - 8:00 PM<br/>
                <span className="text-red-500 mt-1 block text-xs font-bold uppercase tracking-wider">
                  Closed only on 2nd of every month
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 FOOTER 🌟 */}
      <footer className="bg-navy py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 text-xs text-white/55 sm:flex-row lg:px-8">
          <p>© 2026 Kishan Galla Bhandar & Kishan Seva Kendra. All rights reserved.</p>
          <a href="/login" className="flex items-center gap-2 transition hover:text-gold">
            <BarChart3 size={14} /> Owner login
          </a>
        </div>
      </footer>
    </main>
  )
}