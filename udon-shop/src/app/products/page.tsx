import { getProducts } from '@/lib/data-provider'
import ProductCard from '@/components/ProductCard'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const products = await getProducts()

  return <ProductsClient products={products} />
}