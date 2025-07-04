// IndexedDB wrapper for client-side data storage

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: Date;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

class IndexedDBManager {
  private dbName = 'UdonShopDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Products store
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }

        // Orders store
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
          orderStore.createIndex('userId', 'userId', { unique: false });
        }

        // OrderItems store
        if (!db.objectStoreNames.contains('orderItems')) {
          const orderItemStore = db.createObjectStore('orderItems', { keyPath: 'id' });
          orderItemStore.createIndex('orderId', 'orderId', { unique: false });
        }
      };
    });
  }

  // User operations
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add(newUser);

      request.onsuccess = () => resolve(newUser);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Product operations
  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.add(newProduct);

      request.onsuccess = () => resolve(newProduct);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const product = getRequest.result;
        if (!product) {
          resolve(null);
          return;
        }

        const updatedProduct = { ...product, ...updates };
        const putRequest = store.put(updatedProduct);

        putRequest.onsuccess = () => resolve(updatedProduct);
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Order operations
  async createOrder(order: Omit<Order, 'id' | 'orderDate'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      orderDate: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.add(newOrder);

      request.onsuccess = () => resolve(newOrder);
      request.onerror = () => reject(request.error);
    });
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const order = getRequest.result;
        if (!order) {
          resolve(null);
          return;
        }

        const updatedOrder = { ...order, status };
        const putRequest = store.put(updatedOrder);

        putRequest.onsuccess = () => resolve(updatedOrder);
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // OrderItem operations
  async createOrderItem(orderItem: Omit<OrderItem, 'id'>): Promise<OrderItem> {
    const newOrderItem: OrderItem = {
      ...orderItem,
      id: crypto.randomUUID(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orderItems'], 'readwrite');
      const store = transaction.objectStore('orderItems');
      const request = store.add(newOrderItem);

      request.onsuccess = () => resolve(newOrderItem);
      request.onerror = () => reject(request.error);
    });
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orderItems'], 'readonly');
      const store = transaction.objectStore('orderItems');
      const index = store.index('orderId');
      const request = index.getAll(orderId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Initialize sample data
  async initSampleData(): Promise<void> {
    // Check if products already exist
    const existingProducts = await this.getAllProducts();
    if (existingProducts.length > 0) {
      return; // Sample data already exists
    }

    // Create sample products
    const sampleProducts = [
      {
        name: '讃岐風創作うどん',
        description: 'コシの強い讃岐うどんに特製だしと季節の野菜をトッピング',
        price: 1200,
        stock: 50,
        imageUrl: '/images/sanuki-udon.jpg'
      },
      {
        name: '明太子クリームうどん',
        description: '濃厚なクリームソースに明太子の辛味がアクセント',
        price: 1400,
        stock: 30,
        imageUrl: '/images/mentaiko-cream-udon.jpg'
      },
      {
        name: 'カレーうどん',
        description: 'スパイシーなカレールーとうどんの絶妙なハーモニー',
        price: 1300,
        stock: 40,
        imageUrl: '/images/curry-udon.jpg'
      },
      {
        name: '海鮮うどん',
        description: '新鮮な海の幸をふんだんに使った贅沢うどん',
        price: 1800,
        stock: 20,
        imageUrl: '/images/seafood-udon.jpg'
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }
}

export const dbManager = new IndexedDBManager();