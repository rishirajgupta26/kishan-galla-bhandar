import { prisma } from '@/lib/prisma'
import StockClient from './StockClient' 

export default async function CurrentStockPage() {
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  })

  const totalValue = materials.reduce((sum, item) => {
    return sum + (item.stock * item.currentRate)
  }, 0)

  return (
    <StockClient materials={materials} totalValue={totalValue} />
  )
}