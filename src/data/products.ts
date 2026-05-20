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

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "exhaust-titan-01",
    name: "Titan-X Titanium Exhaust",
    description: "Ultra-lightweight aerospace-grade titanium exhaust system. Increases power by 12% and reduces weight by 4kg. Features a deep, resonant futuristic tone.",
    price: 1299.99,
    discountPrice: 1150.00,
    category: "Exhaust systems",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Material": "Grade 5 Titanium",
      "Weight": "4.2 kg",
      "Power Gain": "+12.5 hp",
      "Sound Level": "98 dB"
    },
    compatibleModels: ["Yamaha R1", "Kawasaki ZX-10R", "BMW S1000RR"],
    tags: ["performance", "titanium", "racing"],
    rating: 4.8,
    reviewCount: 24,
    isFeatured: true
  },
  {
    id: "led-neon-matrix",
    name: "Matrix-LED Underglow Kit",
    description: "Fully programmable RGBW matrix LED lighting system with smartphone integration. 16 million colors with sync-to-sound technology.",
    price: 199.99,
    category: "LED lights",
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Control": "App Enabled",
      "Voltage": "12V DC",
      "Protection": "IP68 Waterproof",
      "Compatibility": "Universal"
    },
    compatibleModels: ["Universal"],
    tags: ["lighting", "rgb", "smart"],
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: "carbon-fairing-s1",
    name: "Aero-Carbon Fairing Kit",
    description: "Dry carbon fiber fairing set with wind-tunnel tested aerodynamics. Reduces drag by 8% and adds a stealth futuristic aesthetic.",
    price: 2450.00,
    category: "Fairings",
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1449495169669-7b118f960237?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Material": "3K Dry Carbon Fiber",
      "Finish": "Matte UV Resistant",
      "Weight": "3.5 kg total",
      "Aerodynamics": "+15% Downforce"
    },
    compatibleModels: ["Ducati Panigale V4", "BMW S1000RR"],
    tags: ["carbon fiber", "aerodynamics", "luxury"],
    rating: 4.9,
    reviewCount: 12,
    isFeatured: true
  },
  {
    id: "mag-wheel-forge",
    name: "Forged Magnesium Alloy Wheels",
    description: "The ultimate in unsprung weight reduction. Forged magnesium wheels designed for maximum rigidity and lightning-fast direction changes.",
    price: 3200.00,
    category: "Alloy wheels",
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Process": "Multi-stage Forging",
      "Weight": "5.5 kg (set)",
      "Strength": "JWL Certified",
      "Sizes": "17 inch"
    },
    compatibleModels: ["Track Bikes Only"],
    tags: ["wheels", "magnesium", "track"],
    rating: 4.7,
    reviewCount: 8
  },
  {
    id: "brembo-stylema-r",
    name: "Stylema R Brake Kit",
    description: "Professional racing brake calipers with high-performance pads and braided steel lines. Unmatched stopping power and thermal management.",
    price: 899.99,
    category: "Brake kits",
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Material": "Monoblock Aluminum",
      "Pistons": "4 per caliper",
      "Lines": "Stainless Braided",
      "Pads": "Sintered Compound"
    },
    compatibleModels: ["Universal with adaptors"],
    tags: ["safety", "brakes", "performance"],
    rating: 4.9,
    reviewCount: 45
  }
];

export const CATEGORIES = [
  "Exhaust systems",
  "LED lights",
  "Fairings",
  "Alloy wheels",
  "Brake kits",
  "Handlebars",
  "Mirrors",
  "Performance kits",
  "Racing accessories",
  "Seat modifications",
  "Engine accessories"
];
