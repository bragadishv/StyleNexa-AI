import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://stylenexa-ai.onrender.com"
    : "http://localhost:5000");

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
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    reviews: 128,
    isFeatured: true,
    isNewDrop: true,
    tags: ["oversized", "streetwear", "graphic", "premium"],
    description: "A premium oversized black graphic tee designed for everyday streetwear styling with a relaxed silhouette and soft cotton finish.",
    aiStyleTip: "Pair this with relaxed cargo pants, chunky sneakers, and a silver chain for a clean black streetwear look.",
    aiCompleteLook: ["Urban Cargo Utility Pants", "Monochrome Runner Sneakers", "Minimal Silver Chain"],
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
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    reviews: 94,
    isFeatured: true,
    isNewDrop: true,
    tags: ["cargo", "utility", "streetwear", "relaxed-fit"],
    description: "Relaxed-fit cargo pants with a premium utility-inspired structure, built for comfort and everyday styling.",
    aiStyleTip: "Style with an oversized tee or cropped jacket for a balanced premium streetwear outfit.",
    aiCompleteLook: ["Oversized Noir Graphic Tee", "High Street Bomber Jacket", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviews: 77,
    isFeatured: true,
    isNewDrop: true,
    tags: ["bomber", "jacket", "premium", "streetwear"],
    description: "A structured bomber jacket crafted for premium streetwear layering with a clean black finish.",
    aiStyleTip: "Wear over a white tee with black cargos for a sharp monochrome night-out outfit.",
    aiCompleteLook: ["Essential White Heavyweight Tee", "Urban Cargo Utility Pants", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    reviews: 181,
    isFeatured: true,
    isNewDrop: false,
    tags: ["basic", "white-tee", "premium-cotton", "minimal"],
    description: "A heavyweight white tee made for clean styling, daily wear, and premium layering.",
    aiStyleTip: "Use this as a base layer under a bomber, overshirt, or denim jacket for a timeless outfit.",
    aiCompleteLook: ["High Street Bomber Jacket", "Relaxed Denim Jeans", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    reviews: 112,
    isFeatured: false,
    isNewDrop: true,
    tags: ["denim", "relaxed-fit", "casual", "streetwear"],
    description: "Relaxed-fit denim jeans with a modern streetwear silhouette and soft washed finish.",
    aiStyleTip: "Pair with a heavyweight tee and sneakers for a clean casual streetwear look.",
    aiCompleteLook: ["Essential White Heavyweight Tee", "High Street Bomber Jacket", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviews: 203,
    isFeatured: true,
    isNewDrop: false,
    tags: ["sneakers", "footwear", "monochrome", "streetwear"],
    description: "A versatile monochrome sneaker built to match oversized tees, cargos, denim, and jackets.",
    aiStyleTip: "Best paired with black cargos or washed denim for a premium everyday streetwear fit.",
    aiCompleteLook: ["Oversized Noir Graphic Tee", "Urban Cargo Utility Pants", "Crossbody Utility Bag"],
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
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    reviews: 63,
    isFeatured: false,
    isNewDrop: true,
    tags: ["bag", "utility", "accessory", "streetwear"],
    description: "A compact crossbody utility bag for daily essentials, styled for modern streetwear outfits.",
    aiStyleTip: "Add this to an oversized tee and cargo pants outfit to create a complete urban look.",
    aiCompleteLook: ["Oversized Noir Graphic Tee", "Urban Cargo Utility Pants", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviews: 156,
    isFeatured: true,
    isNewDrop: true,
    tags: ["hoodie", "washed", "comfort", "premium"],
    description: "A soft washed hoodie with a relaxed premium fit, designed for everyday comfort and elevated streetwear styling.",
    aiStyleTip: "Pair with relaxed denim or black joggers for a premium airport-style outfit.",
    aiCompleteLook: ["Relaxed Denim Jeans", "Monochrome Runner Sneakers", "Crossbody Utility Bag"],
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
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    rating: 4.3,
    reviews: 44,
    isFeatured: false,
    isNewDrop: false,
    tags: ["chain", "accessory", "minimal", "silver"],
    description: "A minimal silver chain accessory that completes premium streetwear and casual outfits.",
    aiStyleTip: "Use this with black or white tees to add a clean premium detail without overstyling.",
    aiCompleteLook: ["Oversized Noir Graphic Tee", "Urban Cargo Utility Pants", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    reviews: 69,
    isFeatured: false,
    isNewDrop: true,
    tags: ["flannel", "overshirt", "layering", "streetwear"],
    description: "An oversized flannel overshirt designed for layering over tees and hoodies.",
    aiStyleTip: "Layer this over a white tee with relaxed denim for a clean streetwear weekend outfit.",
    aiCompleteLook: ["Essential White Heavyweight Tee", "Relaxed Denim Jeans", "Monochrome Runner Sneakers"],
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
    image: "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    reviews: 102,
    isFeatured: false,
    isNewDrop: false,
    tags: ["joggers", "black", "comfort", "streetwear"],
    description: "Relaxed black joggers made for comfort-first styling with a modern streetwear fit.",
    aiStyleTip: "Pair with the washed hoodie and monochrome sneakers for a premium casual look.",
    aiCompleteLook: ["Premium Washed Hoodie", "Monochrome Runner Sneakers", "Crossbody Utility Bag"],
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
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviews: 88,
    isFeatured: true,
    isNewDrop: true,
    tags: ["hoodie", "graphic", "streetwear", "drop"],
    description: "A bold statement hoodie for premium streetwear drops, built with a relaxed fit and graphic-led design language.",
    aiStyleTip: "Style this with black joggers and statement sneakers for a full monochrome streetwear outfit.",
    aiCompleteLook: ["Black Relaxed Joggers", "Monochrome Runner Sneakers", "Minimal Silver Chain"],
  },
];

const emptyProductForm = {
  name: "",
  category: "T-Shirts",
  price: "",
  oldPrice: "",
  color: "Black",
  sizes: "S,M,L,XL",
  stock: "",
  tag: "New Product",
  description: "",
  image: "",
};

const emptyTrackingForm = {
  orderId: "",
  email: "demo.customer@turtlemod.store",
};

const emptyReturnForm = {
  orderId: "",
  customerName: "Demo Customer",
  email: "demo.customer@turtlemod.store",
  productName: "",
  size: "",
  requestType: "Exchange",
  reason: "",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function getProductId(product) {
  return product._id || product.id || product.name;
}

function getProductMergeKey(product) {
  if (product.name) return String(product.name).trim().toLowerCase();
  return String(getProductId(product)).trim().toLowerCase();
}

function getProductImage(product) {
  if (product.image) return product.image;
  if (product.imageUrl) return product.imageUrl;

  if (Array.isArray(product.images) && product.images.length > 0) {
    if (typeof product.images[0] === "string") return product.images[0];
    return product.images[0]?.url;
  }

  return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80";
}

function getSellingPrice(product) {
  return Number(product.discountPrice || product.salePrice || product.price || 0);
}

function getOriginalPrice(product) {
  return Number(product.originalPrice || product.oldPrice || product.mrp || product.price || 0);
}

function getCategories(products) {
  return ["All", ...new Set(products.map((item) => item.category || "Streetwear"))];
}

function normalizeProducts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  return [];
}

function mergeBackendWithDemoProducts(backendProducts) {
  const productMap = new Map();

  demoProducts.forEach((product) => {
    productMap.set(getProductMergeKey(product), product);
  });

  backendProducts.forEach((product) => {
    const key = getProductMergeKey(product);
    const existingDemoProduct = productMap.get(key) || {};

    productMap.set(key, {
      ...existingDemoProduct,
      ...product,
      originalPrice: product.originalPrice || product.oldPrice || existingDemoProduct.originalPrice,
      discountPrice: product.discountPrice || product.salePrice || product.price || existingDemoProduct.discountPrice,
      image: product.image || product.imageUrl || existingDemoProduct.image || existingDemoProduct.imageUrl,
      images: product.images || existingDemoProduct.images,
      colors: product.colors || existingDemoProduct.colors,
      sizes: product.sizes || existingDemoProduct.sizes,
      tags: product.tags || existingDemoProduct.tags,
      aiStyleTip: product.aiStyleTip || existingDemoProduct.aiStyleTip,
      aiCompleteLook: product.aiCompleteLook || existingDemoProduct.aiCompleteLook,
      description: product.description || existingDemoProduct.description,
      collection: product.collection || existingDemoProduct.collection,
      rating: product.rating || existingDemoProduct.rating,
      reviews: product.reviews || existingDemoProduct.reviews,
      isFeatured: typeof product.isFeatured === "boolean" ? product.isFeatured : existingDemoProduct.isFeatured,
      isNewDrop: typeof product.isNewDrop === "boolean" ? product.isNewDrop : existingDemoProduct.isNewDrop,
    });
  });

  return Array.from(productMap.values());
}

function SectionPanel({ children, style = {} }) {
  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        background: "#0b0b0b",
        padding: "24px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export default function App() {
  const [products, setProducts] = useState(demoProducts);
  const [backendProducts, setBackendProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState(
    "Tell me your occasion, preferred color, and vibe. Example: black streetwear outfit for college."
  );

  const [trackingForm, setTrackingForm] = useState(emptyTrackingForm);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const [returnForm, setReturnForm] = useState(emptyReturnForm);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const [adminToken, setAdminToken] = useState(localStorage.getItem("turtle_mod_admin_token") || "");
  const [adminLogin, setAdminLogin] = useState({ username: "admin", password: "admin123" });
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSummary, setAdminSummary] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminReturns, setAdminReturns] = useState([]);
  const [adminTab, setAdminTab] = useState("overview");

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (activePage === "admin" && adminToken) {
      loadAdminDashboard(adminToken);
    }
  }, [activePage, adminToken]);

  async function loadProducts() {
    setLoadingProducts(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Product API unavailable.");
      }

      const payload = await response.json();
      const loadedProducts = normalizeProducts(payload);

      setBackendProducts(loadedProducts);

      if (loadedProducts.length > 0) {
        setProducts(mergeBackendWithDemoProducts(loadedProducts));
      } else {
        setProducts(demoProducts);
      }
    } catch (error) {
      console.log("Product API fallback active:", error.message);
      setBackendProducts([]);
      setProducts(demoProducts);
    } finally {
      setLoadingProducts(false);
    }
  }

  const categories = useMemo(() => getCategories(products), [products]);
  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);
  const newDropProducts = useMemo(() => products.slice(0, 12), [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        String(product.category || "").toLowerCase() === selectedCategory.toLowerCase();

      const haystack = [
        product.name,
        product.category,
        product.collection,
        product.color,
        product.tag,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchText]);

  const subtotal = cart.reduce((sum, item) => sum + getSellingPrice(item) * item.quantity, 0);

  const discount = appliedCoupon
    ? Math.min(
        appliedCoupon.type === "fixed"
          ? appliedCoupon.value
          : Math.round((subtotal * appliedCoupon.value) / 100),
        appliedCoupon.maxDiscount,
        subtotal
      )
    : 0;

  const total = Math.max(subtotal - discount, 0);

  function openProduct(product) {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || product.size || "M");
    setSelectedColor(product.colors?.[0] || product.color || "Default");
  }

  function closeProduct() {
    setSelectedProduct(null);
  }

  function addToCart(product, options = {}) {
    const size = options.size || product.sizes?.[0] || product.size || "M";
    const color = options.color || product.colors?.[0] || product.color || "Default";
    const cartKey = `${getProductId(product)}-${size}-${color}`;

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.cartKey === cartKey);

      if (existingItem) {
        return currentCart.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          cartKey,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
        },
      ];
    });
  }

  function addCompleteLook(product) {
    addToCart(product, { size: selectedSize, color: selectedColor });

    const lookNames = product.aiCompleteLook || [];

    lookNames.forEach((name) => {
      const matchingProduct = products.find(
        (item) => item.name?.toLowerCase() === name.toLowerCase()
      );

      if (matchingProduct) {
        addToCart(matchingProduct);
      }
    });
  }

  function updateQuantity(cartKey, action) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.cartKey !== cartKey) return item;
          const nextQuantity = action === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(cartKey) {
    setCart((currentCart) => currentCart.filter((item) => item.cartKey !== cartKey));
  }

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();

    if (code === "STYLE10") {
      if (subtotal < 999) {
        alert("STYLE10 requires minimum cart value of ₹999.");
        return;
      }

      setAppliedCoupon({ code: "STYLE10", type: "percentage", value: 10, maxDiscount: 500 });
      return;
    }

    if (code === "NEXA20") {
      if (subtotal < 1999) {
        alert("NEXA20 requires minimum cart value of ₹1999.");
        return;
      }

      setAppliedCoupon({ code: "NEXA20", type: "percentage", value: 20, maxDiscount: 1000 });
      return;
    }

    if (code === "WELCOME250") {
      if (subtotal < 1499) {
        alert("WELCOME250 requires minimum cart value of ₹1499.");
        return;
      }

      setAppliedCoupon({ code: "WELCOME250", type: "fixed", value: 250, maxDiscount: 250 });
      return;
    }

    setAppliedCoupon(null);
    alert("Invalid coupon. Try STYLE10, NEXA20, or WELCOME250.");
  }

  function generateAiStyle() {
    const input = aiInput.toLowerCase();

    let suggestion =
      "Recommended fit: Oversized Noir Graphic Tee + Urban Cargo Utility Pants + Monochrome Runner Sneakers. Add a crossbody utility bag for a complete premium streetwear look.";

    if (input.includes("college") || input.includes("casual")) {
      suggestion =
        "College casual fit: Essential White Heavyweight Tee + Relaxed Denim Jeans + Monochrome Runner Sneakers. Clean, simple, and premium.";
    }

    if (input.includes("party") || input.includes("night")) {
      suggestion =
        "Night-out fit: High Street Bomber Jacket + Oversized Noir Graphic Tee + black relaxed bottoms + Monochrome Runner Sneakers.";
    }

    if (input.includes("hoodie") || input.includes("airport")) {
      suggestion =
        "Airport-style fit: Premium Washed Hoodie + Relaxed Denim Jeans + Crossbody Utility Bag + Monochrome Runner Sneakers.";
    }

    setAiResult(suggestion);
  }

  function updateTrackingForm(field, value) {
    setTrackingForm((current) => ({ ...current, [field]: value }));
  }

  async function loadOrderTracking(orderIdValue, emailValue) {
    const cleanOrderId = String(orderIdValue || "").trim();
    const cleanEmail = String(emailValue || "").trim().toLowerCase();

    if (!cleanOrderId || !cleanEmail) {
      setTrackingError("Order ID and email are required.");
      setTrackingResult(null);
      return false;
    }

    try {
      setTrackingLoading(true);
      setTrackingError("");

      const response = await fetch(
        `${API_BASE_URL}/api/orders/track?orderId=${encodeURIComponent(
          cleanOrderId
        )}&email=${encodeURIComponent(cleanEmail)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to track this order.");
      }

      setTrackingForm({ orderId: cleanOrderId, email: cleanEmail });
      setTrackingResult(data);
      return true;
    } catch (error) {
      setTrackingError(error.message);
      setTrackingResult(null);
      return false;
    } finally {
      setTrackingLoading(false);
    }
  }

  async function trackCustomerOrder(event) {
    event.preventDefault();
    await loadOrderTracking(trackingForm.orderId, trackingForm.email);
  }

  function updateReturnForm(field, value) {
    setReturnForm((current) => ({ ...current, [field]: value }));
  }

  function openReturnRequestFromTracking(order, item = null) {
    setReturnError("");
    setReturnMessage("");

    setReturnForm({
      orderId: String(order?.id || ""),
      customerName: order?.customerName || "Demo Customer",
      email: order?.email || "demo.customer@turtlemod.store",
      productName: item?.name || order?.items?.[0]?.name || "",
      size: item?.size || order?.items?.[0]?.size || "",
      requestType: "Exchange",
      reason: "",
    });

    setActivePage("return");
  }

  async function submitReturnRequest(event) {
    event.preventDefault();

    if (!returnForm.orderId || !returnForm.customerName || !returnForm.reason) {
      setReturnError("Order ID, customer name, and reason are required.");
      setReturnMessage("");
      return;
    }

    try {
      setReturnLoading(true);
      setReturnError("");
      setReturnMessage("");

      const response = await fetch(`${API_BASE_URL}/api/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create return request.");
      }

      setReturnMessage(`${returnForm.requestType} request submitted successfully.`);

      if (adminToken) {
        await loadAdminDashboard(adminToken);
      }
    } catch (error) {
      setReturnError(error.message);
    } finally {
      setReturnLoading(false);
    }
  }

  function resetReturnForm() {
    setReturnForm(emptyReturnForm);
    setReturnError("");
    setReturnMessage("");
  }

  function openInvoice(order) {
    if (!order) {
      alert("No order available to generate invoice.");
      return;
    }

    setInvoiceOrder(order);
    setActivePage("invoice");
  }

  async function placeDemoOrder() {
    if (cart.length === 0) {
      alert("Cart is empty. Add products before placing demo order.");
      return;
    }

    const orderItems = cart.map((item) => ({
      id: item.id || item._id || item.name,
      name: item.name,
      category: item.category || "Streetwear",
      price: Number(item.discountPrice || item.salePrice || item.price || 0),
      quantity: Number(item.quantity || 1),
      size: item.selectedSize || item.size || "M",
      color: item.selectedColor || item.color || "Default",
      image: item.image || item.imageUrl || "",
    }));

    const orderPayload = {
      customerName: "Demo Customer",
      email: "demo.customer@turtlemod.store",
      phone: "9999999999",
      items: orderItems,
      totalAmount: subtotal,
      address: "Demo checkout address, Chennai, Tamil Nadu, India",
      couponCode: appliedCoupon?.code || "",
      paymentMethod: "Demo Checkout",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Order API failed.");
      }

      alert(
        `Order placed successfully!\nOrder ID: #${data.order.id}\nFinal Amount: ${formatCurrency(
          data.order.finalAmount || data.order.totalAmount
        )}`
      );

      setCart([]);
      setCouponCode("");
      setAppliedCoupon(null);
      setTrackingForm({ orderId: String(data.order.id), email: orderPayload.email });
      setInvoiceOrder(data.order);

      await loadOrderTracking(data.order.id, orderPayload.email);
      setActivePage("track");

      if (adminToken) {
        loadAdminDashboard(adminToken);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      alert(`Order could not be saved.\nReason: ${error.message}\n\nCheck if backend is running on port 5000.`);
    }
  }

  async function loginAdmin(event) {
    event.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminLogin),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Admin login failed.");
      }

      localStorage.setItem("turtle_mod_admin_token", data.token);
      setAdminToken(data.token);
      await loadAdminDashboard(data.token);
    } catch (error) {
      setAdminError(error.message);
    } finally {
      setAdminLoading(false);
    }
  }

  function logoutAdmin() {
    localStorage.removeItem("turtle_mod_admin_token");
    setAdminToken("");
    setAdminSummary(null);
    setAdminOrders([]);
    setAdminReturns([]);
    setAdminError("");
  }

  async function loadAdminDashboard(token = adminToken) {
    if (!token) return;

    setAdminLoading(true);
    setAdminError("");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [summaryRes, ordersRes, returnsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/summary`, { headers }),
        fetch(`${API_BASE_URL}/api/orders`, { headers }),
        fetch(`${API_BASE_URL}/api/returns`, { headers }),
      ]);

      const summaryData = await summaryRes.json();
      const ordersData = await ordersRes.json();
      const returnsData = await returnsRes.json();

      if (!summaryRes.ok || !summaryData.success) {
        throw new Error(summaryData.message || "Unable to load admin summary.");
      }

      if (!ordersRes.ok || !ordersData.success) {
        throw new Error(ordersData.message || "Unable to load admin orders.");
      }

      setAdminSummary(summaryData.summary || null);
      setAdminOrders(ordersData.orders || []);
      setAdminReturns(returnsData.requests || []);
      await loadProducts();
    } catch (error) {
      setAdminError(error.message);

      if (
        error.message.toLowerCase().includes("admin access") ||
        error.message.toLowerCase().includes("login")
      ) {
        logoutAdmin();
      }
    } finally {
      setAdminLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status, paymentStatus) {
    if (!adminToken) {
      alert("Admin login required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status,
          paymentStatus,
          paymentMethod: paymentStatus === "Paid" ? "Demo Payment" : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update order.");
      }

      await loadAdminDashboard(adminToken);

      if (trackingForm.orderId && trackingForm.email) {
        await loadOrderTracking(trackingForm.orderId, trackingForm.email);
      }

      alert("Order updated successfully.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function openAdminWhatsAppUpdate(orderId) {
    if (!adminToken) {
      alert("Admin login required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/whatsapp-update`, {
        method: "GET",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to generate WhatsApp update.");
      }

      if (!data.whatsappLink) {
        alert("Customer phone number is not available for WhatsApp update.");
        return;
      }

      window.open(data.whatsappLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateReturnStatus(requestId, status, pickupStatus, refundStatus) {
    if (!adminToken) {
      alert("Admin login required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/returns/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status, pickupStatus, refundStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update return request.");
      }

      await loadAdminDashboard(adminToken);
      alert("Return request updated successfully.");
    } catch (error) {
      alert(error.message);
    }
  }

  function updateProductForm(field, value) {
    setProductForm((current) => ({ ...current, [field]: value }));
  }

  function resetProductForm() {
    setProductForm(emptyProductForm);
    setEditingProductId(null);
    setProductMessage("");
  }

  function startEditProduct(product) {
    setProductMessage("");
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      category: product.category || "T-Shirts",
      price: String(product.price || ""),
      oldPrice: String(product.oldPrice || product.originalPrice || ""),
      color: product.color || "Black",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(",") : product.sizes || "S,M,L,XL",
      stock: String(product.stock || ""),
      tag: product.tag || product.collection || "Updated Product",
      description: product.description || "",
      image: product.image || "",
    });
    setAdminTab("products");
  }

  async function saveAdminProduct(event) {
    event.preventDefault();

    if (!adminToken) {
      alert("Admin login required.");
      return;
    }

    if (!productForm.name || !productForm.category || !productForm.price || !productForm.color || !productForm.description) {
      setProductMessage("Name, category, price, color, and description are required.");
      return;
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      oldPrice: Number(productForm.oldPrice || productForm.price),
      color: productForm.color,
      sizes: productForm.sizes,
      stock: Number(productForm.stock || 0),
      tag: productForm.tag || "New Product",
      description: productForm.description,
      image: productForm.image,
    };

    const url = editingProductId
      ? `${API_BASE_URL}/api/admin/products/${editingProductId}`
      : `${API_BASE_URL}/api/admin/products`;

    const method = editingProductId ? "PUT" : "POST";

    try {
      setProductSaving(true);
      setProductMessage("");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Product save failed.");
      }

      setProductMessage(editingProductId ? "Product updated successfully." : "Product added successfully.");
      setProductForm(emptyProductForm);
      setEditingProductId(null);
      await loadProducts();
      await loadAdminDashboard(adminToken);
    } catch (error) {
      setProductMessage(error.message);
    } finally {
      setProductSaving(false);
    }
  }

  async function deleteAdminProduct(product) {
    if (!adminToken) {
      alert("Admin login required.");
      return;
    }

    const confirmed = window.confirm(`Delete product "${product.name}" from MongoDB?`);
    if (!confirmed) return;

    try {
      setProductMessage("");

      const response = await fetch(`${API_BASE_URL}/api/admin/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Product delete failed.");
      }

      setProductMessage("Product deleted successfully.");
      await loadProducts();
      await loadAdminDashboard(adminToken);
    } catch (error) {
      setProductMessage(error.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="top-announcement">
        <span>TURTLE MOD</span>
        <p>Slow moves. Sharp style. Premium streetwear for bold everyday fits.</p>
        <span>LIVE DEMO</span>
      </header>

      <nav className="navbar">
        <button className="brand" onClick={() => setActivePage("home")}>
          <span className="brand-mark">TM</span>
          <span>
            Turtle Mod
            <small>Premium Streetwear Studio</small>
          </span>
        </button>

        <div className="nav-links">
          <button className={activePage === "home" ? "active" : ""} onClick={() => setActivePage("home")}>
            Home
          </button>
          <button className={activePage === "shop" ? "active" : ""} onClick={() => setActivePage("shop")}>
            Shop
          </button>
          <button className={activePage === "ai" ? "active" : ""} onClick={() => setActivePage("ai")}>
            Stylist
          </button>
          <button className={activePage === "track" ? "active" : ""} onClick={() => setActivePage("track")}>
            Track
          </button>
          <button className={activePage === "return" ? "active" : ""} onClick={() => setActivePage("return")}>
            Return
          </button>
          <button className={activePage === "invoice" ? "active" : ""} onClick={() => setActivePage("invoice")}>
            Invoice
          </button>
          <button className={activePage === "admin" ? "active" : ""} onClick={() => setActivePage("admin")}>
            Admin
          </button>
          <button
            className={activePage === "cart" ? "active cart-nav" : "cart-nav"}
            onClick={() => setActivePage("cart")}
          >
            Cart <span>{cart.length}</span>
          </button>
        </div>
      </nav>

      {activePage === "home" && (
        <HomePage
          products={products}
          featuredProducts={featuredProducts}
          newDropProducts={newDropProducts}
          setActivePage={setActivePage}
          openProduct={openProduct}
          addToCart={addToCart}
        />
      )}

      {activePage === "shop" && (
        <ShopPage
          filteredProducts={filteredProducts}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchText={searchText}
          setSearchText={setSearchText}
          loadingProducts={loadingProducts}
          openProduct={openProduct}
          addToCart={addToCart}
        />
      )}

      {activePage === "ai" && (
        <StyleAssistant
          aiInput={aiInput}
          setAiInput={setAiInput}
          aiResult={aiResult}
          generateAiStyle={generateAiStyle}
          setActivePage={setActivePage}
        />
      )}

      {activePage === "track" && (
        <CustomerTracking
          trackingForm={trackingForm}
          updateTrackingForm={updateTrackingForm}
          trackCustomerOrder={trackCustomerOrder}
          trackingLoading={trackingLoading}
          trackingError={trackingError}
          trackingResult={trackingResult}
          setActivePage={setActivePage}
          openReturnRequestFromTracking={openReturnRequestFromTracking}
          openInvoice={openInvoice}
        />
      )}

      {activePage === "return" && (
        <ReturnExchangePage
          returnForm={returnForm}
          updateReturnForm={updateReturnForm}
          submitReturnRequest={submitReturnRequest}
          resetReturnForm={resetReturnForm}
          returnLoading={returnLoading}
          returnError={returnError}
          returnMessage={returnMessage}
          setActivePage={setActivePage}
        />
      )}

      {activePage === "invoice" && (
        <InvoicePage
          invoiceOrder={invoiceOrder || trackingResult?.order}
          setActivePage={setActivePage}
        />
      )}

      {activePage === "cart" && (
        <CartPage
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          total={total}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          applyCoupon={applyCoupon}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          placeDemoOrder={placeDemoOrder}
          setActivePage={setActivePage}
        />
      )}

      {activePage === "admin" && (
        <AdminDashboard
          adminToken={adminToken}
          adminLogin={adminLogin}
          setAdminLogin={setAdminLogin}
          loginAdmin={loginAdmin}
          logoutAdmin={logoutAdmin}
          adminLoading={adminLoading}
          adminError={adminError}
          adminSummary={adminSummary}
          adminOrders={adminOrders}
          adminReturns={adminReturns}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          loadAdminDashboard={() => loadAdminDashboard(adminToken)}
          updateOrderStatus={updateOrderStatus}
          openAdminWhatsAppUpdate={openAdminWhatsAppUpdate}
          openInvoice={openInvoice}
          updateReturnStatus={updateReturnStatus}
          backendProducts={backendProducts}
          productForm={productForm}
          updateProductForm={updateProductForm}
          saveAdminProduct={saveAdminProduct}
          resetProductForm={resetProductForm}
          startEditProduct={startEditProduct}
          deleteAdminProduct={deleteAdminProduct}
          editingProductId={editingProductId}
          productSaving={productSaving}
          productMessage={productMessage}
        />
      )}

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          products={products}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          setSelectedSize={setSelectedSize}
          setSelectedColor={setSelectedColor}
          onClose={closeProduct}
          onAdd={() => addToCart(selectedProduct, { size: selectedSize, color: selectedColor })}
          onAddLook={() => addCompleteLook(selectedProduct)}
        />
      )}
    </div>
  );
}

function HomePage({ products, featuredProducts, newDropProducts, setActivePage, openProduct, addToCart }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">NEW DROP / STYLE CURATED</div>
          <h1>Slow moves. Sharp style.</h1>
          <p>
            Turtle Mod is a premium streetwear destination built for bold everyday fits,
            complete-the-look styling, smart product discovery, and a clean shopping experience
            made for modern fashion culture.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setActivePage("shop")}>
              Explore Collection
            </button>
            <button className="secondary-btn" onClick={() => setActivePage("ai")}>
              Ask Stylist
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{products.length}+</strong>
              <span>Total Products</span>
            </div>
            <div>
              <strong>MOD</strong>
              <span>Style Engine</span>
            </div>
            <div>
              <strong>20%</strong>
              <span>Demo Coupon</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-card hero-image-main">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
              alt="Premium streetwear model"
            />
            <div className="floating-tag">Midnight Drop</div>
          </div>

          <div className="hero-mini-card">
            <span>Complete Look</span>
            <strong>Black tee + cargos + sneakers</strong>
            <p>Auto bundles styled from product catalog.</p>
          </div>
        </div>
      </section>

      <section className="collection-strip">
        <div>
          <span>01</span>
          <h3>Midnight Drop</h3>
          <p>Black-led graphic streetwear edits.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Utility Core</h3>
          <p>Cargos, bags, and daily outfit builders.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Comfort Drop</h3>
          <p>Hoodies and relaxed premium essentials.</p>
        </div>
      </section>

      <section className="section-head">
        <div>
          <span className="eyebrow">Featured</span>
          <h2>Premium streetwear collection</h2>
        </div>
        <button className="text-btn" onClick={() => setActivePage("shop")}>
          View all products →
        </button>
      </section>

      <section className="product-grid featured-grid">
        {featuredProducts.map((product) => (
          <ProductCard
            key={getProductId(product)}
            product={product}
            onOpen={openProduct}
            onAdd={addToCart}
          />
        ))}
      </section>

      <section className="ai-showcase">
        <div>
          <span className="eyebrow">Style Layer</span>
          <h2>Complete-the-look styling built into shopping.</h2>
          <p>
            Every product includes styling tips and matching bundle recommendations, making the
            platform feel more premium than a normal clothing website.
          </p>
        </div>
        <button className="primary-btn" onClick={() => setActivePage("ai")}>
          Try Stylist
        </button>
      </section>

      <section className="section-head">
        <div>
          <span className="eyebrow">Full Drop</span>
          <h2>Latest streetwear edits</h2>
        </div>
      </section>

      <section className="product-grid">
        {newDropProducts.map((product) => (
          <ProductCard
            key={getProductId(product)}
            product={product}
            onOpen={openProduct}
            onAdd={addToCart}
          />
        ))}
      </section>
    </main>
  );
}

function ShopPage({
  filteredProducts,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchText,
  setSearchText,
  loadingProducts,
  openProduct,
  addToCart,
}) {
  return (
    <main>
      <section className="shop-hero">
        <div>
          <span className="eyebrow">Shop</span>
          <h1>Premium catalog with smart discovery.</h1>
          <p>Browse drops, filter by category, search by style, open product preview, and add complete looks to cart.</p>
        </div>

        <div className="shop-search-card">
          <label>Search products</label>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search tees, cargos, hoodie..."
          />
        </div>
      </section>

      <section className="category-row">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="catalog-meta">
        <p>
          Showing <strong>{filteredProducts.length}</strong> products
          {loadingProducts ? " — loading backend catalog..." : ""}
        </p>
        <p>Coupons: STYLE10 / NEXA20 / WELCOME250</p>
      </section>

      <section className="product-grid catalog-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={getProductId(product)}
            product={product}
            onOpen={openProduct}
            onAdd={addToCart}
          />
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <section className="empty-state">
          <h2>No products found</h2>
          <p>Try another category or search keyword.</p>
        </section>
      )}
    </main>
  );
}

function StyleAssistant({ aiInput, setAiInput, aiResult, generateAiStyle, setActivePage }) {
  return (
    <main>
      <section className="ai-page">
        <div className="ai-left">
          <span className="eyebrow">Style Assistant</span>
          <h1>Ask Turtle Mod to build your outfit.</h1>
          <p>
            This style assistant gives instant outfit ideas from the available product catalog.
            Later, we can make this section more dynamic with advanced styling responses.
          </p>

          <div className="ai-input-box">
            <textarea
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              placeholder="Example: I need a black streetwear outfit for college under ₹5000"
            />

            <button className="primary-btn" onClick={generateAiStyle}>
              Generate Outfit
            </button>
          </div>
        </div>

        <div className="ai-result-card">
          <span>Style Recommendation</span>
          <h2>{aiResult}</h2>
          <button className="secondary-btn" onClick={() => setActivePage("shop")}>
            Shop Suggested Products
          </button>
        </div>
      </section>
    </main>
  );
}

function CartPage({
  cart,
  subtotal,
  discount,
  total,
  couponCode,
  setCouponCode,
  appliedCoupon,
  applyCoupon,
  updateQuantity,
  removeFromCart,
  placeDemoOrder,
  setActivePage,
}) {
  return (
    <main>
      <section className="cart-page">
        <div className="cart-items">
          <span className="eyebrow">Cart</span>
          <h1>Your selected look</h1>

          {cart.length === 0 && (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add a product or complete look from the catalog.</p>
              <button className="primary-btn" onClick={() => setActivePage("shop")}>
                Go to Shop
              </button>
            </div>
          )}

          {cart.map((item) => (
            <div className="cart-item" key={item.cartKey}>
              <img src={getProductImage(item)} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>
                  Size: {item.selectedSize} • Color: {item.selectedColor}
                </p>
                <strong>{formatCurrency(getSellingPrice(item))}</strong>
              </div>

              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.cartKey, "decrease")}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.cartKey, "increase")}>+</button>
              </div>

              <button className="remove-btn" onClick={() => removeFromCart(item.cartKey)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="coupon-box">
            <label>Apply coupon</label>
            <div>
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="NEXA20"
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
          </div>

          {appliedCoupon && <p className="coupon-success">Coupon {appliedCoupon.code} applied successfully.</p>}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <div className="summary-row">
            <span>Discount</span>
            <strong>- {formatCurrency(discount)}</strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <button className="primary-btn full" onClick={placeDemoOrder}>
            Place Demo Order
          </button>

          <p className="checkout-note">After order placement, customer tracking will open automatically.</p>
        </aside>
      </section>
    </main>
  );
}

function ProductCard({ product, onOpen, onAdd }) {
  const sellingPrice = getSellingPrice(product);
  const originalPrice = getOriginalPrice(product);

  return (
    <article className="product-card">
      <button className="product-image" onClick={() => onOpen(product)}>
        <img src={getProductImage(product)} alt={product.name} />

        {(product.isNewDrop || product.tag === "New Drop") && <span className="badge">New Drop</span>}

        {product.discountPercent && <span className="discount-badge">{product.discountPercent}% OFF</span>}
      </button>

      <div className="product-content">
        <div className="product-meta">
          <span>{product.collection || product.tag || "Streetwear Edit"}</span>
          <span>★ {product.rating || "4.6"}</span>
        </div>

        <h3>{product.name}</h3>
        <p>{product.category || "Streetwear"}</p>

        <div className="price-row">
          <strong>{formatCurrency(sellingPrice)}</strong>
          {originalPrice > sellingPrice && <del>{formatCurrency(originalPrice)}</del>}
        </div>

        <div className="product-actions">
          <button onClick={() => onOpen(product)}>Preview</button>
          <button onClick={() => onAdd(product)}>Add</button>
        </div>
      </div>
    </article>
  );
}

function ProductDrawer({
  product,
  products,
  selectedSize,
  selectedColor,
  setSelectedSize,
  setSelectedColor,
  onClose,
  onAdd,
  onAddLook,
}) {
  const sellingPrice = getSellingPrice(product);
  const originalPrice = getOriginalPrice(product);
  const completeLook = product.aiCompleteLook || [];

  return (
    <div className="drawer-backdrop">
      <aside className="product-drawer">
        <button className="drawer-close" onClick={onClose}>
          ×
        </button>

        <div className="drawer-image">
          <img src={getProductImage(product)} alt={product.name} />
        </div>

        <div className="drawer-content">
          <span className="eyebrow">{product.collection || product.tag || "Streetwear Drop"}</span>
          <h2>{product.name}</h2>

          <p className="drawer-description">
            {product.description || "Premium fashion product with guided styling support."}
          </p>

          <div className="drawer-price">
            <strong>{formatCurrency(sellingPrice)}</strong>
            {originalPrice > sellingPrice && <del>{formatCurrency(originalPrice)}</del>}
          </div>

          <div className="option-group">
            <label>Select size</label>
            <div>
              {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "active" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Select color</label>
            <div>
              {(product.colors || [product.color || "Default"]).map((color) => (
                <button
                  key={color}
                  className={selectedColor === color ? "active" : ""}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-tip-box">
            <span>Style Tip</span>
            <p>{product.aiStyleTip || "Pair this with clean basics and sneakers for a premium outfit."}</p>
          </div>

          {completeLook.length > 0 && (
            <div className="complete-look">
              <h3>Complete the look</h3>
              {completeLook.map((itemName) => {
                const matchedProduct = products.find(
                  (item) => item.name?.toLowerCase() === itemName.toLowerCase()
                );

                return (
                  <div className="look-item" key={itemName}>
                    <span>{itemName}</span>
                    <small>
                      {matchedProduct ? formatCurrency(getSellingPrice(matchedProduct)) : "Recommended"}
                    </small>
                  </div>
                );
              })}
            </div>
          )}

          <div className="drawer-actions">
            <button className="secondary-btn" onClick={onAdd}>
              Add Product
            </button>
            <button className="primary-btn" onClick={onAddLook}>
              Add Complete Look
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CustomerTracking({
  trackingForm,
  updateTrackingForm,
  trackCustomerOrder,
  trackingLoading,
  trackingError,
  trackingResult,
  setActivePage,
  openReturnRequestFromTracking,
  openInvoice,
}) {
  const order = trackingResult?.order || null;
  const tracking = trackingResult?.tracking || null;
  const timeline = tracking?.timeline || [];
  const inputStyle = {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#050505",
    color: "#f6f3ee",
  };

  return (
    <main>
      <section className="shop-hero">
        <div>
          <span className="eyebrow">Order Tracking</span>
          <h1>Track your Turtle Mod order.</h1>
          <p>Enter your order ID and email to view status, payment details, ordered items, and delivery timeline.</p>
        </div>

        <form className="shop-search-card" onSubmit={trackCustomerOrder}>
          <label>Track Order</label>
          <div style={{ display: "grid", gap: "12px" }}>
            <input
              value={trackingForm.orderId}
              onChange={(event) => updateTrackingForm("orderId", event.target.value)}
              placeholder="Order ID, example: 1"
              style={inputStyle}
            />
            <input
              value={trackingForm.email}
              onChange={(event) => updateTrackingForm("email", event.target.value)}
              placeholder="Customer email"
              style={inputStyle}
            />
            <button className="primary-btn" type="submit" disabled={trackingLoading}>
              {trackingLoading ? "Tracking..." : "Track Order"}
            </button>
          </div>
        </form>
      </section>

      {trackingError && (
        <SectionPanel style={{ borderColor: "rgba(255,107,107,0.5)" }}>
          <p style={{ color: "#ff6b6b", margin: 0 }}>{trackingError}</p>
        </SectionPanel>
      )}

      {!order && !trackingError && (
        <SectionPanel>
          <span className="eyebrow">Customer Help</span>
          <h2 style={{ marginTop: 0 }}>How to test tracking</h2>
          <p style={{ color: "#aaa39a", lineHeight: 1.7 }}>
            Place a demo order from the cart. After checkout, this page will open automatically with the order ID and email filled in.
          </p>
          <button className="primary-btn" onClick={() => setActivePage("shop")}>
            Shop and Place Order
          </button>
        </SectionPanel>
      )}

      {order && (
        <>
          <SectionPanel>
            <span className="eyebrow">Order Found</span>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>Order #{tracking?.orderId || order.id}</h2>
                <p style={{ color: "#aaa39a", marginBottom: 0 }}>
                  Customer: {tracking?.customerName || order.customerName}
                </p>
              </div>

              <div style={{ display: "grid", gap: "10px", justifyItems: "end" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "999px",
                    background: "rgba(215,180,106,0.12)",
                    color: "#d7b46a",
                    border: "1px solid rgba(215,180,106,0.24)",
                    fontWeight: 700,
                  }}
                >
                  {tracking?.status || order.status}
                </div>

                <button className="primary-btn" onClick={() => openInvoice(order)}>
                  View / Print Invoice
                </button>

                <button className="secondary-btn" onClick={() => openReturnRequestFromTracking(order)}>
                  Request Return / Exchange
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginTop: "20px" }}>
              <AdminMetricCard label="Order Status" value={tracking?.status || order.status || "Order Placed"} />
              <AdminMetricCard label="Payment" value={tracking?.paymentStatus || order.paymentStatus || "Pending"} />
              <AdminMetricCard
                label="Final Amount"
                value={formatCurrency(tracking?.finalAmount || order.finalAmount || order.totalAmount || 0)}
              />
              <AdminMetricCard label="Discount" value={formatCurrency(tracking?.discountAmount || order.discountAmount || 0)} />
            </div>
          </SectionPanel>

          <SectionPanel>
            <span className="eyebrow">Timeline</span>
            <h2 style={{ marginTop: 0, letterSpacing: "-0.05em" }}>Delivery Progress</h2>

            <div style={{ display: "grid", gap: "14px" }}>
              {timeline.map((step, index) => (
                <div
                  key={step.key || step.label}
                  style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: "14px", alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: step.completed ? "rgba(215,180,106,0.95)" : "rgba(255,255,255,0.08)",
                      color: step.completed ? "#050505" : "#aaa39a",
                      fontWeight: 900,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <strong style={{ color: step.active ? "#d7b46a" : "#f6f3ee" }}>{step.label}</strong>
                    <p style={{ color: "#aaa39a", marginTop: "4px" }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel>
            <span className="eyebrow">Items</span>
            <h2 style={{ marginTop: 0, letterSpacing: "-0.05em" }}>Ordered Products</h2>

            <div style={{ display: "grid", gap: "14px" }}>
              {(order.items || []).map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "14px",
                    background: "#111",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ color: "#aaa39a", margin: "5px 0 0" }}>
                      Qty: {item.quantity || 1} • Size: {item.size || "N/A"} • Color: {item.color || "N/A"}
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: "8px", justifyItems: "end" }}>
                    <strong>{formatCurrency(item.price || 0)}</strong>
                    <button className="secondary-btn" onClick={() => openReturnRequestFromTracking(order, item)}>
                      Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>
        </>
      )}
    </main>
  );
}


function InvoicePage({ invoiceOrder, setActivePage }) {
  if (!invoiceOrder) {
    return (
      <main>
        <section className="shop-hero">
          <div>
            <span className="eyebrow">Invoice</span>
            <h1>No invoice selected.</h1>
            <p>Place an order or open an invoice from Admin → Orders.</p>
          </div>

          <div className="shop-search-card">
            <label>Invoice Help</label>
            <p style={{ color: "#aaa39a", lineHeight: 1.7, marginTop: 0 }}>
              Customer invoices are generated from existing order details. No backend change is required for this demo.
            </p>
            <button className="primary-btn" onClick={() => setActivePage("track")}>
              Go to Tracking
            </button>
          </div>
        </section>
      </main>
    );
  }

  const items = invoiceOrder.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const discountAmount = Number(invoiceOrder.discountAmount || 0);
  const finalAmount = Number(
    invoiceOrder.finalAmount || invoiceOrder.totalAmount || subtotal - discountAmount || 0
  );

  const invoiceNumber = `TM-INV-${invoiceOrder.id || "DEMO"}`;
  const invoiceDate = invoiceOrder.createdAt
    ? new Date(invoiceOrder.createdAt).toLocaleString()
    : new Date().toLocaleString();

  const panelStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    background: "#0b0b0b",
    padding: "24px",
  };

  const tableWrapStyle = {
    overflowX: "auto",
    marginTop: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "14px",
    color: "#d7b46a",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  };

  const tdStyle = {
    padding: "14px",
    color: "#f6f3ee",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    verticalAlign: "top",
  };

  function escapeInvoiceText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function printInvoice() {
    const oldTitle = document.title;
    document.title = `${invoiceNumber} - Turtle Mod Invoice`;

    const itemRows =
      items.length > 0
        ? items
            .map((item, index) => {
              const quantity = Number(item.quantity || 1);
              const price = Number(item.price || 0);
              const amount = price * quantity;

              return `
                <tr>
                  <td>
                    <strong>${escapeInvoiceText(item.name || `Item ${index + 1}`)}</strong>
                    <span>${escapeInvoiceText(item.category || "Streetwear")}</span>
                  </td>
                  <td>${escapeInvoiceText(item.size || "N/A")}</td>
                  <td>${escapeInvoiceText(item.color || "N/A")}</td>
                  <td>${quantity}</td>
                  <td>${formatCurrency(price)}</td>
                  <td>${formatCurrency(amount)}</td>
                </tr>
              `;
            })
            .join("")
        : `
          <tr>
            <td colspan="6">No items available on this order.</td>
          </tr>
        `;

    const invoiceHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeInvoiceText(invoiceNumber)} - Turtle Mod Invoice</title>
    <style>
      @page {
        size: A4;
        margin: 10mm;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #111111;
        font-family: Arial, Helvetica, sans-serif;
      }

      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .invoice-sheet {
        width: 100%;
        max-width: 190mm;
        margin: 0 auto;
        background: #ffffff;
        padding: 0;
      }

      .invoice-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
        border-bottom: 2px solid #111111;
        padding-bottom: 18px;
        margin-bottom: 22px;
      }

      .brand-row {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .brand-mark {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #111111;
        color: #ffffff;
        display: grid;
        place-items: center;
        font-weight: 900;
        letter-spacing: 0.06em;
      }

      .brand-name {
        font-size: 24px;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 1;
      }

      .brand-sub {
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #555555;
        font-weight: 800;
        margin-top: 6px;
      }

      .invoice-title {
        text-align: right;
      }

      .invoice-title h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: -0.04em;
      }

      .invoice-title p {
        margin: 8px 0 0;
        color: #555555;
        line-height: 1.55;
        font-size: 12px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-bottom: 20px;
      }

      .info-card {
        border: 1px solid #dddddd;
        border-radius: 12px;
        padding: 14px;
        background: #fafafa;
      }

      .label {
        display: block;
        color: #8a6a20;
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 900;
        margin-bottom: 10px;
      }

      .info-card h2 {
        margin: 0 0 8px;
        font-size: 16px;
      }

      .info-card p {
        margin: 0;
        color: #444444;
        line-height: 1.55;
        font-size: 12px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        margin-top: 6px;
      }

      th {
        text-align: left;
        font-size: 10px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #8a6a20;
        border-bottom: 1px solid #111111;
        padding: 9px 7px;
      }

      td {
        padding: 11px 7px;
        border-bottom: 1px solid #e5e5e5;
        vertical-align: top;
        font-size: 12px;
        color: #222222;
        word-break: break-word;
      }

      td strong {
        display: block;
        font-size: 12px;
      }

      td span {
        display: block;
        color: #666666;
        margin-top: 4px;
        font-size: 11px;
      }

      th:nth-child(1),
      td:nth-child(1) {
        width: 38%;
      }

      th:nth-child(2),
      td:nth-child(2),
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4) {
        width: 12%;
      }

      th:nth-child(5),
      td:nth-child(5),
      th:nth-child(6),
      td:nth-child(6) {
        width: 13%;
        text-align: right;
      }

      .summary {
        width: 230px;
        margin-left: auto;
        margin-top: 18px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        color: #444444;
        font-size: 13px;
        margin-bottom: 8px;
      }

      .summary-row.total {
        border-top: 2px solid #111111;
        padding-top: 10px;
        margin-top: 10px;
        font-size: 20px;
        color: #111111;
        font-weight: 900;
      }

      .footer {
        margin-top: 22px;
        padding-top: 14px;
        border-top: 1px solid #dddddd;
        color: #555555;
        font-size: 12px;
        line-height: 1.55;
      }

      .footer strong {
        color: #111111;
      }

      .print-note {
        margin-top: 14px;
        padding: 10px 12px;
        background: #fff7df;
        border: 1px solid #f0d78a;
        color: #5a4210;
        border-radius: 10px;
        font-size: 12px;
      }

      @media print {
        .print-note {
          display: none !important;
        }

        .invoice-sheet {
          max-width: none;
        }

        body {
          margin: 0;
          padding: 0;
        }

        table,
        tr,
        td,
        th,
        .info-card,
        .summary {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
    </style>
  </head>

  <body>
    <div class="invoice-sheet">
      <div class="invoice-top">
        <div>
          <div class="brand-row">
            <div class="brand-mark">TM</div>
            <div>
              <div class="brand-name">Turtle Mod</div>
              <div class="brand-sub">Premium Streetwear Studio</div>
            </div>
          </div>
          <p style="margin: 14px 0 0; color: #555555; line-height: 1.55; font-size: 12px;">
            Chennai, Tamil Nadu, India<br />
            support@turtlemod.store
          </p>
        </div>

        <div class="invoice-title">
          <h1>Tax Invoice</h1>
          <p>
            <strong>${escapeInvoiceText(invoiceNumber)}</strong><br />
            Order ID: #${escapeInvoiceText(invoiceOrder.id || "DEMO")}<br />
            Invoice Date: ${escapeInvoiceText(invoiceDate)}<br />
            Status: ${escapeInvoiceText(invoiceOrder.status || "Order Placed")}
          </p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <span class="label">Bill To</span>
          <h2>${escapeInvoiceText(invoiceOrder.customerName || "Customer")}</h2>
          <p>
            ${escapeInvoiceText(invoiceOrder.email || "No email")}<br />
            ${escapeInvoiceText(invoiceOrder.phone || "No phone")}<br />
            ${escapeInvoiceText(invoiceOrder.address || "No address added")}
          </p>
        </div>

        <div class="info-card">
          <span class="label">Payment</span>
          <h2>${escapeInvoiceText(invoiceOrder.paymentStatus || "Pending")}</h2>
          <p>
            Method: ${escapeInvoiceText(invoiceOrder.paymentMethod || "Demo Checkout")}<br />
            Coupon: ${escapeInvoiceText(invoiceOrder.couponCode || "No coupon")}<br />
            Order Status: ${escapeInvoiceText(invoiceOrder.status || "Order Placed")}
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Size</th>
            <th>Color</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>${formatCurrency(subtotal)}</strong>
        </div>
        <div class="summary-row">
          <span>Discount</span>
          <strong>- ${formatCurrency(discountAmount)}</strong>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <strong>${formatCurrency(finalAmount)}</strong>
        </div>
      </div>

      <div class="footer">
        <strong>Thank you for shopping with Turtle Mod.</strong><br />
        This is a demo invoice generated from the order data available in the application.
      </div>

      <div class="print-note">
        For the cleanest PDF, turn off "Headers and footers" in the browser print dialog.
      </div>
    </div>

    <script>
      window.onload = function () {
        window.focus();
        setTimeout(function () {
          window.print();
        }, 300);
      };
    </script>
  </body>
</html>`;

    const printWindow = window.open("", "_blank", "width=900,height=1200");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups for this site and try again.");
      document.title = oldTitle;
      return;
    }

    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();

    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
  }

  return (
    <main>
      <section className="shop-hero no-print">
        <div>
          <span className="eyebrow">Invoice / Receipt</span>
          <h1>Order receipt for Turtle Mod.</h1>
          <p>
            View the customer receipt, confirm payment and order status, then print or save as PDF from a clean invoice window.
          </p>
        </div>

        <div className="shop-search-card">
          <label>Invoice Actions</label>
          <div style={{ display: "grid", gap: "10px" }}>
            <button className="primary-btn" onClick={printInvoice}>
              Print / Save Clean Invoice
            </button>
            <button className="secondary-btn" onClick={() => setActivePage("track")}>
              Back to Tracking
            </button>
          </div>
          <p style={{ color: "#aaa39a", lineHeight: 1.6, marginBottom: 0 }}>
            This opens a separate invoice-only print page. In the print dialog, disable browser headers and footers if they appear.
          </p>
        </div>
      </section>

      <section id="invoice-print-area" style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span className="eyebrow">Turtle Mod</span>
            <h2 style={{ margin: "6px 0 8px", letterSpacing: "-0.05em" }}>
              Tax Invoice / Order Receipt
            </h2>
            <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: 0 }}>
              Premium Streetwear Studio<br />
              Chennai, Tamil Nadu, India<br />
              support@turtlemod.store
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <strong style={{ fontSize: "22px" }}>{invoiceNumber}</strong>
            <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: "8px 0 0" }}>
              Order ID: #{invoiceOrder.id}<br />
              Invoice Date: {invoiceDate}<br />
              Status: {invoiceOrder.status || "Order Placed"}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              background: "#111",
              padding: "18px",
            }}
          >
            <span className="eyebrow">Bill To</span>
            <h3 style={{ marginBottom: "8px" }}>{invoiceOrder.customerName || "Customer"}</h3>
            <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: 0 }}>
              {invoiceOrder.email || "No email"}<br />
              {invoiceOrder.phone || "No phone"}<br />
              {invoiceOrder.address || "No address added"}
            </p>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              background: "#111",
              padding: "18px",
            }}
          >
            <span className="eyebrow">Payment</span>
            <h3 style={{ marginBottom: "8px" }}>{invoiceOrder.paymentStatus || "Pending"}</h3>
            <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: 0 }}>
              Method: {invoiceOrder.paymentMethod || "Demo Checkout"}<br />
              Coupon: {invoiceOrder.couponCode || "No coupon"}<br />
              Order Status: {invoiceOrder.status || "Order Placed"}
            </p>
          </div>
        </div>

        <div style={tableWrapStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Size</th>
                <th style={thStyle}>Color</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan="6">
                    No items available on this order.
                  </td>
                </tr>
              )}

              {items.map((item, index) => {
                const quantity = Number(item.quantity || 1);
                const price = Number(item.price || 0);
                return (
                  <tr key={`${item.name}-${index}`}>
                    <td style={tdStyle}>
                      <strong>{item.name}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>{item.category || "Streetwear"}</small>
                    </td>
                    <td style={tdStyle}>{item.size || "N/A"}</td>
                    <td style={tdStyle}>{item.color || "N/A"}</td>
                    <td style={tdStyle}>{quantity}</td>
                    <td style={tdStyle}>{formatCurrency(price)}</td>
                    <td style={tdStyle}>{formatCurrency(price * quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "grid",
            justifyContent: "end",
            gap: "10px",
            marginTop: "22px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "80px", color: "#aaa39a" }}>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "80px", color: "#aaa39a" }}>
            <span>Discount</span>
            <strong>- {formatCurrency(discountAmount)}</strong>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "80px",
              fontSize: "24px",
              color: "#f6f3ee",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: "12px",
            }}
          >
            <span>Total</span>
            <strong>{formatCurrency(finalAmount)}</strong>
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "18px",
            color: "#aaa39a",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#f6f3ee" }}>Thank you for shopping with Turtle Mod.</strong>
          <br />
          This is a demo invoice generated from the order data available in the application.
        </div>
      </section>
    </main>
  );
}

function ReturnExchangePage({
  returnForm,
  updateReturnForm,
  submitReturnRequest,
  resetReturnForm,
  returnLoading,
  returnError,
  returnMessage,
  setActivePage,
}) {
  const inputStyle = {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#050505",
    color: "#f6f3ee",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#aaa39a",
    fontSize: "13px",
  };

  return (
    <main>
      <section className="shop-hero">
        <div>
          <span className="eyebrow">Return / Exchange</span>
          <h1>Request support for your order.</h1>
          <p>Customers can submit return, exchange, or refund requests. Admin can review these under the Returns tab.</p>
        </div>

        <div className="shop-search-card">
          <label>Need order details?</label>
          <p style={{ color: "#aaa39a", lineHeight: 1.7, marginTop: 0 }}>
            Track your order first, then create a return or exchange request directly from the tracking page.
          </p>
          <button className="primary-btn" onClick={() => setActivePage("track")}>
            Go to Tracking
          </button>
        </div>
      </section>

      <SectionPanel>
        <span className="eyebrow">Customer Request</span>
        <h2 style={{ marginTop: 0, letterSpacing: "-0.05em" }}>Create Return / Exchange Request</h2>

        <form onSubmit={submitReturnRequest}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px", marginTop: "18px" }}>
            <FormField label="Order ID" value={returnForm.orderId} onChange={(value) => updateReturnForm("orderId", value)} placeholder="Example: 1" inputStyle={inputStyle} labelStyle={labelStyle} />
            <FormField label="Customer Name" value={returnForm.customerName} onChange={(value) => updateReturnForm("customerName", value)} placeholder="Customer name" inputStyle={inputStyle} labelStyle={labelStyle} />
            <FormField label="Email" value={returnForm.email} onChange={(value) => updateReturnForm("email", value)} placeholder="customer@email.com" inputStyle={inputStyle} labelStyle={labelStyle} />
            <FormField label="Product Name" value={returnForm.productName} onChange={(value) => updateReturnForm("productName", value)} placeholder="Product name" inputStyle={inputStyle} labelStyle={labelStyle} />
            <FormField label="Size" value={returnForm.size} onChange={(value) => updateReturnForm("size", value)} placeholder="S / M / L / XL" inputStyle={inputStyle} labelStyle={labelStyle} />

            <label>
              <span style={labelStyle}>Request Type</span>
              <select
                value={returnForm.requestType}
                onChange={(event) => updateReturnForm("requestType", event.target.value)}
                style={inputStyle}
              >
                <option value="Exchange">Exchange</option>
                <option value="Return">Return</option>
                <option value="Refund">Refund</option>
                <option value="Size Exchange">Size Exchange</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label>
              <span style={labelStyle}>Reason</span>
              <textarea
                value={returnForm.reason}
                onChange={(event) => updateReturnForm("reason", event.target.value)}
                placeholder="Example: Size is too small, need L instead of M."
                style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              />
            </label>
          </div>

          {returnError && <p style={{ color: "#ff6b6b", marginTop: "14px" }}>{returnError}</p>}
          {returnMessage && <p style={{ color: "#7be495", marginTop: "14px" }}>{returnMessage}</p>}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
            <button className="primary-btn" type="submit" disabled={returnLoading}>
              {returnLoading ? "Submitting..." : "Submit Request"}
            </button>
            <button className="secondary-btn" type="button" onClick={resetReturnForm}>
              Clear Form
            </button>
          </div>
        </form>
      </SectionPanel>

      <SectionPanel>
        <span className="eyebrow">What happens next?</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginTop: "14px" }}>
          <ReturnInfoCard number="01" title="Request Submitted" text="Customer submits return, exchange, or refund request." />
          <ReturnInfoCard number="02" title="Admin Review" text="Admin sees the request under Admin → Returns." />
          <ReturnInfoCard number="03" title="Pickup / Refund" text="Admin can update pickup and refund progress." />
        </div>
      </SectionPanel>
    </main>
  );
}

