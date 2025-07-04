import { mockProducts, mockUsers, mockOrders } from './mock-data';
import { Product, normalizeProduct } from '@/types/product';

// 静的サイト生成時はモックデータを使用
const isStaticGeneration = process.env.NODE_ENV === 'production' && typeof window === 'undefined';

export async function getProducts(): Promise<Product[]> {
  if (isStaticGeneration) {
    return mockProducts.map(normalizeProduct);
  }
  
  // 開発時はPrismaを使用（既存のロジック）
  try {
    const { prisma } = await import('./prisma');
    const products = await prisma.product.findMany();
    return products.map(normalizeProduct);
  } catch (error) {
    console.warn('Database not available, using mock data:', error);
    return mockProducts.map(normalizeProduct);
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (isStaticGeneration) {
    const product = mockProducts.find(product => product.id === id);
    return product ? normalizeProduct(product) : null;
  }
  
  try {
    const { prisma } = await import('./prisma');
    const product = await prisma.product.findUnique({
      where: { id }
    });
    return product ? normalizeProduct(product) : null;
  } catch (error) {
    console.warn('Database not available, using mock data:', error);
    const product = mockProducts.find(product => product.id === id);
    return product ? normalizeProduct(product) : null;
  }
}

export async function getUsers() {
  if (isStaticGeneration) {
    return mockUsers;
  }
  
  try {
    const { prisma } = await import('./prisma');
    return await prisma.user.findMany();
  } catch (error) {
    console.warn('Database not available, using mock data:', error);
    return mockUsers;
  }
}

export async function getOrders() {
  if (isStaticGeneration) {
    return mockOrders;
  }
  
  try {
    const { prisma } = await import('./prisma');
    return await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.warn('Database not available, using mock data:', error);
    return mockOrders;
  }
}