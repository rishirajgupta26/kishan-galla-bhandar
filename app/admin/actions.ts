'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ==========================================
// 1. Maal Aaya / Bika (Ledger) Ka Logic
// ==========================================
export async function recordLedgerEntry(formData: FormData) {
  const materialId = formData.get('materialId') as string
  const type = formData.get('type') as 'AAYA' | 'BIKA'
  const quantity = parseFloat(formData.get('quantity') as string)
  const description = formData.get('description') as string

  if (!materialId || !quantity || quantity <= 0) {
    throw new Error('Invalid input data')
  }

  // Prisma Transaction: Dono kaam ek saath hone chahiye
  await prisma.$transaction(async (tx) => {
    // 1. Ledger mein entry banayein
    await tx.ledger.create({
      data: {
        materialId,
        type,
        quantity,
        description: description || (type === 'AAYA' ? `${quantity} Received` : `${quantity} Sold`),
      },
    })

    // 2. Material table mein main stock update karein
    const stockChange = type === 'AAYA' ? quantity : -quantity
    await tx.material.update({
      where: { id: materialId },
      data: {
        stock: {
          increment: stockChange,
        },
      },
    })
  }, 
  {
    maxWait: 5000,   // Connection milne ka wait
    timeout: 15000,  // Transaction complete hone ka timeout 
  })

  // Cache clear karein taaki dashboard par naya data dikhe
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/current-stock')
  
  // Maal Aaya hai toh purchases page pe raho, Bika hai toh sales pe
  if (type === 'AAYA') {
    redirect('/admin/dashboard') 
  }
}

// ==========================================
// 2. Naya Material Add Karne Ka Logic
// ==========================================
export async function addMaterial(formData: FormData) {
  const name = formData.get('name') as string
  const unit = formData.get('unit') as string
  const currentRate = parseFloat(formData.get('currentRate') as string)

  if (!name || !unit) return

  await prisma.material.create({
    data: {
      name,
      unit,
      currentRate: currentRate || 0,
      stock: 0, // Naya item humesha 0 stock se shuru hoga
      status: 'In Stock'
    }
  })

  // Data save hone ke baad page refresh karo
  revalidatePath('/admin/rates')
  revalidatePath('/admin/purchases') 
}

// ==========================================
// 3. Delete & Clear Dashboard Logic (For Owner)
// ==========================================

// Sirf ek specific galat entry ko delete karne ke liye
export async function deleteLedgerEntry(entryId: string) {
  try {
    const entry = await prisma.ledger.findUnique({ where: { id: entryId } });
    if (!entry) return { success: false, error: 'Entry not found' };

    await prisma.$transaction(async (tx) => {
      // 1. Entry uda do
      await tx.ledger.delete({
        where: { id: entryId }
      });

      // 2. Stock ko wapas theek (reverse) karo
      const stockChange = entry.type === 'AAYA' ? -entry.quantity : entry.quantity;
      await tx.material.update({
        where: { id: entry.materialId },
        data: {
          stock: {
            increment: stockChange
          }
        }
      });
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/recent-activity');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Delete failed' };
  }
}

// Naya saal shuru hone par poori history aur stock 0 karne ke liye (FACTORY RESET)
// Naya saal/mahina shuru hone par SIRF history delete karne ke liye
export async function clearEntireDashboard() {
  try {
    // 1. YEH LINE SIRF ACTIVITY (Maal Aaya/Bika) DELETE KAREGI
    await prisma.ledger.deleteMany({});
    
    // (Stock 0 karne wali line humne yahan se hata di hai. Ab stock ekdum safe rahega)

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/recent-activity');
    revalidatePath('/admin/current-stock');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'History clear nahi hui' };
  }
}
// Naya function - Bill ko database mein save karne ke liye
// Naya Smart function - Naya bill create karega, aur existing ko update karega (No Error!)
// Naya "Bulletproof" function - Format mismatches ko fix karne ke liye
export async function saveInvoiceData(data: any) {
  try {
    // Data ko strictly format kar rahe hain taaki Prisma gussa na ho
    const safeTotal = Number(data.totalAmount) || 0;
    const safeCart = data.cart ? JSON.parse(JSON.stringify(data.cart)) : [];

    await prisma.invoice.upsert({
      where: { 
        invoiceNo: String(data.invoiceNo)
      },
      update: {
        invoiceDate: String(data.invoiceDate),
        customerName: String(data.customerName),
        customerPhone: String(data.customerPhone || ""),
        totalAmount: safeTotal,
        cartData: safeCart, 
      },
      create: {
        invoiceNo: String(data.invoiceNo),
        invoiceDate: String(data.invoiceDate),
        customerName: String(data.customerName),
        customerPhone: String(data.customerPhone || ""),
        totalAmount: safeTotal,
        cartData: safeCart, 
      }
    });
    return { success: true };
  } catch (error) {
    // Yahan humne error message ko thoda bada kar diya hai taaki asani se dikhe
    console.error("🚨 👉 BILL SAVE ERROR (YAHAN DEKHIYE):", error);
    return { success: false, error: 'Bill save nahi ho paya' };
  }
}