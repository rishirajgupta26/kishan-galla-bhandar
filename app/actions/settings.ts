'use server'

import { prisma } from '@/lib/prisma'

export async function updateAdminCredentials(
  currentUsername: string, 
  currentPass: string, 
  newUsername: string, 
  newPass: string
) {
  try {
    // 1. Check karein ki current user database mein hai ya nahi
    const admin = await prisma.admin.findUnique({
      where: { username: currentUsername }
    })

    if (!admin) {
      return { success: false, message: "Current Username system mein nahi mila!" }
    }

    // 2. Verify karein ki current password sahi hai
    if (admin.password !== currentPass) {
      return { success: false, message: "Current password galat hai!" }
    }

    // 3. Naya Username aur Password database mein UPDATE kar dein
    await prisma.admin.update({
      where: { username: currentUsername },
      data: { 
        username: newUsername,
        password: newPass 
      }
    })

    return { success: true, message: "Username aur Password successfully update ho gaye!" }

  } catch (error: any) {
    console.error("Credentials update error:", error)
    return { success: false, message: `System Error: ${error.message}` }
  }
}