function FormField({ label, value, onChange, placeholder, inputStyle, labelStyle, type = "text" }) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
    </label>
  );
}

function ReturnInfoCard({ number, title, text }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "18px", background: "#111" }}>
      <span style={{ color: "#d7b46a", fontWeight: 900, letterSpacing: "0.12em" }}>{number}</span>
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#aaa39a", lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}

function AdminDashboard({
  adminToken,
  adminLogin,
  setAdminLogin,
  loginAdmin,
  logoutAdmin,
  adminLoading,
  adminError,
  adminSummary,
  adminOrders,
  adminReturns,
  adminTab,
  setAdminTab,
  loadAdminDashboard,
  updateOrderStatus,
  openAdminWhatsAppUpdate,
  openInvoice,
  updateReturnStatus,
  backendProducts,
  productForm,
  updateProductForm,
  saveAdminProduct,
  resetProductForm,
  startEditProduct,
  deleteAdminProduct,
  editingProductId,
  productSaving,
  productMessage,
}) {
  const panelStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    background: "#0b0b0b",
    padding: "24px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginTop: "22px",
  };

  const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "18px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 15px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#050505",
    color: "#f6f3ee",
  };

  const tableWrapStyle = {
    overflowX: "auto",
    marginTop: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "920px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "14px",
    color: "#d7b46a",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  };

  const tdStyle = {
    padding: "14px",
    color: "#f6f3ee",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    verticalAlign: "top",
  };

  if (!adminToken) {
    return (
      <main>
        <section className="ai-page">
          <div className="ai-left">
            <span className="eyebrow">Admin Access</span>
            <h1>Turtle Mod Admin</h1>
            <p>Login to manage products, orders, revenue summary, and return or exchange requests.</p>
          </div>

          <form className="ai-result-card" onSubmit={loginAdmin}>
            <span>Admin Login</span>
            <div className="ai-input-box">
              <input
                value={adminLogin.username}
                onChange={(event) => setAdminLogin((current) => ({ ...current, username: event.target.value }))}
                placeholder="Username"
                style={inputStyle}
              />
              <input
                type="password"
                value={adminLogin.password}
                onChange={(event) => setAdminLogin((current) => ({ ...current, password: event.target.value }))}
                placeholder="Password"
                style={inputStyle}
              />
              {adminError && <p style={{ color: "#ff6b6b", margin: 0 }}>{adminError}</p>}
              <button className="primary-btn" type="submit" disabled={adminLoading}>
                {adminLoading ? "Logging in..." : "Login as Admin"}
              </button>
              <p style={{ color: "#aaa39a", lineHeight: 1.6, margin: 0 }}>Demo default: admin / admin123</p>
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="shop-hero">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Business control room.</h1>
          <p>Manage products, orders, stock, payments, returns, and storefront content from one premium admin view.</p>
        </div>

        <div className="shop-search-card">
          <label>Admin Actions</label>
          <div style={{ display: "grid", gap: "10px" }}>
            <button className="primary-btn" onClick={loadAdminDashboard}>
              Refresh Dashboard
            </button>
            <button className="secondary-btn" onClick={logoutAdmin}>
              Logout Admin
            </button>
          </div>
        </div>
      </section>

      {adminError && (
        <section style={{ ...panelStyle, borderColor: "rgba(255,107,107,0.5)" }}>
          <p style={{ color: "#ff6b6b", margin: 0 }}>{adminError}</p>
        </section>
      )}

      <section className="category-row">
        <button className={adminTab === "overview" ? "active" : ""} onClick={() => setAdminTab("overview")}>
          Overview
        </button>
        <button className={adminTab === "analytics" ? "active" : ""} onClick={() => setAdminTab("analytics")}>
          Analytics
        </button>
        <button className={adminTab === "demoGuide" ? "active" : ""} onClick={() => setAdminTab("demoGuide")}>
          Demo Guide
        </button>
        <button className={adminTab === "products" ? "active" : ""} onClick={() => setAdminTab("products")}>
          Products
        </button>
        <button className={adminTab === "orders" ? "active" : ""} onClick={() => setAdminTab("orders")}>
          Orders
        </button>
        <button className={adminTab === "returns" ? "active" : ""} onClick={() => setAdminTab("returns")}>
          Returns
        </button>
      </section>

      {adminTab === "overview" && (
        <section style={panelStyle}>
          <span className="eyebrow">Live Metrics</span>
          <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>Store Summary</h2>

          <div style={gridStyle}>
            <AdminMetricCard label="Products" value={adminSummary?.totalProducts || 0} />
            <AdminMetricCard label="Orders" value={adminSummary?.totalOrders || 0} />
            <AdminMetricCard label="Total Revenue" value={formatCurrency(adminSummary?.totalRevenue || 0)} />
            <AdminMetricCard label="Paid Revenue" value={formatCurrency(adminSummary?.paidRevenue || 0)} />
            <AdminMetricCard label="Inventory" value={adminSummary?.totalInventory || 0} />
            <AdminMetricCard label="Return Requests" value={adminSummary?.totalReturnRequests || 0} />
          </div>

          {adminLoading && <p style={{ color: "#aaa39a" }}>Loading admin data...</p>}
        </section>
      )}

      {adminTab === "analytics" && (
        <AdminAnalyticsDashboard
          adminSummary={adminSummary}
          adminOrders={adminOrders}
          adminReturns={adminReturns}
          backendProducts={backendProducts}
        />
      )}

      {adminTab === "demoGuide" && (
        <AdminDemoGuide
          adminSummary={adminSummary}
          adminOrders={adminOrders}
          adminReturns={adminReturns}
          backendProducts={backendProducts}
          loadAdminDashboard={loadAdminDashboard}
        />
      )}

      {adminTab === "products" && (
        <section style={panelStyle}>
          <span className="eyebrow">Product Management</span>
          <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={saveAdminProduct}>
            <div style={formGridStyle}>
              <AdminInput label="Product Name" value={productForm.name} onChange={(value) => updateProductForm("name", value)} placeholder="Premium Black Tee" />
              <AdminInput label="Category" value={productForm.category} onChange={(value) => updateProductForm("category", value)} placeholder="T-Shirts" />
              <AdminInput label="Price" value={productForm.price} onChange={(value) => updateProductForm("price", value)} placeholder="1499" type="number" />
              <AdminInput label="Old Price" value={productForm.oldPrice} onChange={(value) => updateProductForm("oldPrice", value)} placeholder="1999" type="number" />
              <AdminInput label="Color" value={productForm.color} onChange={(value) => updateProductForm("color", value)} placeholder="Black" />
              <AdminInput label="Sizes" value={productForm.sizes} onChange={(value) => updateProductForm("sizes", value)} placeholder="S,M,L,XL" />
              <AdminInput label="Stock" value={productForm.stock} onChange={(value) => updateProductForm("stock", value)} placeholder="25" type="number" />
              <AdminInput label="Tag" value={productForm.tag} onChange={(value) => updateProductForm("tag", value)} placeholder="New Product" />
              <AdminInput label="Image URL" value={productForm.image} onChange={(value) => updateProductForm("image", value)} placeholder="https://..." />
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#aaa39a", fontSize: "13px" }}>
                Description
              </label>
              <textarea
                value={productForm.description}
                onChange={(event) => updateProductForm("description", event.target.value)}
                placeholder="Write product description..."
                style={{
                  width: "100%",
                  minHeight: "110px",
                  padding: "14px 15px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#050505",
                  color: "#f6f3ee",
                  resize: "vertical",
                }}
              />
            </div>

            {productMessage && (
              <p style={{ color: productMessage.toLowerCase().includes("success") ? "#7be495" : "#ffb86b", marginTop: "14px" }}>
                {productMessage}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
              <button className="primary-btn" type="submit" disabled={productSaving}>
                {productSaving ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
              </button>
              <button className="secondary-btn" type="button" onClick={resetProductForm}>
                Clear Form
              </button>
            </div>
          </form>

          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Tag</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {backendProducts.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan="6">
                      No MongoDB products found. Add your first product from the form above.
                    </td>
                  </tr>
                )}

                {backendProducts.map((product) => (
                  <tr key={product._id || product.id}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          style={{ width: "54px", height: "64px", objectFit: "cover", borderRadius: "12px" }}
                        />
                        <div>
                          <strong>{product.name}</strong>
                          <br />
                          <small style={{ color: "#aaa39a" }}>ID: {product.id}</small>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{product.category}</td>
                    <td style={tdStyle}>
                      <strong>{formatCurrency(product.price)}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>Old: {formatCurrency(product.oldPrice || product.price)}</small>
                    </td>
                    <td style={tdStyle}>{product.stock}</td>
                    <td style={tdStyle}>{product.tag || "Product"}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "grid", gap: "8px" }}>
                        <button className="secondary-btn" onClick={() => startEditProduct(product)}>
                          Edit
                        </button>
                        <button className="secondary-btn" onClick={() => deleteAdminProduct(product)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {adminTab === "orders" && (
        <section style={panelStyle}>
          <span className="eyebrow">Orders</span>
          <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>Customer Orders</h2>

          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Order</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan="7">
                      No orders yet. Place a demo order from the cart.
                    </td>
                  </tr>
                )}

                {adminOrders.map((order) => (
                  <tr key={order._id || order.id}>
                    <td style={tdStyle}>
                      <strong>#{order.id}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date"}
                      </small>
                    </td>
                    <td style={tdStyle}>
                      <strong>{order.customerName}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>{order.email}</small>
                      <br />
                      <small style={{ color: "#aaa39a" }}>Phone: {order.phone || "Not available"}</small>
                    </td>
                    <td style={tdStyle}>
                      {(order.items || []).map((item) => (
                        <div key={`${order.id}-${item.name}`}>
                          {item.name} × {item.quantity || 1}
                        </div>
                      ))}
                    </td>
                    <td style={tdStyle}>
                      <strong>{formatCurrency(order.finalAmount || order.totalAmount || 0)}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>Discount: {formatCurrency(order.discountAmount || 0)}</small>
                    </td>
                    <td style={tdStyle}>
                      <strong>{order.paymentStatus || "Pending"}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>{order.paymentMethod || "Not updated"}</small>
                    </td>
                    <td style={tdStyle}>{order.status || "Order Placed"}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "grid", gap: "8px" }}>
                        <button className="secondary-btn" onClick={() => updateOrderStatus(order.id, "Processing", "Paid")}>
                          Mark Paid
                        </button>
                        <button className="secondary-btn" onClick={() => updateOrderStatus(order.id, "Shipped", "Paid")}>
                          Mark Shipped
                        </button>
                        <button className="secondary-btn" onClick={() => updateOrderStatus(order.id, "Delivered", "Paid")}>
                          Delivered
                        </button>
                        <button className="secondary-btn" onClick={() => openInvoice(order)}>
                          View Invoice
                        </button>
                        <button className="primary-btn" onClick={() => openAdminWhatsAppUpdate(order.id)}>
                          Open WhatsApp Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {adminTab === "returns" && (
        <section style={panelStyle}>
          <span className="eyebrow">Returns</span>
          <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>Return / Exchange Requests</h2>

          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Request</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Reason</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {adminReturns.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan="7">
                      No return or exchange requests yet.
                    </td>
                  </tr>
                )}

                {adminReturns.map((request) => (
                  <tr key={request._id || request.id}>
                    <td style={tdStyle}>#{request.id}</td>
                    <td style={tdStyle}>
                      <strong>{request.customerName}</strong>
                      <br />
                      <small style={{ color: "#aaa39a" }}>{request.email}</small>
                    </td>
                    <td style={tdStyle}>
                      {request.productName || "Not specified"}
                      <br />
                      <small style={{ color: "#aaa39a" }}>Size: {request.size || "N/A"}</small>
                    </td>
                    <td style={tdStyle}>{request.requestType}</td>
                    <td style={tdStyle}>{request.reason}</td>
                    <td style={tdStyle}>
                      {request.status}
                      <br />
                      <small style={{ color: "#aaa39a" }}>Pickup: {request.pickupStatus}</small>
                      <br />
                      <small style={{ color: "#aaa39a" }}>Refund: {request.refundStatus}</small>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "grid", gap: "8px" }}>
                        <button
                          className="secondary-btn"
                          onClick={() => updateReturnStatus(request.id, "Approved", "Pickup Scheduled", request.refundStatus || "Not Started")}
                        >
                          Approve
                        </button>
                        <button
                          className="secondary-btn"
                          onClick={() => updateReturnStatus(request.id, "Rejected", request.pickupStatus || "Not Scheduled", "Not Applicable")}
                        >
                          Reject
                        </button>
                        <button
                          className="secondary-btn"
                          onClick={() => updateReturnStatus(request.id, request.status || "Approved", "Picked Up", "Refund Processing")}
                        >
                          Picked Up
                        </button>
                        <button
                          className="secondary-btn"
                          onClick={() => updateReturnStatus(request.id, request.status || "Completed", request.pickupStatus || "Picked Up", "Refund Completed")}
                        >
                          Refund Done
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

function AdminDemoGuide({ adminSummary, adminOrders, adminReturns, backendProducts, loadAdminDashboard }) {
  const orders = Array.isArray(adminOrders) ? adminOrders : [];
  const returns = Array.isArray(adminReturns) ? adminReturns : [];
  const products = Array.isArray(backendProducts) ? backendProducts : [];

  const hasOrders = orders.length > 0;
  const hasProducts = products.length > 0;
  const hasReturns = returns.length > 0;

  const demoSteps = [
    {
      title: "Start with the customer storefront",
      text: "Open Home and explain Turtle Mod as a premium streetwear storefront with product discovery, product preview, complete-the-look styling, cart and coupons.",
      action: "Home → Shop → Product Preview",
    },
    {
      title: "Show checkout and order creation",
      text: "Add one or more products to cart, apply NEXA20 or STYLE10, and place a demo order. The order is saved to the backend and opens customer tracking.",
      action: "Cart → Place Demo Order",
    },
    {
      title: "Show customer order tracking",
      text: "Use the auto-filled Order ID and email to show payment status, order status, delivery timeline and ordered items.",
      action: "Track",
    },
    {
      title: "Show invoice generation",
      text: "Open the invoice from tracking or admin. Use the clean print window to save a professional A4 invoice PDF.",
      action: "Invoice → Print / Save",
    },
    {
      title: "Show return or exchange request",
      text: "From tracking, click Request Return / Exchange, enter a reason and submit. Then show how admin receives the request.",
      action: "Track → Return",
    },
    {
      title: "Show admin operations",
      text: "Login as admin, show Overview, Analytics, Product Management, Orders, WhatsApp update, Returns and approval workflow.",
      action: "Admin",
    },
  ];

  const clientTalkingPoints = [
    "This is not just a normal fashion website; it includes storefront, admin operations, order tracking, invoice, WhatsApp updates, returns and analytics.",
    "The platform can be sold to boutique fashion brands, streetwear sellers, Instagram stores and small clothing businesses.",
    "Admin can add products, manage orders, track revenue, handle returns and generate customer updates without needing technical knowledge.",
    "The system is ready to connect with real payment gateway, shipping partner, WhatsApp Business API and production MongoDB.",
  ];

  const deploymentChecklist = [
    {
      title: "Frontend environment",
      text: "Set VITE_API_BASE_URL in Vercel to your Render backend URL.",
      status: "Required before public demo",
    },
    {
      title: "Backend environment",
      text: "Set MONGO_URI, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_TOKEN and FRONTEND_URL in Render.",
      status: "Required before public demo",
    },
    {
      title: "CORS check",
      text: "FRONTEND_URL must match the final Vercel domain so admin login and checkout will work.",
      status: "Important",
    },
    {
      title: "Invoice check",
      text: "When saving invoice PDF, turn off browser headers and footers for a clean client-ready PDF.",
      status: "Demo polish",
    },
    {
      title: "Sample data",
      text: "Add at least 3 MongoDB products and place 2 demo orders before showing the client.",
      status: "Recommended",
    },
  ];

  const emptyStateFixes = [
    {
      title: hasProducts ? "Products ready" : "Add MongoDB products",
      text: hasProducts
        ? `${products.length} backend product(s) are available.`
        : "Admin → Products currently has no MongoDB product. Add at least one product for a better live demo.",
    },
    {
      title: hasOrders ? "Orders ready" : "Place demo orders",
      text: hasOrders
        ? `${orders.length} order(s) are available for analytics and admin demo.`
        : "Place at least one demo order from the cart so tracking, invoice and analytics look active.",
    },
    {
      title: hasReturns ? "Returns ready" : "Submit return request",
      text: hasReturns
        ? `${returns.length} return/exchange request(s) are available.`
        : "Submit one return/exchange request from Track page to show admin return workflow.",
    },
  ];

  const panelStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    background: "#0b0b0b",
    padding: "24px",
  };

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    background: "#111",
    padding: "18px",
  };

  return (
    <section style={panelStyle}>
      <span className="eyebrow">Client Demo Guide</span>
      <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>
        How to present Turtle Mod professionally
      </h2>
      <p style={{ color: "#aaa39a", lineHeight: 1.7, marginTop: "10px" }}>
        Use this section as your live demo script. It helps you explain the product like a business solution, not only a website.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "22px",
        }}
      >
        <AdminMetricCard label="Demo Products" value={products.length} />
        <AdminMetricCard label="Demo Orders" value={orders.length} />
        <AdminMetricCard label="Return Requests" value={returns.length} />
        <AdminMetricCard label="Revenue" value={formatCurrency(adminSummary?.totalRevenue || 0)} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginTop: "18px",
        }}
      >
        <div style={cardStyle}>
          <span className="eyebrow">Login Details</span>
          <h3 style={{ marginBottom: "10px" }}>Admin Demo Access</h3>
          <div style={{ display: "grid", gap: "10px", color: "#aaa39a", lineHeight: 1.7 }}>
            <div>
              <strong style={{ color: "#f6f3ee" }}>Username:</strong> admin
            </div>
            <div>
              <strong style={{ color: "#f6f3ee" }}>Password:</strong> admin123
            </div>
            <div>
              <strong style={{ color: "#f6f3ee" }}>Customer Email:</strong> demo.customer@turtlemod.store
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <span className="eyebrow">Quick Refresh</span>
          <h3 style={{ marginBottom: "10px" }}>Before Client Demo</h3>
          <p style={{ color: "#aaa39a", lineHeight: 1.7 }}>
            Click refresh to pull latest products, orders, returns and dashboard metrics from backend before presenting.
          </p>
          <button className="primary-btn" onClick={loadAdminDashboard}>
            Refresh Demo Data
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: "18px" }}>
        <span className="eyebrow">Live Demo Flow</span>
        <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
          {demoSteps.map((step, index) => (
            <div
              key={step.title}
              style={{
                display: "grid",
                gridTemplateColumns: "42px 1fr",
                gap: "14px",
                alignItems: "start",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "14px",
                background: "#0b0b0b",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(215,180,106,0.16)",
                  color: "#d7b46a",
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <strong>{step.title}</strong>
                  <span
                    style={{
                      color: "#d7b46a",
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 800,
                    }}
                  >
                    {step.action}
                  </span>
                </div>
                <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: "8px 0 0" }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginTop: "18px",
        }}
      >
        <div style={cardStyle}>
          <span className="eyebrow">Client Pitch Points</span>
          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            {clientTalkingPoints.map((point, index) => (
              <div
                key={point}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: "12px",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(215,180,106,0.16)",
                    color: "#d7b46a",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: "12px",
                  }}
                >
                  {index + 1}
                </div>
                <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: 0 }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <span className="eyebrow">Demo Readiness</span>
          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            {emptyStateFixes.map((item) => (
              <div
                key={item.title}
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "14px",
                  background: "#0b0b0b",
                }}
              >
                <strong>{item.title}</strong>
                <p style={{ color: "#aaa39a", lineHeight: 1.6, margin: "8px 0 0" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: "18px" }}>
        <span className="eyebrow">Deployment Checklist</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            marginTop: "16px",
          }}
        >
          {deploymentChecklist.map((item) => (
            <div
              key={item.title}
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "14px",
                background: "#0b0b0b",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  color: "#d7b46a",
                  background: "rgba(215,180,106,0.12)",
                  border: "1px solid rgba(215,180,106,0.22)",
                  fontSize: "12px",
                  fontWeight: 800,
                  marginBottom: "10px",
                }}
              >
                {item.status}
              </span>
              <h3 style={{ margin: "0 0 8px" }}>{item.title}</h3>
              <p style={{ color: "#aaa39a", lineHeight: 1.65, margin: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function AdminAnalyticsDashboard({ adminSummary, adminOrders, adminReturns, backendProducts }) {
  const orders = Array.isArray(adminOrders) ? adminOrders : [];
  const returns = Array.isArray(adminReturns) ? adminReturns : [];
  const products = Array.isArray(backendProducts) ? backendProducts : [];

  const totalOrders = orders.length;
  const paidOrders = orders.filter((order) => String(order.paymentStatus || "").toLowerCase() === "paid").length;
  const pendingOrders = Math.max(totalOrders - paidOrders, 0);
  const deliveredOrders = orders.filter((order) => String(order.status || "").toLowerCase().includes("delivered")).length;
  const shippedOrders = orders.filter((order) => String(order.status || "").toLowerCase().includes("shipped")).length;
  const processingOrders = orders.filter((order) => String(order.status || "").toLowerCase().includes("processing")).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.finalAmount || order.totalAmount || 0),
    0
  );

  const paidRevenue = orders
    .filter((order) => String(order.paymentStatus || "").toLowerCase() === "paid")
    .reduce((sum, order) => sum + Number(order.finalAmount || order.totalAmount || 0), 0);

  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const productSales = new Map();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const name = item.name || "Unknown Product";
      const quantity = Number(item.quantity || 1);
      const revenue = Number(item.price || 0) * quantity;
      const existing = productSales.get(name) || {
        name,
        quantity: 0,
        revenue: 0,
      };

      productSales.set(name, {
        ...existing,
        quantity: existing.quantity + quantity,
        revenue: existing.revenue + revenue,
      });
    });
  });

  const bestSellingProducts = Array.from(productSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const inventoryWarnings = products
    .filter((product) => Number(product.stock || 0) <= 10)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 8);

  const returnTypeCounts = returns.reduce((result, request) => {
    const type = request.requestType || "Return";
    result[type] = (result[type] || 0) + 1;
    return result;
  }, {});

  const returnStatusCounts = returns.reduce((result, request) => {
    const status = request.status || "Pending";
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {});

  const statusCards = [
    { label: "Order Placed", value: orders.filter((order) => String(order.status || "").toLowerCase().includes("placed")).length },
    { label: "Processing", value: processingOrders },
    { label: "Shipped", value: shippedOrders },
    { label: "Delivered", value: deliveredOrders },
  ];

  const insightMessages = [];

  if (totalOrders === 0) {
    insightMessages.push("Place a demo order to activate revenue, product and customer analytics.");
  } else {
    insightMessages.push(`Average order value is ${formatCurrency(averageOrderValue)} based on ${totalOrders} order(s).`);
  }

  if (bestSellingProducts.length > 0) {
    insightMessages.push(`${bestSellingProducts[0].name} is currently the best-selling product by quantity.`);
  }

  if (inventoryWarnings.length > 0) {
    insightMessages.push(`${inventoryWarnings.length} product(s) are at or below 10 stock units and need attention.`);
  }

  if (returns.length > 0) {
    insightMessages.push(`${returns.length} return/exchange request(s) are available for admin review.`);
  }

  const panelStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    background: "#0b0b0b",
    padding: "24px",
  };

  const miniPanelStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    background: "#111",
    padding: "18px",
  };

  const tableWrapStyle = {
    overflowX: "auto",
    marginTop: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "14px",
    color: "#d7b46a",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  };

  const tdStyle = {
    padding: "14px",
    color: "#f6f3ee",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    verticalAlign: "top",
  };

  function ProgressBar({ label, value, total }) {
    const percentage = total > 0 ? Math.round((Number(value || 0) / total) * 100) : 0;

    return (
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", color: "#aaa39a" }}>
          <span>{label}</span>
          <strong style={{ color: "#f6f3ee" }}>{value}</strong>
        </div>

        <div
          style={{
            height: "10px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #d7b46a, #f6f3ee)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <section style={panelStyle}>
      <span className="eyebrow">Analytics</span>
      <h2 style={{ margin: 0, letterSpacing: "-0.05em" }}>
        Business performance dashboard
      </h2>
      <p style={{ color: "#aaa39a", lineHeight: 1.7, marginTop: "10px" }}>
        Live business insights calculated from orders, products, inventory and return requests.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "22px",
        }}
      >
        <AdminMetricCard label="Total Revenue" value={formatCurrency(adminSummary?.totalRevenue || totalRevenue)} />
        <AdminMetricCard label="Paid Revenue" value={formatCurrency(adminSummary?.paidRevenue || paidRevenue)} />
        <AdminMetricCard label="Avg Order Value" value={formatCurrency(averageOrderValue)} />
        <AdminMetricCard label="Paid Orders" value={`${paidOrders}/${totalOrders}`} />
        <AdminMetricCard label="Pending Orders" value={pendingOrders} />
        <AdminMetricCard label="Return Requests" value={returns.length} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginTop: "18px",
        }}
      >
        <div style={miniPanelStyle}>
          <span className="eyebrow">Order Status</span>
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            {statusCards.map((card) => (
              <ProgressBar key={card.label} label={card.label} value={card.value} total={Math.max(totalOrders, 1)} />
            ))}
          </div>
        </div>

        <div style={miniPanelStyle}>
          <span className="eyebrow">Return Mix</span>

          {returns.length === 0 && (
            <p style={{ color: "#aaa39a", lineHeight: 1.7 }}>
              No return or exchange requests yet.
            </p>
          )}

          {returns.length > 0 && (
            <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
              {Object.entries(returnTypeCounts).map(([type, count]) => (
                <ProgressBar key={type} label={type} value={count} total={returns.length} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginTop: "18px",
        }}
      >
        <div style={miniPanelStyle}>
          <span className="eyebrow">Best Sellers</span>

          {bestSellingProducts.length === 0 && (
            <p style={{ color: "#aaa39a", lineHeight: 1.7 }}>
              No product sales yet. Place demo orders to generate best-seller data.
            </p>
          )}

          {bestSellingProducts.length > 0 && (
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Qty</th>
                    <th style={thStyle}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellingProducts.map((product) => (
                    <tr key={product.name}>
                      <td style={tdStyle}>{product.name}</td>
                      <td style={tdStyle}>{product.quantity}</td>
                      <td style={tdStyle}>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={miniPanelStyle}>
          <span className="eyebrow">Inventory Warning</span>

          {inventoryWarnings.length === 0 && (
            <p style={{ color: "#aaa39a", lineHeight: 1.7 }}>
              No low-stock MongoDB products found. Products at 10 stock or below will appear here.
            </p>
          )}

          {inventoryWarnings.length > 0 && (
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryWarnings.map((product) => (
                    <tr key={product._id || product.id || product.name}>
                      <td style={tdStyle}>{product.name}</td>
                      <td style={tdStyle}>{product.category || "Streetwear"}</td>
                      <td style={tdStyle}>
                        <strong style={{ color: Number(product.stock || 0) <= 5 ? "#ffb86b" : "#f6f3ee" }}>
                          {product.stock || 0}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div style={{ ...miniPanelStyle, marginTop: "18px" }}>
        <span className="eyebrow">Business Insights</span>
        <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
          {insightMessages.map((message, index) => (
            <div
              key={message}
              style={{
                display: "grid",
                gridTemplateColumns: "38px 1fr",
                gap: "12px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(215,180,106,0.16)",
                  color: "#d7b46a",
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </div>
              <p style={{ color: "#aaa39a", lineHeight: 1.7, margin: 0 }}>
                {message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(returnStatusCounts).length > 0 && (
        <div style={{ ...miniPanelStyle, marginTop: "18px" }}>
          <span className="eyebrow">Return Status Summary</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            {Object.entries(returnStatusCounts).map(([status, count]) => (
              <div
                key={status}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "14px",
                  background: "#0b0b0b",
                }}
              >
                <span style={{ color: "#aaa39a", fontSize: "12px" }}>{status}</span>
                <strong style={{ display: "block", marginTop: "8px", fontSize: "24px" }}>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


function AdminInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label>
      <span style={{ display: "block", marginBottom: "8px", color: "#aaa39a", fontSize: "13px" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "14px 15px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "#050505",
          color: "#f6f3ee",
        }}
      />
    </label>
  );
}

function AdminMetricCard({ label, value }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", background: "#111", padding: "18px" }}>
      <span style={{ color: "#aaa39a", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </span>
      <strong style={{ display: "block", marginTop: "10px", fontSize: "28px", letterSpacing: "-0.04em" }}>
        {value}
      </strong>
    </div>
  );
}
