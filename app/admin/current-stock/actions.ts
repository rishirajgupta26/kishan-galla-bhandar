'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// 1. Material Update karne ka function (Ab Naam bhi update hoga)
export async function updateMaterialData(id: number, newName: string, newStock: number, newRate: number) {
  await prisma.material.update({
    where: { id },
    data: {
      name: newName,
      stock: newStock,
      currentRate: newRate,
    },
  })
  
  revalidatePath('/admin/current-stock')
}

// 2. NAYA: Material Delete karne ka function
export async function deleteMaterialItem(id: number) {
  await prisma.material.delete({
    where: { id },
  })
  
  revalidatePath('/admin/current-stock')
}