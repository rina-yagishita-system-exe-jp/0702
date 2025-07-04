// 共通のProduct型定義
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string | null
  image?: string // モックデータ用
  category?: string
  createdAt: Date
  updatedAt: Date
}

// データプロバイダー用の型変換関数
export function normalizeProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl || product.image || undefined,
    category: product.category,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }
}