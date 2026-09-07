import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const DEMO_CATEGORIES = [
  // User explicitly requested & high-demand affiliate categories:
  { id: "cat-beauty-facewash", name: "Beauty, Skincare & Facewash", iconKey: "Spa" },
  { id: "cat-hair-grooming", name: "Hair Care & Grooming", iconKey: "Spa" },
  { id: "cat-medical", name: "Health, Medical & Wellness", iconKey: "LocalPharmacy" },
  { id: "cat-sarees-ethnic", name: "Sarees & Ethnic Wear", iconKey: "Checkroom" },
  { id: "cat-womens-fashion", name: "Women's Fashion & Handbags", iconKey: "ShoppingBag" },
  { id: "cat-mens-fashion", name: "Men's Fashion & Footwear", iconKey: "Checkroom" },
  { id: "cat-baby-kids", name: "Kids, Baby Care & Toys", iconKey: "ChildFriendly" },

  // Electronics & Gadgets:
  { id: "cat-mobiles", name: "Mobiles & Tablets", iconKey: "Smartphone" },
  { id: "cat-mobile-acc", name: "Mobile Accessories & Cases", iconKey: "Devices" },
  { id: "cat-chargers", name: "Chargers, Cables & Power Banks", iconKey: "Power" },
  { id: "cat-audio", name: "Earbuds & Headphones", iconKey: "Headphones" },
  { id: "cat-speakers", name: "Bluetooth Speakers & Soundbars", iconKey: "Speaker" },
  { id: "cat-wearables", name: "Smartwatches & Bands", iconKey: "Watch" },
  { id: "cat-laptops", name: "Laptops & Computers", iconKey: "Laptop" },
  { id: "cat-keyboards-mouse", name: "Mouse & Keyboards", iconKey: "Mouse" },
  { id: "cat-storage", name: "Pen Drives & Storage", iconKey: "Storage" },
  { id: "cat-gaming", name: "Gaming Gear & Consoles", iconKey: "SportsEsports" },
  { id: "cat-photo", name: "Cameras & Vlogging", iconKey: "CameraAlt" },
  { id: "cat-smarthome", name: "Smart Home & Lights", iconKey: "Lightbulb" },

  // Home, Living & Essentials:
  { id: "cat-appliances", name: "Home & Kitchen Appliances", iconKey: "Kitchen" },
  { id: "cat-homedecor", name: "Home Decor & Furnishing", iconKey: "Home" },
  { id: "cat-fitness", name: "Fitness, Gym & Sports", iconKey: "FitnessCenter" },
  { id: "cat-auto", name: "Car & Bike Accessories", iconKey: "DirectionsCar" },
  { id: "cat-books", name: "Books & Stationery", iconKey: "MenuBook" },
  { id: "cat-tv", name: "TV & Entertainment", iconKey: "Tv" },
  { id: "cat-grocery", name: "Grocery & Daily Essentials", iconKey: "ShoppingBag" },
  { id: "cat-other", name: "Other & Miscellaneous", iconKey: "MoreHoriz" }
];

