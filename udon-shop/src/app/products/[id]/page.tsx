import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data-provider'
import ProductDetailClient from './ProductDetailClient'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}