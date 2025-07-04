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
export function normalizeProduct(product: Record<string, unknown>): Product {
  return {
    id: String(product.id),
    name: String(product.name),
    description: String(product.description),
    price: Number(product.price),
    stock: Number(product.stock),
    imageUrl: (product.imageUrl as string) || (product.image as string) || undefined,
    category: product.category as string | undefined,
    createdAt: product.createdAt as Date,
    updatedAt: product.updatedAt as Date
  }
}