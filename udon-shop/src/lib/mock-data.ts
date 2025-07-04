// GitHub Pages用のモックデータ
export const mockProducts = [
  {
    id: 'b2374ec6-6c3d-4432-9d55-216d479bdd63',
    name: '讃岐うどん',
    description: '本場香川の讃岐うどん。コシのある麺が自慢です。',
    price: 800,
    image: '/images/sanuki-udon.svg',
    category: 'うどん',
    stock: 10,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'c3485fd7-7d4e-5543-ae66-327e58acee74',
    name: 'カレーうどん',
    description: 'スパイシーなカレーと麺の絶妙なハーモニー。',
    price: 950,
    image: '/images/curry-udon.svg',
    category: 'うどん',
    stock: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'd4596ge8-8e5f-6654-bf77-438f69bdf85',
    name: '明太クリームうどん',
    description: 'クリーミーな明太子ソースが絡む贅沢なうどん。',
    price: 1100,
    image: '/images/mentaiko-cream-udon.svg',
    category: 'うどん',
    stock: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'e5607hf9-9f6g-7765-cg88-549g7aceg96',
    name: '海鮮うどん',
    description: '新鮮な海の幸がたっぷり入った豪華なうどん。',
    price: 1300,
    image: '/images/seafood-udon.svg',
    category: 'うどん',
    stock: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockUsers = [
  {
    id: 'user1',
    email: 'admin@example.com',
    name: '管理者',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockOrders = [];