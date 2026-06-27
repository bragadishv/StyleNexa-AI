import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://style-nexa-ai.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const AI_DEMO_MODE = process.env.AI_DEMO_MODE === "true";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "stylenexa-demo-admin-token";

let ai = null;

if (
  GEMINI_API_KEY &&
  GEMINI_API_KEY !== "PASTE_YOUR_GEMINI_API_KEY_HERE"
) {
  ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });
}

const defaultProducts = [
  {
    id: 1,
    name: "Oversized Street Tee",
    category: "Streetwear",
    price: 1299,
    oldPrice: 1799,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    stock: 42,
    tag: "Best Seller",
    description:
      "A premium oversized streetwear tee designed for comfort, daily wear, and modern fashion styling.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Minimal Cotton Shirt",
    category: "Essentials",
    price: 1599,
    oldPrice: 2199,
    color: "White",
    sizes: ["M", "L", "XL"],
    stock: 35,
    tag: "New Drop",
    description:
      "A clean cotton shirt for premium casual and semi-formal fashion collections.",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Urban Cargo Pants",
    category: "Bottomwear",
    price: 1899,
    oldPrice: 2499,
    color: "Olive",
    sizes: ["S", "M", "L", "XL"],
    stock: 28,
    tag: "Trending",
    description:
      "Utility-inspired cargo pants built for streetwear looks, travel outfits, and daily comfort.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Premium Hoodie",
    category: "Winterwear",
    price: 2299,
    oldPrice: 2999,
    color: "Charcoal",
    sizes: ["M", "L", "XL"],
    stock: 22,
    tag: "Premium",
    description:
      "A soft premium hoodie created for winter drops, casual outfits, and fashion-forward comfort.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  },
];

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },
    stock: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      default: "New Product",
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Order Placed",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const returnRequestSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },
    productName: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    requestType: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending Admin Review",
    },
    pickupStatus: {
      type: String,
      default: "Not Scheduled",
    },
    refundStatus: {
      type: String,
      default: "Not Started",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);

async function connectDatabase() {
  if (!MONGO_URI || MONGO_URI.includes("PASTE_YOUR")) {
    throw new Error("MONGO_URI is missing or not updated in .env file.");
  }

  await mongoose.connect(MONGO_URI, {
    dbName: "stylenexa_ai",
    authSource: "admin",
    serverSelectionTimeoutMS: 15000,
  });

  console.log("✅ MongoDB Atlas connected successfully");

  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    await Product.insertMany(defaultProducts);
    console.log("✅ Default StyleNexa products added to MongoDB");
  }
}

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({
      success: false,
      message: "Admin access required. Please login again.",
    });
  }

  next();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getNextId(Model) {
  const latestItem = await Model.findOne().sort({ id: -1 }).lean();
  return latestItem && latestItem.id ? latestItem.id + 1 : 1;
}

function buildOrderTimeline(status) {
  const currentStatus = String(status || "Order Placed").toLowerCase();

  const steps = [
    {
      key: "order placed",
      label: "Order Placed",
      description: "Your order has been received by StyleNexa AI.",
    },
    {
      key: "processing",
      label: "Processing",
      description: "Your order is being packed and prepared.",
    },
    {
      key: "shipped",
      label: "Shipped",
      description: "Your order has been shipped from our warehouse.",
    },
    {
      key: "out for delivery",
      label: "Out for Delivery",
      description: "Your order is on the way to your address.",
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Your order has been delivered successfully.",
    },
  ];

  const statusIndexMap = {
    "order placed": 0,
    placed: 0,
    pending: 0,
    processing: 1,
    packed: 1,
    shipped: 2,
    dispatched: 2,
    "out for delivery": 3,
    delivered: 4,
    completed: 4,
  };

  const currentIndex = statusIndexMap[currentStatus] ?? 0;

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    active: index === currentIndex,
  }));
}

async function buildProductContext() {
  const products = await Product.find().sort({ id: 1 }).lean();

  return products
    .map(
      (product) =>
        `${product.name} | Category: ${product.category} | Price: ₹${
          product.price
        } | Color: ${product.color} | Sizes: ${(product.sizes || []).join(
          ", "
        )} | Description: ${product.description}`
    )
    .join("\n");
}

