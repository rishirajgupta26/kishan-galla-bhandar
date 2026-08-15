'use server'

import { prisma } from '../../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addMaterial(formData: FormData) {
  await prisma.material.create({
    data: {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      unit_price: parseFloat(formData.get('unit_price') as string),
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
    }
  })
  // Yeh Next.js ko batata hai ki data change ho gaya hai, in pages ko refresh kar do
  revalidatePath('/admin/rates')
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
}

export async function deleteMaterial(id: number) {
  await prisma.material.delete({
    where: { id }
  })
  revalidatePath('/admin/rates')
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
}