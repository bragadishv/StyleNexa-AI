const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dbPath = path.join(__dirname, "..", "data", "db.json");

function getDefaultDb() {
  return {
    products: [],
    orders: [],
    users: [],
    coupons: []
  };
}

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return getDefaultDb();
    }

    const rawData = fs.readFileSync(dbPath, "utf-8");

    if (!rawData.trim()) {
      return getDefaultDb();
    }

    const parsedDb = JSON.parse(rawData);

    return {
      ...getDefaultDb(),
      ...parsedDb,
      products: Array.isArray(parsedDb.products) ? parsedDb.products : [],
      orders: Array.isArray(parsedDb.orders) ? parsedDb.orders : [],
      users: Array.isArray(parsedDb.users) ? parsedDb.users : [],
      coupons: Array.isArray(parsedDb.coupons) ? parsedDb.coupons : []
    };
  } catch (error) {
    console.error("❌ Failed to read database:", error.message);
    return getDefaultDb();
  }
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

function createOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SNX-${datePart}-${randomPart}`;
}

function calculateOrderTotals(items, coupon) {
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price || item.discountPrice || item.salePrice || 0);
    const quantity = Number(item.quantity || 1);
    return sum + price * quantity;
  }, 0);

  let discount = 0;

  if (coupon && coupon.code === "STYLENEXA20") {
    discount = Math.min(Math.round(subtotal * 0.2), 1000);
  }

  if (coupon && coupon.code === "DROP10") {
    discount = Math.min(Math.round(subtotal * 0.1), 500);
  }

  const total = Math.max(subtotal - discount, 0);

  return {
    subtotal,
    discount,
    total
  };
}

router.get("/", (req, res) => {
  const db = readDb();

  const sortedOrders = [...db.orders].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  res.json({
    success: true,
    count: sortedOrders.length,
    orders: sortedOrders
  });
});

router.post("/", (req, res) => {
  try {
    const db = readDb();

    const {
      items = [],
      customer = {},
      coupon = null,
      paymentMethod = "Demo Checkout",
      source = "StyleNexa AI Frontend"
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be created without cart items."
      });
    }

    const normalizedItems = items.map((item) => {
      const price = Number(
        item.discountPrice || item.salePrice || item.price || item.unitPrice || 0
      );

      const quantity = Number(item.quantity || 1);

      return {
        productId: item._id || item.id || item.productId || item.name,
        name: item.name || "StyleNexa Product",
        category: item.category || "Streetwear",
        image: item.image || item.imageUrl || "",
        size: item.selectedSize || item.size || "M",
        color: item.selectedColor || item.color || "Default",
        price,
        quantity,
        lineTotal: price * quantity
      };
    });

    const totals = calculateOrderTotals(normalizedItems, coupon);

    const newOrder = {
      id: createOrderNumber(),
      orderNumber: createOrderNumber(),
      customer: {
        name: customer.name || "Demo Customer",
        email: customer.email || "demo.customer@stylenexa.ai",
        phone: customer.phone || "9999999999",
        city: customer.city || "Chennai",
        address:
          customer.address ||
          "Demo checkout address, Chennai, Tamil Nadu, India"
      },
      items: normalizedItems,
      coupon: coupon
        ? {
            code: coupon.code,
            value: coupon.value || 0
          }
        : null,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      status: "Placed",
      paymentStatus: "Demo Paid",
      paymentMethod,
      source,
      timeline: [
        {
          status: "Placed",
          note: "Demo order created successfully from customer frontend.",
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: newOrder
    });
  } catch (error) {
    console.error("❌ Order creation failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message
    });
  }
});

router.get("/:orderId", (req, res) => {
  const db = readDb();

  const order = db.orders.find((item) => {
    return item.id === req.params.orderId || item.orderNumber === req.params.orderId;
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  res.json({
    success: true,
    order
  });
});

router.patch("/:orderId/status", (req, res) => {
  try {
    const db = readDb();
    const { status = "Processing", note = "" } = req.body;

    const orderIndex = db.orders.findIndex((item) => {
      return item.id === req.params.orderId || item.orderNumber === req.params.orderId;
    });

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    db.orders[orderIndex] = {
      ...db.orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...(db.orders[orderIndex].timeline || []),
        {
          status,
          note: note || `Order status changed to ${status}.`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    writeDb(db);

    res.json({
      success: true,
      message: "Order status updated successfully.",
      order: db.orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: error.message
    });
  }
});

module.exports = router;