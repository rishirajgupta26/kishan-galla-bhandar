'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
// Agar Prisma use kar rahe hain toh apna db import kijiye:
// import { prisma } from '@/lib/prisma' 

export async function updatePasswordAction(currentPass: string, newPass: string) {
  try {
    // 1. Sabse pehle database se owner/admin ka data nikalenge
    // Yahan hum maan kar chal rahe hain ki aapke DB mein 'Admin' naam ki table hai
    /* 
    const admin = await prisma.admin.findFirst({
      where: { username: 'sachin' }
    })
    
    if (!admin) {
      return { success: false, message: 'Admin account nahi mila!' }
    }
    */

    // 🔴 DEMO CHECK (Jab tak aap DB connect na karein):
    // Abhi ke liye purana password verify kar rahe hain
    const validPass = process.env.ADMIN_PASSWORD // Ise baad me admin.password se replace karein
    
    if (currentPass !== validPass) {
      return { success: false, message: 'Current password galat hai! Kripya sahi password daalein.' }
    }

    // 2. Agar current password sahi hai, toh naya password Database mein Update karenge
    /*
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newPass }
    })
    */

    // 3. Password update hone ke baad session ko refresh karna (optional, par secure hota hai)
    const cookieStore = await cookies()
    // Hum chahein toh purana cookie delete karke user ko wapas login page par bhej sakte hain
    // cookieStore.delete('admin_auth') 

    return { success: true, message: 'Password successfully update ho gaya!' }

  } catch (error) {
    console.error("Password update error:", error)
    return { success: false, message: 'Server mein kuch gadbad hui. Kripya thodi der baad try karein.' }
  }
}