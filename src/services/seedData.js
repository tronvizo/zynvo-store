import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const DEMO_CATEGORIES = [
  { id: "cat-audio", name: "Audio & Acoustics", iconKey: "Headphones" },
  { id: "cat-wearables", name: "Wearables & Watches", iconKey: "Watch" },
  { id: "cat-computing", name: "Desk & Computing", iconKey: "Laptop" },
  { id: "cat-photo", name: "Photography & Gear", iconKey: "CameraAlt" },
  { id: "cat-gaming", name: "Gaming Gear", iconKey: "SportsEsports" },
  { id: "cat-smarthome", name: "Smart Home & Lights", iconKey: "Lightbulb" }
];

export const DEMO_PRODUCTS = [
  {
    id: "prod-1",
    title: "Z-1 Pro Wireless Noise-Cancelling Headphones",
    categoryId: "cat-audio",
    categoryName: "Audio & Acoustics",
    price: 279.99,
    rating: 4.8,
    isPopular: true,
    description: "Premium high-fidelity audio with spatial audio tracking, custom 40mm beryllium drivers, and 45 hours of ultra-long battery life with rapid USB-C charging.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B08HMWZBXC?tag=zynvostore-20",
    createdAt: new Date("2026-08-15")
  },
  {
    id: "prod-2",
    title: "Aura Horizon Minimalist Smartwatch Series 4",
    categoryId: "cat-wearables",
    categoryName: "Wearables & Watches",
    price: 199.50,
    rating: 4.7,
    isPopular: true,
    description: "Ultra-thin aerospace titanium casing, vibrant AMOLED always-on display, continuous SpO2 and ECG cardiac monitoring, water-resistant up to 50 meters.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B09V3K3K9J?tag=zynvostore-20",
    createdAt: new Date("2026-08-20")
  },
  {
    id: "prod-3",
    title: "Apex Stealth Wireless Mechanical Keyboard",
    categoryId: "cat-computing",
    categoryName: "Desk & Computing",
    price: 149.00,
    rating: 4.9,
    isPopular: true,
    description: "CNC aluminum chassis, hot-swappable tactile silent switches, multi-device Bluetooth 5.2 connectivity with seamless Mac & Windows layout switching.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B0987XYZ45?tag=zynvostore-20",
    createdAt: new Date("2026-08-25")
  },
  {
    id: "prod-4",
    title: "Lumix Nova 4K Mirrorless Cinema Camera",
    categoryId: "cat-photo",
    categoryName: "Photography & Gear",
    price: 899.00,
    rating: 4.9,
    isPopular: true,
    description: "Professional full-frame cinematic sensor delivering crisp 4K 120fps video, ultra-fast real-time eye autofocus, and dual native ISO architecture.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B08P1X23K9?tag=zynvostore-20",
    createdAt: new Date("2026-08-28")
  },
  {
    id: "prod-5",
    title: "Vortex Rift Haptic Ergonomic Gaming Mouse",
    categoryId: "cat-gaming",
    categoryName: "Gaming Gear",
    price: 79.99,
    rating: 4.6,
    isPopular: false,
    description: "Sub-58 gram ultra-lightweight design, optical switches rated for 90 million clicks, flawless 30K DPI optical sensor, and PTFE zero-friction feet.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B08HR7N7Q9?tag=zynvostore-20",
    createdAt: new Date("2026-08-10")
  },
  {
    id: "prod-6",
    title: "Helios Minimalist Biometric Desk Lamp",
    categoryId: "cat-smarthome",
    categoryName: "Smart Home & Lights",
    price: 89.00,
    rating: 4.5,
    isPopular: false,
    description: "Circadian rhythm auto-tuning LED task lamp with ambient light sensors, dual wireless Qi charging dock base, and touch-slider brightness control.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B07N9G7843?tag=zynvostore-20",
    createdAt: new Date("2026-08-12")
  },
  {
    id: "prod-7",
    title: "Studio One Studio Reference Active Monitors",
    categoryId: "cat-audio",
    categoryName: "Audio & Acoustics",
    price: 349.00,
    rating: 4.7,
    isPopular: false,
    description: "Bi-amplified studio nearfield speakers with woven composite woofers and silk-dome tweeters, delivering neutral uncolored sound for music producers.",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B01F2V1N8Z?tag=zynvostore-20",
    createdAt: new Date("2026-08-18")
  },
  {
    id: "prod-8",
    title: "Nomad Tactical All-Weather Camera Backpack",
    categoryId: "cat-photo",
    categoryName: "Photography & Gear",
    price: 189.00,
    rating: 4.8,
    isPopular: true,
    description: "Weatherproof Cordura fabric with modular customizable dividers, dedicated 16-inch laptop compartment, and rapid side-access camera hatch.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B0874G7911?tag=zynvostore-20",
    createdAt: new Date("2026-08-22")
  },
  {
    id: "prod-9",
    title: "Nova Horizon Curved 34-inch Ultrawide Monitor",
    categoryId: "cat-computing",
    categoryName: "Desk & Computing",
    price: 499.00,
    rating: 4.8,
    isPopular: true,
    description: "WQHD 3440x1440 resolution with 165Hz refresh rate, 1ms response time, 99% sRGB color gamut, and 90W USB-C single cable laptop dock.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B09JQK3981?tag=zynvostore-20",
    createdAt: new Date("2026-08-26")
  },
  {
    id: "prod-10",
    title: "Pulse One Precision Heart Rate Chest Strap",
    categoryId: "cat-wearables",
    categoryName: "Wearables & Watches",
    price: 64.99,
    rating: 4.4,
    isPopular: false,
    description: "Medical-grade electrocardiogram sensor compatible with Garmin, Apple Watch, Zwift, and major fitness apps via ANT+ and Bluetooth 5.0.",
    imageUrl: "https://images.unsplash.com/photo-1510519138161-58474ebf828e?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B07P4L8Y1Z?tag=zynvostore-20",
    createdAt: new Date("2026-08-14")
  }
];

export const seedInitialData = async (onProgress = () => {}) => {
  const categoriesCol = collection(db, "categories");
  const productsCol = collection(db, "products");

  onProgress("Checking existing catalog...");
  const catSnap = await getDocs(categoriesCol);
  
  const categoryMap = {};

  if (catSnap.empty) {
    onProgress("Creating categories in Firestore...");
    for (const cat of DEMO_CATEGORIES) {
      const docRef = await addDoc(categoriesCol, {
        name: cat.name,
        iconKey: cat.iconKey,
        createdAt: serverTimestamp()
      });
      categoryMap[cat.id] = docRef.id;
      categoryMap[cat.name] = docRef.id;
    }
  } else {
    catSnap.docs.forEach(d => {
      categoryMap[d.data().name] = d.id;
    });
  }

  onProgress("Checking existing products...");
  const prodSnap = await getDocs(productsCol);
  if (prodSnap.empty) {
    onProgress("Creating demo products in Firestore...");
    for (const prod of DEMO_PRODUCTS) {
      const catId = categoryMap[prod.categoryId] || categoryMap[prod.categoryName] || Object.values(categoryMap)[0];
      await addDoc(productsCol, {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        rating: prod.rating,
        categoryId: catId,
        imageUrl: prod.imageUrl,
        affiliateLink: prod.affiliateLink,
        isPopular: prod.isPopular,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  onProgress("Seed completed successfully!");
  return true;
};
