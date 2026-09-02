import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { DEMO_PRODUCTS } from "./seedData";

const PRODUCTS_COLLECTION = "products";

export const getProducts = async (filters = {}) => {
  const {
    categoryId,
    sortBy = "newest", // 'newest' | 'price-asc' | 'price-desc' | 'rating'
    search = "",
    minRating = 0,
    minPrice,
    maxPrice
  } = filters;

  let products = [];

  try {
    let q = collection(db, PRODUCTS_COLLECTION);
    
    if (categoryId && categoryId !== "all") {
      q = query(q, where("categoryId", "==", categoryId));
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      products = [...DEMO_PRODUCTS];
      if (categoryId && categoryId !== "all") {
        products = products.filter(p => p.categoryId === categoryId);
      }
    }
  } catch (error) {
    console.warn("Firestore products read fallback:", error.message);
    products = [...DEMO_PRODUCTS];
    if (categoryId && categoryId !== "all") {
      products = products.filter(p => p.categoryId === categoryId);
    }
  }

  // Client-side text search (title & description)
  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    products = products.filter(p => 
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }

  // Client-side rating filter
  if (minRating > 0) {
    products = products.filter(p => (Number(p.rating) || 0) >= minRating);
  }

  // Client-side price range
  if (minPrice !== undefined && minPrice !== null) {
    products = products.filter(p => Number(p.price) >= minPrice);
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    products = products.filter(p => Number(p.price) <= maxPrice);
  }

  // Sorting
  products.sort((a, b) => {
    if (sortBy === "price-asc") {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === "price-desc") {
      return Number(b.price) - Number(a.price);
    }
    if (sortBy === "rating") {
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    }
    // default: newest
    const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (new Date(a.createdAt || 0)).getTime();
    const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (new Date(b.createdAt || 0)).getTime();
    return dateB - dateA;
  });

  return products;
};

export const getNewProducts = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("New products Firestore fallback:", error.message);
  }
  const all = await getProducts();
  return all.slice(0, limitCount);
};

export const getPopularProducts = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("rating", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Popular products Firestore fallback:", error.message);
  }
  const all = await getProducts({ sortBy: "rating" });
  return all.filter(p => p.isPopular || p.rating >= 4.7).slice(0, limitCount);
};

export const getAllProducts = async (limitCount = 10) => {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), limit(limitCount));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("All products Firestore fallback:", error.message);
  }
  const all = await getProducts();
  return all.slice(0, limitCount);
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.warn("Product by id Firestore fallback:", error.message);
  }
  return DEMO_PRODUCTS.find(p => p.id === id) || null;
};

export const addProduct = async (productData) => {
  const data = {
    title: productData.title.trim(),
    description: productData.description.trim(),
    price: Number(productData.price),
    rating: Number(productData.rating) || 0,
    categoryId: productData.categoryId,
    imageUrl: productData.imageUrl.trim(),
    affiliateLink: productData.affiliateLink.trim(),
    isPopular: Boolean(productData.isPopular),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
  return docRef.id;
};

export const updateProduct = async (id, productData) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const data = {
    ...productData,
    price: Number(productData.price),
    rating: Number(productData.rating) || 0,
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, data);
};

export const deleteProduct = async (id) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
};
