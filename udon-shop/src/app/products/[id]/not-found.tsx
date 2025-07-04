import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品が見つかりません</h1>
          <p className="text-gray-600 mb-8">
            お探しの商品は存在しないか、削除された可能性があります。
          </p>
          <Link
            href="/products"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            商品一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}