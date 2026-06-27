import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FALLBACK_PRODUCTS = [
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
      "A premium oversized streetwear tee designed for comfort and modern fashion styling.",
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
      "Utility-inspired cargo pants built for streetwear looks and daily comfort.",
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
      "A soft premium hoodie created for winter drops and fashion-forward comfort.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  },
];

const COLLECTIONS = [
  "New Arrivals",
  "Streetwear",
  "Essentials",
  "Winter Drop",
  "Premium Basics",
];

function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [apiStatus, setApiStatus] = useState("Checking backend...");
  const [adminSummary, setAdminSummary] = useState(null);

  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("stylenexaAdminToken") || ""
  );
  const [adminUser, setAdminUser] = useState(
    localStorage.getItem("stylenexaAdminUser") || ""
  );
  const [adminLoginForm, setAdminLoginForm] = useState({
    username: "",
    password: "",
  });
  const [adminLoginMessage, setAdminLoginMessage] = useState("");

  const [aiMessage, setAiMessage] = useState(
    "I need a casual outfit for weekend travel."
  );
  const [aiReply, setAiReply] = useState(
    "Try the Oversized Street Tee with Urban Cargo Pants. Choose size L for relaxed fit and pair it with white sneakers."
  );
  const [aiLoading, setAiLoading] = useState(false);

  const [descriptionForm, setDescriptionForm] = useState({
    productName: "Oversized Street Tee",
    category: "Streetwear",
    color: "Black",
    targetAudience: "College students and young fashion customers",
  });
  const [productDescription, setProductDescription] = useState("");
  const [descriptionLoading, setDescriptionLoading] = useState(false);

  const [sizeGuideForm, setSizeGuideForm] = useState({
    height: "",
    weight: "",
    preferredFit: "Relaxed fit",
    productName: "Oversized Street Tee",
  });
  const [sizeRecommendation, setSizeRecommendation] = useState("");
  const [sizeLoading, setSizeLoading] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [returnForm, setReturnForm] = useState({
    orderId: "",
    customerName: "",
    productName: "",
    size: "",
    requestType: "Exchange",
    reason: "",
  });

  const [adminProductForm, setAdminProductForm] = useState({
    name: "",
    category: "Streetwear",
    price: "",
    oldPrice: "",
    color: "",
    sizes: "S,M,L,XL",
    stock: "",
    tag: "New Launch",
    description: "",
    image: "",
  });

  const [orderMessage, setOrderMessage] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const isAdminLoggedIn = Boolean(adminToken);

  useEffect(() => {
    checkBackend();
    fetchProducts();

    if (adminToken) {
      refreshAdminData(adminToken);
    }
  }, [adminToken]);

  const getAdminHeaders = (token = adminToken) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const handleUnauthorizedAdmin = () => {
    localStorage.removeItem("stylenexaAdminToken");
    localStorage.removeItem("stylenexaAdminUser");
    setAdminToken("");
    setAdminUser("");
    setAdminSummary(null);
    setOrders([]);
    setReturnRequests([]);
    setAdminLoginMessage("Admin session expired. Please login again.");
  };

  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();

      if (data.status === "OK") {
        setApiStatus(
          data.aiDemoMode
            ? "Backend connected · AI Demo Mode ON"
            : "Backend + Gemini AI connected successfully"
        );
      } else {
        setApiStatus("Backend response received");
      }
    } catch {
      setApiStatus("Backend not connected. Showing demo fallback data.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();

      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    }
  };

  const refreshAdminData = async (token = adminToken) => {
    if (!token) return;

    await Promise.all([
      fetchAdminSummary(token),
      fetchOrders(token),
      fetchReturnRequests(token),
    ]);
  };

  const refreshAllData = async () => {
    await fetchProducts();

    if (adminToken) {
      await refreshAdminData(adminToken);
    }
  };

  const fetchAdminSummary = async (token = adminToken) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/summary`, {
        headers: getAdminHeaders(token),
      });

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setAdminSummary(data.summary);
      }
    } catch {
      setAdminSummary(null);
    }
  };

  const fetchOrders = async (token = adminToken) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: getAdminHeaders(token),
      });

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch {
      setOrders([]);
    }
  };

  const fetchReturnRequests = async (token = adminToken) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/returns`, {
        headers: getAdminHeaders(token),
      });

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setReturnRequests(data.requests);
      }
    } catch {
      setReturnRequests([]);
    }
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory, products]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => {
    setCart((currentCart) => [
      ...currentCart,
      {
        ...product,
        selectedSize,
      },
    ]);
  };

  const clearCart = () => {
    setCart([]);
    setOrderMessage("");
  };

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutForm((current) => ({ ...current, [name]: value }));
  };

  const handleReturnChange = (event) => {
    const { name, value } = event.target;
    setReturnForm((current) => ({ ...current, [name]: value }));
  };

  const handleDescriptionChange = (event) => {
    const { name, value } = event.target;
    setDescriptionForm((current) => ({ ...current, [name]: value }));
  };

  const handleSizeGuideChange = (event) => {
    const { name, value } = event.target;
    setSizeGuideForm((current) => ({ ...current, [name]: value }));
  };

  const handleAdminProductChange = (event) => {
    const { name, value } = event.target;
    setAdminProductForm((current) => ({ ...current, [name]: value }));
  };

  const handleAdminLoginChange = (event) => {
    const { name, value } = event.target;
    setAdminLoginForm((current) => ({ ...current, [name]: value }));
  };

  const loginAdmin = async (event) => {
    event.preventDefault();
    setAdminLoginMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminLoginForm),
      });

      const data = await response.json();

      if (!data.success) {
        setAdminLoginMessage(data.message || "Admin login failed.");
        return;
      }

      localStorage.setItem("stylenexaAdminToken", data.token);
      localStorage.setItem("stylenexaAdminUser", data.admin.username);

      setAdminToken(data.token);
      setAdminUser(data.admin.username);
      setAdminLoginForm({
        username: "",
        password: "",
      });
      setAdminLoginMessage("Admin login successful.");
      await refreshAdminData(data.token);
    } catch {
      setAdminLoginMessage("Unable to login. Please check backend.");
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("stylenexaAdminToken");
    localStorage.removeItem("stylenexaAdminUser");

    setAdminToken("");
    setAdminUser("");
    setAdminSummary(null);
    setOrders([]);
    setReturnRequests([]);
    setAdminMessage("");
    setAdminLoginMessage("Admin logged out successfully.");
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    setOrderMessage("");

    if (cart.length === 0) {
      setOrderMessage("Please add at least one product to cart.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutForm,
          items: cart,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setOrderMessage(data.message || "Order failed. Please try again.");
        return;
      }

      setOrderMessage(`Order placed successfully. Order ID: ${data.order.id}`);
      setCart([]);
      setCheckoutForm({
        customerName: "",
        email: "",
        phone: "",
        address: "",
      });
      refreshAllData();
    } catch {
      setOrderMessage("Unable to place order. Please check backend.");
    }
  };

  const submitReturnRequest = async (event) => {
    event.preventDefault();
    setReturnMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/returns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnForm),
      });

      const data = await response.json();

      if (!data.success) {
        setReturnMessage(data.message || "Request failed. Please try again.");
        return;
      }

      setReturnMessage(
        `Return/exchange request created successfully. Request ID: ${data.request.id}`
      );

      setReturnForm({
        orderId: "",
        customerName: "",
        productName: "",
        size: "",
        requestType: "Exchange",
        reason: "",
      });

      refreshAllData();
    } catch {
      setReturnMessage("Unable to create request. Please check backend.");
    }
  };

  const askAiStylist = async () => {
    setAiLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/stylist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: aiMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setAiReply(data.reply);
      } else {
        setAiReply(data.reply || "AI stylist could not respond.");
      }
    } catch {
      setAiReply(
        "Backend is not connected. Demo suggestion: Try the Oversized Street Tee with Urban Cargo Pants for a premium casual look."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const generateProductDescription = async (event) => {
    event.preventDefault();
    setDescriptionLoading(true);
    setProductDescription("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/product-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(descriptionForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        setProductDescription(data.description);
      } else {
        setProductDescription(
          data.message || data.description || "Unable to generate description."
        );
      }
    } catch {
      setProductDescription("Please check backend connection and Gemini API.");
    } finally {
      setDescriptionLoading(false);
    }
  };

  const generateSizeGuide = async (event) => {
    event.preventDefault();
    setSizeLoading(true);
    setSizeRecommendation("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/size-guide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sizeGuideForm),
      });

      const data = await response.json();

      if (data.success) {
        setSizeRecommendation(data.recommendation);
      } else {
        setSizeRecommendation(
          data.message || data.recommendation || "Unable to generate size guide."
        );
      }
    } catch {
      setSizeRecommendation("Please check backend connection and Gemini API.");
    } finally {
      setSizeLoading(false);
    }
  };

  const addAdminProduct = async (event) => {
    event.preventDefault();
    setAdminMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(adminProductForm),
      });

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setAdminMessage(data.message || "Unable to add product.");
        return;
      }

      setAdminMessage(`Product added successfully: ${data.product.name}`);

      setAdminProductForm({
        name: "",
        category: "Streetwear",
        price: "",
        oldPrice: "",
        color: "",
        sizes: "S,M,L,XL",
        stock: "",
        tag: "New Launch",
        description: "",
        image: "",
      });

      refreshAllData();
    } catch {
      setAdminMessage("Unable to add product. Please check backend.");
    }
  };

  const deleteProduct = async (productId) => {
    setAdminMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: getAdminHeaders(),
        }
      );

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setAdminMessage(data.message || "Unable to delete product.");
        return;
      }

      setAdminMessage("Product deleted successfully.");
      refreshAllData();
    } catch {
      setAdminMessage("Unable to delete product. Please check backend.");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: getAdminHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      refreshAllData();
    } catch {
      setAdminMessage("Unable to update order status.");
    }
  };

  const updateReturnStatus = async (requestId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/returns/${requestId}/status`,
        {
          method: "PUT",
          headers: getAdminHeaders(),
          body: JSON.stringify({
            status,
            pickupStatus:
              status === "Approved" ? "Pickup Scheduled" : "Not Scheduled",
            refundStatus:
              status === "Approved"
                ? "Refund/Exchange Processing"
                : "Not Started",
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      refreshAllData();
    } catch {
      setAdminMessage("Unable to update return status.");
    }
  };

  return (
    <main className="app">
      <nav className="navbar">
        <div>
          <p className="eyebrow">AI Fashion Commerce</p>
          <h1>StyleNexa AI</h1>
        </div>

        <div className="nav-links">
          <a href="#collections">Collections</a>
          <a href="#products">Products</a>
          <a href="#ai">AI Stylist</a>
          <a href="#ai-tools">AI Tools</a>
          <a href="#admin">Admin</a>
          <a href="#checkout">Checkout</a>
        </div>

        <button className="cart-pill">Cart · {cart.length}</button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Premium Clothing Platform</p>
          <h2>Launch your fashion brand smarter with AI.</h2>
          <p>
            StyleNexa AI is a premium clothing e-commerce platform with smart
            shopping assistance, product management, order tracking, return
            workflows, and admin automation.
          </p>

          <div className="status-pill">{apiStatus}</div>

          <div className="hero-actions">
            <a href="#products" className="primary-btn">
              Explore Products
            </a>
            <a href="#admin" className="secondary-btn">
              Admin Login
            </a>
          </div>
        </div>

        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
            alt="Fashion model wearing premium clothing"
          />
          <div className="drop-card">
            <span>New Drop</span>
            <strong>Urban Monochrome Collection</strong>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div>
          <strong>{products.length}+</strong>
          <span>Live Products</span>
        </div>
        <div>
          <strong>{adminSummary?.totalOrders || 0}</strong>
          <span>Total Orders</span>
        </div>
        <div>
          <strong>₹{adminSummary?.totalRevenue || 0}</strong>
          <span>Total Revenue</span>
        </div>
        <div>
          <strong>{adminSummary?.pendingReturns || 0}</strong>
          <span>Pending Returns</span>
        </div>
      </section>

      <section id="collections" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Collections</p>
          <h2>Curated fashion drops</h2>
        </div>

        <div className="collection-grid">
          {COLLECTIONS.map((collection) => (
            <div className="collection-card" key={collection}>
              <span>{collection}</span>
              <p>Explore premium styles for modern clothing brands.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Shop Demo</p>
          <h2>Backend-connected product storefront</h2>
        </div>

        <div className="filter-row">
          {[
            "All",
            "Streetwear",
            "Essentials",
            "Bottomwear",
            "Winterwear",
            "Jackets",
          ].map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active-filter" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span>{product.tag}</span>
              </div>

              <div className="product-info">
                <p>
                  {product.category} · Stock {product.stock}
                </p>
                <h3>{product.name}</h3>

                <div className="price-row">
                  <strong>₹{product.price}</strong>
                  <span>₹{product.oldPrice}</span>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="size-row">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? "selected-size" : ""}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button
                  className="full-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="ai" className="ai-section">
        <div>
          <p className="eyebrow">AI Shopping Assistant</p>
          <h2>Smart fashion guidance for every customer.</h2>
          <p>
            The AI stylist helps customers choose outfits, understand size fit,
            discover matching products, and receive personalized shopping
            recommendations.
          </p>
        </div>

        <div className="chat-card">
          <textarea
            value={aiMessage}
            onChange={(event) => setAiMessage(event.target.value)}
            placeholder="Ask AI stylist..."
          />

          <button className="full-btn" onClick={askAiStylist}>
            {aiLoading ? "Thinking..." : "Ask AI Stylist"}
          </button>

          <div className="chat-message bot">{aiReply}</div>

          <div className="ai-tags">
            <span>Outfit Suggestion</span>
            <span>Size Guide</span>
            <span>Product Match</span>
          </div>
        </div>
      </section>

      <section id="ai-tools" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">AI Business Tools</p>
          <h2>Gemini-powered fashion tools</h2>
        </div>

        <div className="ai-tools-grid">
          <form className="tool-panel" onSubmit={generateProductDescription}>
            <h3>AI Product Description Generator</h3>
            <p>Generate premium e-commerce product copy for clothing brands.</p>

            <input
              name="productName"
              value={descriptionForm.productName}
              onChange={handleDescriptionChange}
              placeholder="Product name"
              required
            />

            <input
              name="category"
              value={descriptionForm.category}
              onChange={handleDescriptionChange}
              placeholder="Category"
              required
            />

            <input
              name="color"
              value={descriptionForm.color}
              onChange={handleDescriptionChange}
              placeholder="Color"
            />

            <input
              name="targetAudience"
              value={descriptionForm.targetAudience}
              onChange={handleDescriptionChange}
              placeholder="Target audience"
            />

            <button className="full-btn" type="submit">
              {descriptionLoading ? "Generating..." : "Generate Description"}
            </button>

            {productDescription && (
              <div className="result-box">
                <strong>Generated Copy</strong>
                <p>{productDescription}</p>
              </div>
            )}
          </form>

          <form className="tool-panel" onSubmit={generateSizeGuide}>
            <h3>AI Size Guide</h3>
            <p>
              Help customers choose an approximate size using AI-powered fit
              guidance.
            </p>

            <input
              name="height"
              value={sizeGuideForm.height}
              onChange={handleSizeGuideChange}
              placeholder="Height, example: 175 cm"
              required
            />

            <input
              name="weight"
              value={sizeGuideForm.weight}
              onChange={handleSizeGuideChange}
              placeholder="Weight, example: 70 kg"
              required
            />

            <select
              name="preferredFit"
              value={sizeGuideForm.preferredFit}
              onChange={handleSizeGuideChange}
            >
              <option value="Slim fit">Slim fit</option>
              <option value="Regular fit">Regular fit</option>
              <option value="Relaxed fit">Relaxed fit</option>
              <option value="Oversized fit">Oversized fit</option>
            </select>

            <input
              name="productName"
              value={sizeGuideForm.productName}
              onChange={handleSizeGuideChange}
              placeholder="Product name"
            />

            <button className="full-btn" type="submit">
              {sizeLoading ? "Checking..." : "Get Size Recommendation"}
            </button>

            {sizeRecommendation && (
              <div className="result-box">
                <strong>Size Recommendation</strong>
                <p>{sizeRecommendation}</p>
              </div>
            )}
          </form>
        </div>
      </section>

      <section id="admin" className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h2>Business control center</h2>
          </div>

          {isAdminLoggedIn && (
            <button className="logout-btn" onClick={logoutAdmin}>
              Logout Admin
            </button>
          )}
        </div>

        {!isAdminLoggedIn ? (
          <div className="admin-login-card">
            <div>
              <p className="eyebrow">Protected Access</p>
              <h3>Admin login required</h3>
              <p>
                Login to manage products, view orders, approve return requests,
                and control the StyleNexa AI business dashboard.
              </p>

              <div className="demo-credentials">
                <strong>Demo Credentials</strong>
                <span>Username: admin</span>
                <span>Password: admin123</span>
              </div>
            </div>

            <form className="admin-login-form" onSubmit={loginAdmin}>
              <input
                name="username"
                value={adminLoginForm.username}
                onChange={handleAdminLoginChange}
                placeholder="Admin username"
                required
              />

              <input
                name="password"
                type="password"
                value={adminLoginForm.password}
                onChange={handleAdminLoginChange}
                placeholder="Admin password"
                required
              />

              <button className="full-btn" type="submit">
                Login to Admin Dashboard
              </button>

              {adminLoginMessage && (
                <p className="success-message">{adminLoginMessage}</p>
              )}
            </form>
          </div>
        ) : (
          <>
            <div className="admin-welcome">
              <span>Logged in as</span>
              <strong>{adminUser || "admin"}</strong>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <span>Total Products</span>
                <strong>{adminSummary?.totalProducts || products.length}</strong>
                <p>Product catalog connected to backend API.</p>
              </div>
              <div className="dashboard-card">
                <span>Total Orders</span>
                <strong>{adminSummary?.totalOrders || 0}</strong>
                <p>Live order tracking and status updates.</p>
              </div>
              <div className="dashboard-card">
                <span>Revenue</span>
                <strong>₹{adminSummary?.totalRevenue || 0}</strong>
                <p>Sales insights for fashion business owners.</p>
              </div>
              <div className="dashboard-card">
                <span>Pending Returns</span>
                <strong>{adminSummary?.pendingReturns || 0}</strong>
                <p>Manage return, exchange, and refund requests.</p>
              </div>
            </div>

            <div className="admin-management">
              <form className="admin-form" onSubmit={addAdminProduct}>
                <h3>Add New Product</h3>

                <input
                  name="name"
                  value={adminProductForm.name}
                  onChange={handleAdminProductChange}
                  placeholder="Product name"
                  required
                />

                <input
                  name="category"
                  value={adminProductForm.category}
                  onChange={handleAdminProductChange}
                  placeholder="Category"
                  required
                />

                <input
                  name="price"
                  value={adminProductForm.price}
                  onChange={handleAdminProductChange}
                  placeholder="Price"
                  required
                />

                <input
                  name="oldPrice"
                  value={adminProductForm.oldPrice}
                  onChange={handleAdminProductChange}
                  placeholder="Old price"
                />

                <input
                  name="color"
                  value={adminProductForm.color}
                  onChange={handleAdminProductChange}
                  placeholder="Color"
                  required
                />

                <input
                  name="sizes"
                  value={adminProductForm.sizes}
                  onChange={handleAdminProductChange}
                  placeholder="Sizes, example: S,M,L,XL"
                />

                <input
                  name="stock"
                  value={adminProductForm.stock}
                  onChange={handleAdminProductChange}
                  placeholder="Stock"
                />

                <input
                  name="tag"
                  value={adminProductForm.tag}
                  onChange={handleAdminProductChange}
                  placeholder="Tag"
                />

                <input
                  name="image"
                  value={adminProductForm.image}
                  onChange={handleAdminProductChange}
                  placeholder="Image URL"
                />

                <textarea
                  name="description"
                  value={adminProductForm.description}
                  onChange={handleAdminProductChange}
                  placeholder="Product description"
                  required
                />

                <button className="full-btn" type="submit">
                  Add Product
                </button>

                {adminMessage && <p className="success-message">{adminMessage}</p>}
              </form>

              <div className="admin-list">
                <h3>Manage Products</h3>

                {products.map((product) => (
                  <div className="admin-row" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>
                        {product.category} · ₹{product.price} · Stock{" "}
                        {product.stock}
                      </span>
                    </div>

                    <button onClick={() => deleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-tables">
              <div className="admin-table-card">
                <h3>Orders</h3>

                {orders.length === 0 ? (
                  <p className="muted-text">No orders yet.</p>
                ) : (
                  orders.map((order) => (
                    <div className="admin-row" key={order.id}>
                      <div>
                        <strong>
                          #{order.id} · {order.customerName}
                        </strong>
                        <span>
                          ₹{order.totalAmount} · {order.status} ·{" "}
                          {order.items.length} item(s)
                        </span>
                      </div>

                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value)
                        }
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  ))
                )}
              </div>

              <div className="admin-table-card">
                <h3>Return / Exchange Requests</h3>

                {returnRequests.length === 0 ? (
                  <p className="muted-text">No return requests yet.</p>
                ) : (
                  returnRequests.map((request) => (
                    <div className="admin-row" key={request.id}>
                      <div>
                        <strong>
                          #{request.id} · Order {request.orderId}
                        </strong>
                        <span>
                          {request.requestType} · {request.customerName} ·{" "}
                          {request.status}
                        </span>
                      </div>

                      <select
                        value={request.status}
                        onChange={(event) =>
                          updateReturnStatus(request.id, event.target.value)
                        }
                      >
                        <option value="Pending Admin Review">
                          Pending Admin Review
                        </option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <section id="checkout" className="cart-section">
        <div>
          <p className="eyebrow">Cart Preview</p>
          <h2>Customer checkout flow</h2>
        </div>

        <div className="cart-box">
          {cart.length === 0 ? (
            <p>Your cart is empty. Add products from the storefront.</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${index}`}>
                  <span>
                    {item.name} · Size {item.selectedSize}
                  </span>
                  <strong>₹{item.price}</strong>
                </div>
              ))}

              <div className="cart-total">
                <span>Total</span>
                <strong>₹{totalAmount}</strong>
              </div>

              <form className="form-grid" onSubmit={submitOrder}>
                <input
                  name="customerName"
                  value={checkoutForm.customerName}
                  onChange={handleCheckoutChange}
                  placeholder="Customer name"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={checkoutForm.email}
                  onChange={handleCheckoutChange}
                  placeholder="Email"
                  required
                />
                <input
                  name="phone"
                  value={checkoutForm.phone}
                  onChange={handleCheckoutChange}
                  placeholder="Phone"
                />
                <textarea
                  name="address"
                  value={checkoutForm.address}
                  onChange={handleCheckoutChange}
                  placeholder="Delivery address"
                />

                <button className="full-btn" type="submit">
                  Place Order
                </button>
              </form>

              <button className="ghost-btn" onClick={clearCart}>
                Clear Cart
              </button>

              {orderMessage && <p className="success-message">{orderMessage}</p>}
            </>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Returns Module</p>
          <h2>Return / exchange request demo</h2>
        </div>

        <form className="return-form" onSubmit={submitReturnRequest}>
          <input
            name="orderId"
            value={returnForm.orderId}
            onChange={handleReturnChange}
            placeholder="Order ID"
            required
          />
          <input
            name="customerName"
            value={returnForm.customerName}
            onChange={handleReturnChange}
            placeholder="Customer name"
            required
          />
          <input
            name="productName"
            value={returnForm.productName}
            onChange={handleReturnChange}
            placeholder="Product name"
          />
          <input
            name="size"
            value={returnForm.size}
            onChange={handleReturnChange}
            placeholder="Size"
          />

          <select
            name="requestType"
            value={returnForm.requestType}
            onChange={handleReturnChange}
          >
            <option value="Exchange">Exchange</option>
            <option value="Return">Return</option>
            <option value="Refund">Refund</option>
          </select>

          <textarea
            name="reason"
            value={returnForm.reason}
            onChange={handleReturnChange}
            placeholder="Reason for request"
            required
          />

          <button className="full-btn" type="submit">
            Submit Request
          </button>

          {returnMessage && <p className="success-message">{returnMessage}</p>}
        </form>
      </section>

      <footer className="footer">
        <h2>StyleNexa AI</h2>
        <p>
          AI-powered clothing commerce platform for brands, boutiques, and
          fashion startups.
        </p>
      </footer>
    </main>
  );
}

export default App;