import { prisma } from '../lib/prisma'
import HomeClient, { Material } from './HomeClient'

// Server Component
export default async function Page() {
  // 1. Neon Database se live materials fetch karein
  const dbItems = await prisma.material.findMany()

  // 2. Neon Database format ko Calculator ke UI format mein badlein
  const formattedMaterials: Material[] = dbItems.map((item) => ({
    id: item.id,
    name: item.name,
    unit: item.unit || 'Pcs',
    rate: Number(item.currentRate) || 0,
    quantity: 1, 
  }))

  // 3. Client component render karein aur database ka data bhejein
  return <HomeClient dbMaterials={formattedMaterials} />
}