function generateDemoReply(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes("product description") ||
    lowerPrompt.includes("fashion e-commerce copywriter")
  ) {
    return {
      success: true,
      reply:
        "Premium Product Description:\nA modern clothing essential designed for everyday comfort, clean styling, and premium fashion appeal.\n\nSelling Points:\n• Soft and comfortable fabric feel\n• Easy to style for casual and streetwear looks\n• Designed for modern fashion customers\n\nTagline:\nStyle that feels effortless.",
    };
  }

  if (
    lowerPrompt.includes("size guide") ||
    lowerPrompt.includes("height") ||
    lowerPrompt.includes("weight") ||
    lowerPrompt.includes("preferred fit")
  ) {
    return {
      success: true,
      reply:
        "Based on the details shared, size L may be a good approximate choice for a relaxed fit. For a regular fit, size M can also be considered. Final fit may vary depending on fabric, brand pattern, and personal preference.",
    };
  }

  return {
    success: true,
    reply:
      "For a clean streetwear look, try the Oversized Street Tee with Urban Cargo Pants. Add the Premium Hoodie for a layered outfit. Choose neutral colors like black, white, olive, or charcoal for a premium fashion style.",
  };
}

async function generateGeminiReply(prompt) {
  if (AI_DEMO_MODE) {
    return generateDemoReply(prompt);
  }

  if (!ai) {
    return generateDemoReply(prompt);
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    return {
      success: true,
      reply:
        response.text ||
        "AI generated a response, but the response text was empty.",
    };
  } catch (error) {
    console.error("Gemini error:", error.message);

    const errorMessage = error.message.toLowerCase();

    const isQuotaIssue =
      error.message.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("resource_exhausted") ||
      errorMessage.includes("rate") ||
      errorMessage.includes("limit");

    if (isQuotaIssue) {
      return generateDemoReply(prompt);
    }

    return {
      success: false,
      reply:
        "Gemini AI is currently unavailable. Demo AI fallback is ready, but please check API key, model access, or internet connection.",
    };
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "StyleNexa AI Backend is running successfully 🚀",
    project: "StyleNexa AI",
    version: "1.1.0",
    database: "MongoDB Atlas connected",
    geminiConfigured: Boolean(ai),
    aiDemoMode: AI_DEMO_MODE,
    geminiModel: GEMINI_MODEL,
    adminAuth: "Enabled",
    newFeatures: [
      "Public order tracking",
      "Customer dashboard",
      "Customer order history",
      "Customer return history",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend health check passed",
    database: "MongoDB Atlas connected",
    geminiConfigured: Boolean(ai),
    aiDemoMode: AI_DEMO_MODE,
    geminiModel: GEMINI_MODEL,
    adminAuth: "Enabled",
    version: "1.1.0",
  });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin username or password.",
    });
  }

  res.json({
    success: true,
    message: "Admin login successful.",
    token: ADMIN_TOKEN,
    admin: {
      username: ADMIN_USERNAME,
      role: "StyleNexa Admin",
    },
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 }).lean();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findOne({ id: productId }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Fetch product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product.",
    });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, email, phone, items, totalAmount, address } = req.body;

    if (!customerName || !email || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer name, email, and cart items are required.",
      });
    }

    const newOrder = await Order.create({
      id: await getNextId(Order),
      customerName,
      email: normalizeEmail(email),
      phone: phone || "",
      items,
      totalAmount: Number(totalAmount || 0),
      address: address || "",
      status: "Order Placed",
      paymentStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: newOrder,
      trackingHint:
        "Use your Order ID and email address to track this order anytime.",
    });
  } catch (error) {
    console.error("Place order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to place order.",
    });
  }
});

app.get("/api/orders/track", async (req, res) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({
        success: false,
        message: "Order ID and email are required for tracking.",
      });
    }

    const numericOrderId = Number(orderId);

    if (Number.isNaN(numericOrderId)) {
      return res.status(400).json({
        success: false,
        message: "Order ID must be a valid number.",
      });
    }

    const emailRegex = new RegExp(`^${escapeRegex(normalizeEmail(email))}$`, "i");

    const order = await Order.findOne({
      id: numericOrderId,
      email: emailRegex,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "No order found with this Order ID and email. Please check your details.",
      });
    }

    res.json({
      success: true,
      order,
      tracking: {
        orderId: order.id,
        customerName: order.customerName,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        timeline: buildOrderTimeline(order.status),
      },
    });
  } catch (error) {
    console.error("Order tracking error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to track order.",
    });
  }
});

