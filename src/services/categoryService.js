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
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { DEMO_CATEGORIES } from "./seedData";

const CATEGORIES_COLLECTION = "categories";
const PRODUCTS_COLLECTION = "products";

export const getCategories = async () => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
    }
    // If empty in Firestore, fallback to demo categories
    return DEMO_CATEGORIES;
  } catch (error) {
    console.warn("Firestore categories read fallback:", error.message);
    try {
      const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      }
    } catch {
      // Ignored: proceed to fallback
    }
    return DEMO_CATEGORIES;
  }
};

export const getCategoryById = async (id) => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.warn("Firestore category by id fallback:", error.message);
  }
  return DEMO_CATEGORIES.find(c => c.id === id) || null;
};

export const addCategory = async ({ name, iconKey = "Category" }) => {
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: name.trim(),
    iconKey: iconKey.trim() || "Category",
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateCategory = async (id, { name, iconKey }) => {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (iconKey !== undefined) updateData.iconKey = iconKey.trim();
  updateData.updatedAt = serverTimestamp();

  await updateDoc(docRef, updateData);
};

export const deleteCategory = async (id) => {
  const q = query(collection(db, PRODUCTS_COLLECTION), where("categoryId", "==", id));
  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error(`Cannot delete category: ${snap.size} products are currently assigned to it.`);
  }

  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(docRef);
};
