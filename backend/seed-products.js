const fs = require("fs");
const path = require("path");
const demoProducts = require("./data/demoProducts");

const dbPath = path.join(__dirname, "data", "db.json");

function readDb() {
  if (!fs.existsSync(dbPath)) {
    return {
      products: [],
      orders: [],
      users: [],
      coupons: []
    };
  }

  const raw = fs.readFileSync(dbPath, "utf-8");

  if (!raw.trim()) {
    return {
      products: [],
      orders: [],
      users: [],
      coupons: []
    };
  }

  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

function seedProducts() {
  const db = readDb();

  if (!Array.isArray(db.products)) {
    db.products = [];
  }

  if (!Array.isArray(db.coupons)) {
    db.coupons = [];
  }

  const existingProductKeys = new Set(
    db.products.map((product) =>
      String(product.id || product.name || "").toLowerCase()
    )
  );

  let addedCount = 0;
  let updatedCount = 0;

  demoProducts.forEach((demoProduct) => {
    const idKey = String(demoProduct.id).toLowerCase();
    const nameKey = String(demoProduct.name).toLowerCase();

    const existingIndex = db.products.findIndex((product) => {
      const currentId = String(product.id || "").toLowerCase();
      const currentName = String(product.name || "").toLowerCase();
      return currentId === idKey || currentName === nameKey;
    });

    if (existingIndex >= 0) {
      db.products[existingIndex] = {
        ...db.products[existingIndex],
        ...demoProduct,
        updatedAt: new Date().toISOString()
      };
      updatedCount++;
    } else {
      db.products.push({
        ...demoProduct,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      existingProductKeys.add(idKey);
      addedCount++;
    }
  });

  const demoCoupons = [
    {
      id: "COUPON-STYLENEXA20",
      code: "STYLENEXA20",
      type: "percentage",
      value: 20,
      minOrderValue: 999,
      maxDiscount: 1000,
      active: true,
      description: "Client demo coupon: 20% off on orders above ₹999"
    },
    {
      id: "COUPON-DROP10",
      code: "DROP10",
      type: "percentage",
      value: 10,
      minOrderValue: 499,
      maxDiscount: 500,
      active: true,
      description: "New drop coupon: 10% off on selected streetwear products"
    }
  ];

  demoCoupons.forEach((coupon) => {
    const existingCouponIndex = db.coupons.findIndex(
      (item) => String(item.code).toLowerCase() === String(coupon.code).toLowerCase()
    );

    if (existingCouponIndex >= 0) {
      db.coupons[existingCouponIndex] = {
        ...db.coupons[existingCouponIndex],
        ...coupon,
        updatedAt: new Date().toISOString()
      };
    } else {
      db.coupons.push({
        ...coupon,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  writeDb(db);

  console.log("✅ StyleNexa AI demo products seeded successfully.");
  console.log(`🛍️ Products added: ${addedCount}`);
  console.log(`♻️ Products updated: ${updatedCount}`);
  console.log("🎟️ Demo coupons ready: STYLENEXA20, DROP10");
}

seedProducts();