app.get("/api/customer/dashboard", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to load customer dashboard.",
      });
    }

    const cleanEmail = normalizeEmail(email);
    const emailRegex = new RegExp(`^${escapeRegex(cleanEmail)}$`, "i");

    const orders = await Order.find({
      email: emailRegex,
    })
      .sort({ id: -1 })
      .lean();

    const returnRequests = await ReturnRequest.find({
      email: emailRegex,
    })
      .sort({ id: -1 })
      .lean();

    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const activeOrders = orders.filter(
      (order) =>
        !["delivered", "completed", "cancelled"].includes(
          String(order.status || "").toLowerCase()
        )
    ).length;

    const recentProducts = await Product.find().sort({ id: 1 }).limit(4).lean();

    res.json({
      success: true,
      customer: {
        email: cleanEmail,
        totalOrders: orders.length,
        activeOrders,
        totalSpent,
        totalReturnRequests: returnRequests.length,
      },
      orders,
      returnRequests,
      recommendedProducts: recentProducts,
    });
  } catch (error) {
    console.error("Customer dashboard error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load customer dashboard.",
    });
  }
});

app.post("/api/returns", async (req, res) => {
  try {
    const {
      orderId,
      customerName,
      email,
      reason,
      requestType,
      productName,
      size,
    } = req.body;

    if (!orderId || !customerName || !reason || !requestType) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID, customer name, reason, and request type are required.",
      });
    }

    const newRequest = await ReturnRequest.create({
      id: await getNextId(ReturnRequest),
      orderId,
      customerName,
      email: normalizeEmail(email),
      productName: productName || "",
      size: size || "",
      requestType,
      reason,
      status: "Pending Admin Review",
      pickupStatus: "Not Scheduled",
      refundStatus: "Not Started",
    });

    res.status(201).json({
      success: true,
      message: "Return/exchange request created successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Return request error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to create return request.",
    });
  }
});

app.get("/api/admin/summary", authenticateAdmin, async (req, res) => {
  try {
    const products = await Product.find().lean();
    const orders = await Order.find().lean();
    const returnRequests = await ReturnRequest.find().lean();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const totalInventory = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0
    );

    res.json({
      success: true,
      summary: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalInventory,
        totalReturnRequests: returnRequests.length,
        pendingReturns: returnRequests.filter(
          (request) => request.status === "Pending Admin Review"
        ).length,
      },
    });
  } catch (error) {
    console.error("Admin summary error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch admin summary.",
    });
  }
});

app.get("/api/orders", authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ id: -1 }).lean();

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});

app.get("/api/returns", authenticateAdmin, async (req, res) => {
  try {
    const requests = await ReturnRequest.find().sort({ id: -1 }).lean();

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Fetch returns error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch return requests.",
    });
  }
});

app.post("/api/admin/products", authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      oldPrice,
      color,
      sizes,
      stock,
      tag,
      description,
      image,
    } = req.body;

    if (!name || !category || !price || !color || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, price, color, and description are required to add a product.",
      });
    }

    const newProduct = await Product.create({
      id: await getNextId(Product),
      name,
      category,
      price: Number(price),
      oldPrice: Number(oldPrice || price),
      color,
      sizes:
        typeof sizes === "string"
          ? sizes.split(",").map((size) => size.trim())
          : sizes || ["S", "M", "L", "XL"],
      stock: Number(stock || 0),
      tag: tag || "New Product",
      description,
      image:
        image ||
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to add product.",
    });
  }
});

app.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const existingProduct = await Product.findOne({ id: productId });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (req.body.price !== undefined) {
      updateData.price = Number(req.body.price);
    }

    if (req.body.oldPrice !== undefined) {
      updateData.oldPrice = Number(req.body.oldPrice);
    }

    if (req.body.stock !== undefined) {
      updateData.stock = Number(req.body.stock);
    }

    if (typeof req.body.sizes === "string") {
      updateData.sizes = req.body.sizes.split(",").map((size) => size.trim());
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update product.",
    });
  }
});

app.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const deletedProduct = await Product.findOneAndDelete({ id: productId });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
});

app.put("/api/admin/orders/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, paymentStatus } = req.body;

    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (status) {
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
});

