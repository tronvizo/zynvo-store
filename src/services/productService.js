import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { DEMO_PRODUCTS } from "./seedData";

const PRODUCTS_COLLECTION = "products";

const getDeletedProductIds = () => {
  try {
    return JSON.parse(localStorage.getItem('zynvo_deleted_products') || '[]');
  } catch {
    return [];
  }
};

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
  const deletedIds = getDeletedProductIds();

  try {
    let q = collection(db, PRODUCTS_COLLECTION);
    
    if (categoryId && categoryId !== "all") {
      q = query(q, where("categoryId", "==", categoryId));
    }

    const snapshot = await getDocs(q);
    const firestoreProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Start with demo products as baseline
    let initialDemo = DEMO_PRODUCTS;
    if (categoryId && categoryId !== "all") {
      initialDemo = DEMO_PRODUCTS.filter(p => p.categoryId === categoryId);
    }

    // Merge: Demo products as base, Firestore docs override or append
    const productMap = new Map(initialDemo.map(p => [p.id, { ...p }]));
    firestoreProducts.forEach(fp => {
      productMap.set(fp.id, { ...(productMap.get(fp.id) || {}), ...fp });
    });

    products = Array.from(productMap.values()).filter(p => !p.isDeleted && !deletedIds.includes(p.id));
  } catch (error) {
    console.warn("Firestore products read fallback:", error.message);
    products = [...DEMO_PRODUCTS].filter(p => !p.isDeleted && !deletedIds.includes(p.id));
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
  const all = await getProducts({ sortBy: "newest" });
  return all.slice(0, limitCount);
};

export const getPopularProducts = async (limitCount = 10) => {
  const all = await getProducts({ sortBy: "rating" });
  return all.filter(p => p.isPopular || (Number(p.rating) || 0) >= 4.7).slice(0, limitCount);
};

export const getAllProducts = async (limitCount = 10) => {
  const all = await getProducts();
  return all.slice(0, limitCount);
};

export const getProductById = async (id) => {
  const deletedIds = getDeletedProductIds();
  if (deletedIds.includes(id)) return null;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.isDeleted) return null;
      return { id: snap.id, ...data };
    }
  } catch (error) {
    console.warn("Product by id Firestore fallback:", error.message);
  }
  const fallback = DEMO_PRODUCTS.find(p => p.id === id);
  return fallback && !fallback.isDeleted ? fallback : null;
};

export const addProduct = async (productData) => {
  const data = {
    title: productData.title.trim(),
    description: productData.description.trim(),
    price: Number(productData.price),
    rating: Number(productData.rating) || 0,
    reviewsCount: productData.reviewsCount ? productData.reviewsCount.trim() : '',
    categoryId: productData.categoryId,
    imageUrl: productData.imageUrl.trim(),
    affiliateLink: productData.affiliateLink.trim(),
    isPopular: Boolean(productData.isPopular),
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
  return docRef.id;
};

export const updateProduct = async (id, productData) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const fallback = DEMO_PRODUCTS.find(p => p.id === id) || {};
  const data = {
    ...fallback,
    ...productData,
    price: Number(productData.price),
    rating: Number(productData.rating) || 0,
    reviewsCount: productData.reviewsCount !== undefined ? productData.reviewsCount.trim() : (fallback.reviewsCount || ''),
    isDeleted: false,
    updatedAt: serverTimestamp()
  };

  // setDoc with merge: true handles both demo and new documents
  await setDoc(docRef, data, { merge: true });
};

export const deleteProduct = async (id) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);

  // Directly delete document in Firestore (matches "allow delete: if request.auth != null;")
  await deleteDoc(docRef);

  // Also record locally in deleted IDs list so demo items won't reappear
  try {
    const deleted = getDeletedProductIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('zynvo_deleted_products', JSON.stringify(deleted));
    }
  } catch (err) {
    console.warn("Delete local storage sync error:", err);
  }
};
