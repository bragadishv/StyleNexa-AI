const demoProducts = [
  {
    id: "SNX-001",
    name: "Oversized Noir Graphic Tee",
    category: "T-Shirts",
    collection: "Midnight Drop",
    price: 1499,
    originalPrice: 1999,
    discountPrice: 999,
    discountPercent: 50,
    color: "Black",
    colors: ["Black", "Washed Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    stock: 34,
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.7,
    reviews: 128,
    isFeatured: true,
    isNewDrop: true,
    tags: ["oversized", "streetwear", "graphic", "premium"],
    description:
      "A premium oversized black graphic tee designed for everyday streetwear styling with a relaxed silhouette and soft cotton finish.",
    aiStyleTip:
      "Pair this with relaxed cargo pants, chunky sneakers, and a silver chain for a clean black streetwear look.",
    aiCompleteLook: [
      "Cargo Utility Pants",
      "Chunky White Sneakers",
      "Minimal Silver Chain"
    ]
  },
  {
    id: "SNX-002",
    name: "Urban Cargo Utility Pants",
    category: "Bottoms",
    collection: "Utility Core",
    price: 2499,
    originalPrice: 3299,
    discountPrice: 1999,
    discountPercent: 39,
    color: "Olive",
    colors: ["Olive", "Black", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    stock: 21,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.6,
    reviews: 94,
    isFeatured: true,
    isNewDrop: true,
    tags: ["cargo", "utility", "streetwear", "relaxed-fit"],
    description:
      "Relaxed-fit cargo pants with a premium utility-inspired structure, built for comfort and everyday styling.",
    aiStyleTip:
      "Style with an oversized tee or cropped jacket for a balanced premium streetwear outfit.",
    aiCompleteLook: [
      "Oversized Noir Graphic Tee",
      "High Street Bomber Jacket",
      "Chunky White Sneakers"
    ]
  },
  {
    id: "SNX-003",
    name: "High Street Bomber Jacket",
    category: "Jackets",
    collection: "Night City Edit",
    price: 3999,
    originalPrice: 4999,
    discountPrice: 3299,
    discountPercent: 34,
    color: "Black",
    colors: ["Black", "Navy"],
    sizes: ["M", "L", "XL"],
    stock: 13,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8,
    reviews: 77,
    isFeatured: true,
    isNewDrop: true,
    tags: ["bomber", "jacket", "premium", "streetwear"],
    description:
      "A structured bomber jacket crafted for premium streetwear layering with a clean black finish.",
    aiStyleTip:
      "Wear over a white tee with black cargos for a sharp monochrome night-out outfit.",
    aiCompleteLook: [
      "Essential White Heavyweight Tee",
      "Urban Cargo Utility Pants",
      "Monochrome Runner Sneakers"
    ]
  },
  {
    id: "SNX-004",
    name: "Essential White Heavyweight Tee",
    category: "T-Shirts",
    collection: "Core Essentials",
    price: 1299,
    originalPrice: 1699,
    discountPrice: 899,
    discountPercent: 47,
    color: "White",
    colors: ["White", "Cream"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 48,
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.5,
    reviews: 181,
    isFeatured: true,
    isNewDrop: false,
    tags: ["basic", "white-tee", "premium-cotton", "minimal"],
    description:
      "A heavyweight white tee made for clean styling, daily wear, and premium layering.",
    aiStyleTip:
      "Use this as a base layer under a bomber, overshirt, or denim jacket for a timeless outfit.",
    aiCompleteLook: [
      "High Street Bomber Jacket",
      "Relaxed Denim Jeans",
      "Monochrome Runner Sneakers"
    ]
  },
  {
    id: "SNX-005",
    name: "Relaxed Denim Jeans",
    category: "Bottoms",
    collection: "Denim Reform",
    price: 2799,
    originalPrice: 3499,
    discountPrice: 2199,
    discountPercent: 37,
    color: "Washed Blue",
    colors: ["Washed Blue", "Black Wash"],
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.6,
    reviews: 112,
    isFeatured: false,
    isNewDrop: true,
    tags: ["denim", "relaxed-fit", "casual", "streetwear"],
    description:
      "Relaxed-fit denim jeans with a modern streetwear silhouette and soft washed finish.",
    aiStyleTip:
      "Pair with a heavyweight tee and sneakers for a clean casual streetwear look.",
    aiCompleteLook: [
      "Essential White Heavyweight Tee",
      "High Street Bomber Jacket",
      "Chunky White Sneakers"
    ]
  },
  {
    id: "SNX-006",
    name: "Monochrome Runner Sneakers",
    category: "Sneakers",
    collection: "Footwear Core",
    price: 3499,
    originalPrice: 4499,
    discountPrice: 2999,
    discountPercent: 33,
    color: "White / Black",
    colors: ["White / Black", "Triple Black"],
    sizes: ["7", "8", "9", "10", "11"],
    stock: 29,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8,
    reviews: 203,
    isFeatured: true,
    isNewDrop: false,
    tags: ["sneakers", "footwear", "monochrome", "streetwear"],
    description:
      "A versatile monochrome sneaker built to match oversized tees, cargos, denim, and jackets.",
    aiStyleTip:
      "Best paired with black cargos or washed denim for a premium everyday streetwear fit.",
    aiCompleteLook: [
      "Oversized Noir Graphic Tee",
      "Urban Cargo Utility Pants",
      "Crossbody Utility Bag"
    ]
  },
  {
    id: "SNX-007",
    name: "Crossbody Utility Bag",
    category: "Accessories",
    collection: "Utility Core",
    price: 1599,
    originalPrice: 2199,
    discountPrice: 1199,
    discountPercent: 45,
    color: "Black",
    colors: ["Black", "Olive"],
    sizes: ["One Size"],
    stock: 41,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.4,
    reviews: 63,
    isFeatured: false,
    isNewDrop: true,
    tags: ["bag", "utility", "accessory", "streetwear"],
    description:
      "A compact crossbody utility bag for daily essentials, styled for modern streetwear outfits.",
    aiStyleTip:
      "Add this to an oversized tee and cargo pants outfit to create a complete urban look.",
    aiCompleteLook: [
      "Oversized Noir Graphic Tee",
      "Urban Cargo Utility Pants",
      "Monochrome Runner Sneakers"
    ]
  },
  {
    id: "SNX-008",
    name: "Premium Washed Hoodie",
    category: "Hoodies",
    collection: "Comfort Drop",
    price: 2999,
    originalPrice: 3999,
    discountPrice: 2399,
    discountPercent: 40,
    color: "Washed Grey",
    colors: ["Washed Grey", "Black", "Cream"],
    sizes: ["S", "M", "L", "XL"],
    stock: 26,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.9,
    reviews: 156,
    isFeatured: true,
    isNewDrop: true,
    tags: ["hoodie", "washed", "comfort", "premium"],
    description:
      "A soft washed hoodie with a relaxed premium fit, designed for everyday comfort and elevated streetwear styling.",
    aiStyleTip:
      "Pair with relaxed denim or black joggers for a premium airport-style outfit.",
    aiCompleteLook: [
      "Relaxed Denim Jeans",
      "Monochrome Runner Sneakers",
      "Crossbody Utility Bag"
    ]
  },
  {
    id: "SNX-009",
    name: "Minimal Silver Chain",
    category: "Accessories",
    collection: "Finishing Pieces",
    price: 899,
    originalPrice: 1299,
    discountPrice: 699,
    discountPercent: 46,
    color: "Silver",
    colors: ["Silver"],
    sizes: ["One Size"],
    stock: 52,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.3,
    reviews: 44,
    isFeatured: false,
    isNewDrop: false,
    tags: ["chain", "accessory", "minimal", "silver"],
    description:
      "A minimal silver chain accessory that completes premium streetwear and casual outfits.",
    aiStyleTip:
      "Use this with black or white tees to add a clean premium detail without overstyling.",
    aiCompleteLook: [
      "Oversized Noir Graphic Tee",
      "Urban Cargo Utility Pants",
      "Monochrome Runner Sneakers"
    ]
  },
  {
    id: "SNX-010",
    name: "Oversized Flannel Overshirt",
    category: "Shirts",
    collection: "Layered Edit",
    price: 2299,
    originalPrice: 2999,
    discountPrice: 1799,
    discountPercent: 40,
    color: "Brown Check",
    colors: ["Brown Check", "Grey Check"],
    sizes: ["S", "M", "L", "XL"],
    stock: 17,
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.5,
    reviews: 69,
    isFeatured: false,
    isNewDrop: true,
    tags: ["flannel", "overshirt", "layering", "streetwear"],
    description:
      "An oversized flannel overshirt designed for layering over tees and hoodies.",
    aiStyleTip:
      "Layer this over a white tee with relaxed denim for a clean streetwear weekend outfit.",
    aiCompleteLook: [
      "Essential White Heavyweight Tee",
      "Relaxed Denim Jeans",
      "Monochrome Runner Sneakers"
    ]
  },
  {
    id: "SNX-011",
    name: "Black Relaxed Joggers",
    category: "Bottoms",
    collection: "Comfort Drop",
    price: 1999,
    originalPrice: 2699,
    discountPrice: 1499,
    discountPercent: 44,
    color: "Black",
    colors: ["Black", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    stock: 33,
    image:
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.4,
    reviews: 102,
    isFeatured: false,
    isNewDrop: false,
    tags: ["joggers", "black", "comfort", "streetwear"],
    description:
      "Relaxed black joggers made for comfort-first styling with a modern streetwear fit.",
    aiStyleTip:
      "Pair with the washed hoodie and monochrome sneakers for a premium casual look.",
    aiCompleteLook: [
      "Premium Washed Hoodie",
      "Monochrome Runner Sneakers",
      "Crossbody Utility Bag"
    ]
  },
  {
    id: "SNX-012",
    name: "Statement Graphic Hoodie",
    category: "Hoodies",
    collection: "Midnight Drop",
    price: 3299,
    originalPrice: 4299,
    discountPrice: 2699,
    discountPercent: 37,
    color: "Black",
    colors: ["Black", "Washed Charcoal"],
    sizes: ["M", "L", "XL"],
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8,
    reviews: 88,
    isFeatured: true,
    isNewDrop: true,
    tags: ["hoodie", "graphic", "streetwear", "drop"],
    description:
      "A bold statement hoodie for premium streetwear drops, built with a relaxed fit and graphic-led design language.",
    aiStyleTip:
      "Style this with black joggers and statement sneakers for a full monochrome streetwear outfit.",
    aiCompleteLook: [
      "Black Relaxed Joggers",
      "Monochrome Runner Sneakers",
      "Minimal Silver Chain"
    ]
  }
];

module.exports = demoProducts;