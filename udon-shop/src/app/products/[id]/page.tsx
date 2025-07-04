import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/data-provider'
import ProductDetailClient from './ProductDetailClient'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}