import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { SAMPLE_PRODUCTS } from '../data/products';

const LOCAL_PRODUCTS_KEY = 'nexamod_local_products';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  compatibleModels: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
}

// Helper to get stored products either from Firestore or the local cache
export async function getStoredProducts(): Promise<Product[]> {
  try {
    const qSnapshot = await getDocs(collection(db, 'products'));
    const fsProducts = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    if (fsProducts.length > 0) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(fsProducts));
      return fsProducts;
    }
  } catch (error) {
    console.warn('Firestore products fetch failed or denied. Reading local fallback storage.', error);
  }

  const localStr = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (localStr) {
    try {
      return JSON.parse(localStr);
    } catch (e) {
      console.error('Error parsing local products list:', e);
    }
  }

  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS));
  return SAMPLE_PRODUCTS;
}

// Helper to add a product synchronously locally and async on Firestore
export async function addStoredProduct(productData: Omit<Product, 'id'>, isMe: boolean): Promise<Product> {
  const newId = 'module-' + Math.random().toString(36).substr(2, 9);
  const newProduct: Product = {
    id: newId,
    ...productData,
    rating: 5,
    reviewCount: 0
  };

  if (isMe) {
    try {
      const docRef = doc(db, 'products', newId);
      await setDoc(docRef, newProduct);
      console.log('Successfully saved to Firestore cloud.');
    } catch (error) {
      console.error('Could not write to Firestore cloud, saved local-only:', error);
    }
  }

  // Read latest cached list, insert new product, and save to offline cache
  const localStr = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  let current: Product[] = [];
  if (localStr) {
    try {
      current = JSON.parse(localStr);
    } catch (e) {
      current = [...SAMPLE_PRODUCTS];
    }
  } else {
    current = [...SAMPLE_PRODUCTS];
  }

  const updated = [newProduct, ...current];
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  return newProduct;
}

// Helper to update a product
export async function updateStoredProduct(id: string, updatedFields: Partial<Product>, isMe: boolean): Promise<Product[]> {
  const localStr = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  let current: Product[] = [];
  if (localStr) {
    try {
      current = JSON.parse(localStr);
    } catch (e) {
      current = [...SAMPLE_PRODUCTS];
    }
  } else {
    current = [...SAMPLE_PRODUCTS];
  }

  const updated = current.map(p => p.id === id ? { ...p, ...updatedFields } : p);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));

  const updatedProduct = updated.find(p => p.id === id);

  if (isMe && updatedProduct) {
    try {
      const docRef = doc(db, 'products', id);
      await setDoc(docRef, updatedProduct, { merge: true });
      console.log('Successfully updated on Firestore cloud.');
    } catch (error) {
      console.error('Could not update on Firestore cloud, updating local-only:', error);
    }
  }

  return updated;
}

// Helper to delete a product
export async function deleteStoredProduct(id: string, isMe: boolean): Promise<Product[]> {
  if (isMe) {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      console.log('Successfully deleted from Firestore cloud.');
    } catch (error) {
      console.error('Could not delete from Firestore cloud, deleting local-only:', error);
    }
  }

  const localStr = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  let current: Product[] = [];
  if (localStr) {
    try {
      current = JSON.parse(localStr);
    } catch (e) {
      current = [...SAMPLE_PRODUCTS];
    }
  } else {
    current = [...SAMPLE_PRODUCTS];
  }

  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
}

// Helper to seed/reset database state locally
export function seedLocalProducts(productsToSeed: Product[]) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(productsToSeed));
}
