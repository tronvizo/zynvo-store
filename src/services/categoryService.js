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
import { DEMO_CATEGORIES } from "./seedData";

const CATEGORIES_COLLECTION = "categories";
const PRODUCTS_COLLECTION = "products";

export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const firestoreCats = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    // Deduplicate by lowercased category name to prevent any duplicate chips
    const categoryNameMap = new Map();

    // 1. Add default demo categories
    DEMO_CATEGORIES.forEach(c => {
      if (!c.isDeleted && c.name) {
        categoryNameMap.set(c.name.toLowerCase().trim(), { ...c });
      }
    });

    // 2. Merge or override with Firestore categories (Firestore docs take priority)
    firestoreCats.forEach(fc => {
      if (!fc.isDeleted && fc.name) {
        const key = fc.name.toLowerCase().trim();
        const existing = categoryNameMap.get(key) || {};
        categoryNameMap.set(key, { ...existing, ...fc, id: fc.id });
      }
    });

    return Array.from(categoryNameMap.values())
      .filter(c => !c.isDeleted)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } catch (error) {
    console.warn("Firestore categories read fallback:", error.message);
    return DEMO_CATEGORIES.filter(c => !c.isDeleted);
  }
};

export const getCategoryById = async (id) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.isDeleted) return null;
      return { id: snap.id, ...data };
    }
  } catch (error) {
    console.warn("Firestore category by id fallback:", error.message);
  }
  const fallback = DEMO_CATEGORIES.find(c => c.id === id);
  return fallback && !fallback.isDeleted ? fallback : null;
};

export const addCategory = async ({ name, iconKey = "Category" }) => {
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: name.trim(),
    iconKey: iconKey.trim() || "Category",
    isDeleted: false,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateCategory = async (id, { name, iconKey }) => {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  const fallback = DEMO_CATEGORIES.find(c => c.id === id) || {};
  const updateData = {
    ...fallback,
    ...(name !== undefined && { name: name.trim() }),
    ...(iconKey !== undefined && { iconKey: iconKey.trim() }),
    isDeleted: false,
    updatedAt: serverTimestamp()
  };

  await setDoc(docRef, updateData, { merge: true });
};

export const deleteCategory = async (id) => {
  const q = query(collection(db, PRODUCTS_COLLECTION), where("categoryId", "==", id));
  const snap = await getDocs(q);
  const activeProducts = snap.docs.filter(d => !d.data().isDeleted);
  if (activeProducts.length > 0) {
    throw new Error(`Cannot delete category: ${activeProducts.length} products are currently assigned to it.`);
  }

  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(docRef);

  try {
    const deleted = JSON.parse(localStorage.getItem('zynvo_deleted_categories') || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('zynvo_deleted_categories', JSON.stringify(deleted));
    }
  } catch (err) {
    console.warn("Delete category local storage error:", err);
  }
};
