import bcrypt from 'bcryptjs'
import { dbManager, User } from './indexeddb'

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export class AuthManager {
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
  }): Promise<AuthUser | null> {
    try {
      await dbManager.init();
      
      // Check if user already exists
      const existingUser = await dbManager.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('ユーザーは既に存在します');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const newUser = await dbManager.createUser({
        ...userData,
        password: hashedPassword,
      });

      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  static async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      await dbManager.init();
      
      const user = await dbManager.getUserByEmail(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    try {
      await dbManager.init();
      
      const user = await dbManager.getUserById(id);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}

// Client-side session management
export class SessionManager {
  private static readonly SESSION_KEY = 'udon-shop-session';

  static setSession(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    }
  }

  static getSession(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        try {
          return JSON.parse(sessionData);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  static isLoggedIn(): boolean {
    return this.getSession() !== null;
  }
}