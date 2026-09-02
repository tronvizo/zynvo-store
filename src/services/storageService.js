import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const uploadProductImage = async (file) => {
  if (!file) {
    throw new Error("No file selected.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size exceeds 5 MB limit.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storageRef = ref(storage, `products/${Date.now()}_${cleanFileName}`);
  
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type
  });
  
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};
