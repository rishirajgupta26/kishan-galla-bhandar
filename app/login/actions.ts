'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma' 

export async function loginAction(username: string, pass: string) {
  try {
    let admin = await prisma.admin.findUnique({
      where: { username: username }
    })

    // AUTO-CREATE MAGICAL LOGIC ✨
    // Agar database khali hai aur aap 'sachin' daal kar login karte hain, 
    // toh yeh pehle usko database me hamesha ke liye save karega!
    if (!admin && username === 'sachin' && pass === 'kishan@2026') {
      admin = await prisma.admin.create({
        data: {
          username: 'sachin',
          password: 'kishan@2026'
        }
      })
    }

    if (!admin) {
      return { success: false, message: "Invalid Username or Password" }
    }

    if (admin.password !== pass) {
      return { success: false, message: "Password match nahi hua!" }
    }

    // Login Successful - Setting the session
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    
    return { success: true }

  } catch (error: any) {
    console.error("Login error:", error)
    return { success: false, message: `DB Error: ${error.message}` }
  }
}

export async function logout() {
  const cookieStore = await cookies() 
  cookieStore.delete('admin_auth')
  redirect('/login')
}