export const DEMO_PRODUCTS = [
  {
    id: "prod-1",
    title: "Z-1 Pro Wireless Noise-Cancelling Headphones",
    categoryId: "cat-audio",
    categoryName: "Earbuds & Headphones",
    price: 14999,
    rating: 4.8,
    reviewsCount: "248 reviews",
    isNewArrival: true,
    isPopular: false,
    isTrending: false,
    description: "Premium high-fidelity audio with spatial audio tracking, custom 40mm beryllium drivers, and 45 hours of ultra-long battery life with rapid USB-C charging.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B08HMWZBXC?tag=zynvostore-21",
    createdAt: new Date("2026-08-15")
  },
  {
    id: "prod-2",
    title: "Aura Horizon Minimalist Smartwatch Series 4",
    categoryId: "cat-wearables",
    categoryName: "Smartwatches & Bands",
    price: 8499,
    rating: 4.7,
    reviewsCount: "189 reviews",
    isNewArrival: true,
    isPopular: false,
    isTrending: false,
    description: "Ultra-thin aerospace titanium casing, vibrant AMOLED always-on display, continuous SpO2 and ECG cardiac monitoring, water-resistant up to 50 meters.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B09V3K3K9J?tag=zynvostore-21",
    createdAt: new Date("2026-08-20")
  },
  {
    id: "prod-3",
    title: "Apex Stealth Wireless Mechanical Keyboard",
    categoryId: "cat-keyboards-mouse",
    categoryName: "Mouse & Keyboards",
    price: 6999,
    rating: 4.9,
    reviewsCount: "312 reviews",
    isNewArrival: true,
    isPopular: false,
    isTrending: false,
    description: "CNC aluminum chassis, hot-swappable tactile silent switches, multi-device Bluetooth 5.2 connectivity with seamless Mac & Windows layout switching.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B0987XYZ45?tag=zynvostore-21",
    createdAt: new Date("2026-08-25")
  },
  {
    id: "prod-4",
    title: "Lumix Nova 4K Mirrorless Cinema Camera",
    categoryId: "cat-photo",
    categoryName: "Cameras & Vlogging",
    price: 64999,
    rating: 4.9,
    reviewsCount: "94 reviews",
    isNewArrival: false,
    isPopular: true,
    isTrending: false,
    description: "Professional full-frame cinematic sensor delivering crisp 4K 120fps video, ultra-fast real-time eye autofocus, and dual native ISO architecture.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B08P1X23K9?tag=zynvostore-21",
    createdAt: new Date("2026-08-28")
  },
  {
    id: "prod-5",
    title: "Vortex Rift Haptic Ergonomic Gaming Mouse",
    categoryId: "cat-gaming",
    categoryName: "Gaming Gear & Consoles",
    price: 2999,
    rating: 4.6,
    reviewsCount: "420 reviews",
    isNewArrival: false,
    isPopular: true,
    isTrending: false,
    description: "Sub-58 gram ultra-lightweight design, optical switches rated for 90 million clicks, flawless 30K DPI optical sensor, and PTFE zero-friction feet.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B08HR7N7Q9?tag=zynvostore-21",
    createdAt: new Date("2026-08-10")
  },
  {
    id: "prod-6",
    title: "Helios Minimalist Biometric Desk Lamp",
    categoryId: "cat-smarthome",
    categoryName: "Smart Home & Lights",
    price: 2499,
    rating: 4.5,
    reviewsCount: "76 reviews",
    isNewArrival: false,
    isPopular: false,
    isTrending: true,
    description: "Circadian rhythm auto-tuning LED task lamp with ambient light sensors, dual wireless Qi charging dock base, and touch-slider brightness control.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B07N9G7843?tag=zynvostore-21",
    createdAt: new Date("2026-08-12")
  },
  {
    id: "prod-7",
    title: "Studio One Studio Reference Active Monitors",
    categoryId: "cat-speakers",
    categoryName: "Bluetooth Speakers",
    price: 18999,
    rating: 4.7,
    reviewsCount: "135 reviews",
    isNewArrival: false,
    isPopular: false,
    isTrending: true,
    description: "Bi-amplified studio nearfield speakers with woven composite woofers and silk-dome tweeters, delivering neutral uncolored sound for music producers.",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B01F2V1N8Z?tag=zynvostore-21",
    createdAt: new Date("2026-08-18")
  },
  {
    id: "prod-8",
    title: "Nomad Tactical All-Weather Camera Backpack",
    categoryId: "cat-photo",
    categoryName: "Cameras & Vlogging",
    price: 4999,
    rating: 4.8,
    reviewsCount: "512 reviews",
    isNewArrival: false,
    isPopular: true,
    isTrending: false,
    description: "Weatherproof Cordura fabric with modular customizable dividers, dedicated 16-inch laptop compartment, and rapid side-access camera hatch.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B0874G7911?tag=zynvostore-21",
    createdAt: new Date("2026-08-22")
  },
  {
    id: "prod-9",
    title: "Nova Horizon Curved 34-inch Ultrawide Monitor",
    categoryId: "cat-laptops",
    categoryName: "Laptops & Computers",
    price: 28999,
    rating: 4.8,
    reviewsCount: "220 reviews",
    isNewArrival: false,
    isPopular: false,
    isTrending: true,
    description: "WQHD 3440x1440 resolution with 165Hz refresh rate, 1ms response time, 99% sRGB color gamut, and 90W USB-C single cable laptop dock.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B09JQK3981?tag=zynvostore-21",
    createdAt: new Date("2026-08-26")
  },
  {
    id: "prod-10",
    title: "Pulse One Precision Heart Rate Chest Strap",
    categoryId: "cat-wearables",
    categoryName: "Smartwatches & Bands",
    price: 3499,
    rating: 4.4,
    reviewsCount: "68 reviews",
    isNewArrival: false,
    isPopular: false,
    isTrending: true,
    description: "Medical-grade electrocardiogram sensor compatible with Garmin, Apple Watch, Zwift, and major fitness apps via ANT+ and Bluetooth 5.0.",
    imageUrl: "https://images.unsplash.com/photo-1510519138161-58474ebf828e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1510519138161-58474ebf828e?auto=format&fit=crop&w=800&q=80"
    ],
    affiliateLink: "https://www.amazon.in/dp/B07P4L8Y1Z?tag=zynvostore-21",
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
        reviewsCount: prod.reviewsCount || '',
        categoryId: catId,
        imageUrl: prod.imageUrl,
        images: prod.images || [prod.imageUrl],
        affiliateLink: prod.affiliateLink,
        isNewArrival: Boolean(prod.isNewArrival),
        isPopular: Boolean(prod.isPopular),
        isTrending: Boolean(prod.isTrending),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  onProgress("Seed completed successfully!");
  return true;
};
