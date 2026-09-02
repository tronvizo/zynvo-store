import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBW95aReTlXIz4r34vFhEAFeyCDKMae4wc",
  authDomain: "zynvo-1.firebaseapp.com",
  projectId: "zynvo-1",
  storageBucket: "zynvo-1.firebasestorage.app",
  messagingSenderId: "1074997502273",
  appId: "1:1074997502273:web:d8b4e5bc75a4b648fc41c0",
  measurementId: "G-3NWN12WHC2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEMO_CATEGORIES = [
  { name: "Audio & Acoustics", iconKey: "Headphones" },
  { name: "Wearables & Watches", iconKey: "Watch" },
  { name: "Desk & Computing", iconKey: "Laptop" },
  { name: "Photography & Gear", iconKey: "CameraAlt" },
  { name: "Gaming Gear", iconKey: "SportsEsports" },
  { name: "Smart Home & Lights", iconKey: "Lightbulb" }
];

const DEMO_PRODUCTS = [
  {
    title: "Z-1 Pro Wireless Noise-Cancelling Headphones",
    categoryName: "Audio & Acoustics",
    price: 279.99,
    rating: 4.8,
    isPopular: true,
    description: "Premium high-fidelity audio with spatial audio tracking, custom 40mm beryllium drivers, and 45 hours of ultra-long battery life with rapid USB-C charging.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B08HMWZBXC?tag=zynvostore-20"
  },
  {
    title: "Aura Horizon Minimalist Smartwatch Series 4",
    categoryName: "Wearables & Watches",
    price: 199.50,
    rating: 4.7,
    isPopular: true,
    description: "Ultra-thin aerospace titanium casing, vibrant AMOLED always-on display, continuous SpO2 and ECG cardiac monitoring, water-resistant up to 50 meters.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B09V3K3K9J?tag=zynvostore-20"
  },
  {
    title: "Apex Stealth Wireless Mechanical Keyboard",
    categoryName: "Desk & Computing",
    price: 149.00,
    rating: 4.9,
    isPopular: true,
    description: "CNC aluminum chassis, hot-swappable tactile silent switches, multi-device Bluetooth 5.2 connectivity with seamless Mac & Windows layout switching.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B0987XYZ45?tag=zynvostore-20"
  },
  {
    title: "Lumix Nova 4K Mirrorless Cinema Camera",
    categoryName: "Photography & Gear",
    price: 899.00,
    rating: 4.9,
    isPopular: true,
    description: "Professional full-frame cinematic sensor delivering crisp 4K 120fps video, ultra-fast real-time eye autofocus, and dual native ISO architecture.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B08P1X23K9?tag=zynvostore-20"
  },
  {
    title: "Vortex Rift Haptic Ergonomic Gaming Mouse",
    categoryName: "Gaming Gear",
    price: 79.99,
    rating: 4.6,
    isPopular: false,
    description: "Sub-58 gram ultra-lightweight design, optical switches rated for 90 million clicks, flawless 30K DPI optical sensor, and PTFE zero-friction feet.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B08HR7N7Q9?tag=zynvostore-20"
  },
  {
    title: "Helios Minimalist Biometric Desk Lamp",
    categoryName: "Smart Home & Lights",
    price: 89.00,
    rating: 4.5,
    isPopular: false,
    description: "Circadian rhythm auto-tuning LED task lamp with ambient light sensors, dual wireless Qi charging dock base, and touch-slider brightness control.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B07N9G7843?tag=zynvostore-20"
  },
  {
    title: "Studio One Studio Reference Active Monitors",
    categoryName: "Audio & Acoustics",
    price: 349.00,
    rating: 4.7,
    isPopular: false,
    description: "Bi-amplified studio nearfield speakers with woven composite woofers and silk-dome tweeters, delivering neutral uncolored sound for music producers.",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B01F2V1N8Z?tag=zynvostore-20"
  },
  {
    title: "Nomad Tactical All-Weather Camera Backpack",
    categoryName: "Photography & Gear",
    price: 189.00,
    rating: 4.8,
    isPopular: true,
    description: "Weatherproof Cordura fabric with modular customizable dividers, dedicated 16-inch laptop compartment, and rapid side-access camera hatch.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B0874G7911?tag=zynvostore-20"
  },
  {
    title: "Nova Horizon Curved 34-inch Ultrawide Monitor",
    categoryName: "Desk & Computing",
    price: 499.00,
    rating: 4.8,
    isPopular: true,
    description: "WQHD 3440x1440 resolution with 165Hz refresh rate, 1ms response time, 99% sRGB color gamut, and 90W USB-C single cable laptop dock.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B09JQK3981?tag=zynvostore-20"
  },
  {
    title: "Pulse One Precision Heart Rate Chest Strap",
    categoryName: "Wearables & Watches",
    price: 64.99,
    rating: 4.4,
    isPopular: false,
    description: "Medical-grade electrocardiogram sensor compatible with Garmin, Apple Watch, Zwift, and major fitness apps via ANT+ and Bluetooth 5.0.",
    imageUrl: "https://images.unsplash.com/photo-1510519138161-58474ebf828e?auto=format&fit=crop&w=800&q=80",
    affiliateLink: "https://www.amazon.com/dp/B07P4L8Y1Z?tag=zynvostore-20"
  }
];

async function seed() {
  const email = process.env.ADMIN_EMAIL || "rahult64847@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "rahul@74846";

  console.log(`Authenticating as ${email}...`);
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Authentication successful! Seeding Firestore catalog...");

  const catRef = collection(db, "categories");
  const prodRef = collection(db, "products");

  const catMap = {};
  for (const cat of DEMO_CATEGORIES) {
    const docSnap = await addDoc(catRef, {
      name: cat.name,
      iconKey: cat.iconKey,
      createdAt: serverTimestamp()
    });
    console.log(`Created category: ${cat.name} (${docSnap.id})`);
    catMap[cat.name] = docSnap.id;
  }

  for (const prod of DEMO_PRODUCTS) {
    const docSnap = await addDoc(prodRef, {
      title: prod.title,
      description: prod.description,
      price: prod.price,
      rating: prod.rating,
      categoryId: catMap[prod.categoryName],
      imageUrl: prod.imageUrl,
      affiliateLink: prod.affiliateLink,
      isPopular: prod.isPopular,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`Created product: ${prod.title} (${docSnap.id})`);
  }

  console.log("Seeding finished successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