app.put("/api/admin/returns/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { status, pickupStatus, refundStatus } = req.body;

    const request = await ReturnRequest.findOne({ id: requestId });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Return/exchange request not found.",
      });
    }

    if (status) {
      request.status = status;
    }

    if (pickupStatus) {
      request.pickupStatus = pickupStatus;
    }

    if (refundStatus) {
      request.refundStatus = refundStatus;
    }

    await request.save();

    res.json({
      success: true,
      message: "Return/exchange status updated successfully.",
      request,
    });
  } catch (error) {
    console.error("Update return error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update return status.",
    });
  }
});

app.post("/api/ai/stylist", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Customer message is required.",
      });
    }

    const productContext = await buildProductContext();

    const prompt = `
You are StyleNexa AI, a premium fashion shopping assistant for an online clothing brand.

Available products:
${productContext}

Customer message:
"${message}"

Your task:
1. Suggest a suitable outfit using only the available products.
2. Recommend size only when the customer asks about fit or size.
3. Keep the answer short, stylish, and customer-friendly.
4. Mention product names clearly.
5. Do not invent products that are not available.

Reply in 4 to 6 lines.
`;

    const result = await generateGeminiReply(prompt);

    res.json({
      success: result.success,
      reply: result.reply,
      demoMode: AI_DEMO_MODE,
    });
  } catch (error) {
    console.error("AI stylist error:", error.message);

    res.status(500).json({
      success: false,
      reply: "Unable to generate AI stylist response.",
    });
  }
});

app.post("/api/ai/product-description", async (req, res) => {
  try {
    const { productName, category, color, targetAudience } = req.body;

    if (!productName || !category) {
      return res.status(400).json({
        success: false,
        message: "Product name and category are required.",
      });
    }

    const prompt = `
You are an expert fashion e-commerce copywriter.

Create a premium product description for this clothing product.

Product name: ${productName}
Category: ${category}
Color: ${color || "Not specified"}
Target audience: ${targetAudience || "Modern fashion customers"}

Write:
1. A short premium product description.
2. Three selling points.
3. A short marketing tagline.

Keep it professional and useful for an e-commerce website.
`;

    const result = await generateGeminiReply(prompt);

    res.json({
      success: result.success,
      description: result.reply,
      demoMode: AI_DEMO_MODE,
    });
  } catch (error) {
    console.error("Product description AI error:", error.message);

    res.status(500).json({
      success: false,
      description: "Unable to generate product description.",
    });
  }
});

app.post("/api/ai/size-guide", async (req, res) => {
  try {
    const { height, weight, preferredFit, productName } = req.body;

    if (!height || !weight || !preferredFit) {
      return res.status(400).json({
        success: false,
        message: "Height, weight, and preferred fit are required.",
      });
    }

    const prompt = `
You are StyleNexa AI size guide assistant.

Customer details:
Height: ${height}
Weight: ${weight}
Preferred fit: ${preferredFit}
Product: ${productName || "General clothing product"}

Available sizes: S, M, L, XL

Suggest a size in a careful and non-judgmental way.
Avoid body comments.
Mention that this is an approximate recommendation and final fit can vary by brand and fabric.
Keep it short.
`;

    const result = await generateGeminiReply(prompt);

    res.json({
      success: result.success,
      recommendation: result.reply,
      demoMode: AI_DEMO_MODE,
    });
  } catch (error) {
    console.error("Size guide AI error:", error.message);

    res.status(500).json({
      success: false,
      recommendation: "Unable to generate size recommendation.",
    });
  }
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 StyleNexa AI Backend running on http://localhost:${PORT}`);
      console.log("💾 Database: MongoDB Atlas");
      console.log("🔐 Admin Login Enabled");
      console.log(`👤 Admin Username: ${ADMIN_USERNAME}`);
      console.log(`🤖 AI Demo Mode: ${AI_DEMO_MODE ? "ON" : "OFF"}`);
      console.log(`🧠 Gemini Model: ${GEMINI_MODEL}`);
      console.log("🧾 Order Tracking: Enabled");
      console.log("👤 Customer Dashboard: Enabled");
      console.log(
        ai
          ? "✅ Gemini AI configured successfully"
          : "⚠️ Gemini API key missing or placeholder used. Demo fallback is active."
      );
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start backend:", error.message);
    process.exit(1);
  });