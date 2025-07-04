import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data-provider'
import ProductDetailClient from './ProductDetailClient'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}