import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const emptyProductForm = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  color: "",
  sizes: "S, M, L, XL",
  stock: "",
  tag: "",
  description: "",
  image: "",
};

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [sortOption, setSortOption] = useState("featured");

  const [cart, setCart] = useState([]);
  const [activeSection, setActiveSection] = useState("home");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [stylistInput, setStylistInput] = useState("");
  const [stylistReply, setStylistReply] = useState("");

  const [descriptionForm, setDescriptionForm] = useState({
    productName: "",
    category: "",
    color: "",
    targetAudience: "",
  });
  const [generatedDescription, setGeneratedDescription] = useState("");

  const [sizeForm, setSizeForm] = useState({
    height: "",
    weight: "",
    preferredFit: "",
    productName: "",
  });
  const [sizeRecommendation, setSizeRecommendation] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [returnForm, setReturnForm] = useState({
    orderId: "",
    customerName: "",
    email: "",
    productName: "",
    size: "",
    requestType: "Return",
    reason: "",
  });

  const [trackForm, setTrackForm] = useState({
    orderId: "",
    email: "",
  });
  const [trackedOrder, setTrackedOrder] = useState(null);

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerDashboard, setCustomerDashboard] = useState(null);

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("stylenexaAdminToken") || ""
  );
  const [adminUser, setAdminUser] = useState(
    localStorage.getItem("stylenexaAdminUser") || ""
  );
  const [adminLoginForm, setAdminLoginForm] = useState({
    username: "admin",
    password: "admin123",
  });
  const [adminSummary, setAdminSummary] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminReturns, setAdminReturns] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + Number(item.price || 0) * item.quantity,
        0
      ),
    [cart]
  );

  const productCategories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))];
  }, [products]);

  const productSizes = useMemo(() => {
    const allSizes = products.flatMap((product) => product.sizes || []);
    return ["All", ...new Set(allSizes)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (productSearch.trim()) {
      const search = productSearch.toLowerCase();

      filtered = filtered.filter(
        (product) =>
          String(product.name || "").toLowerCase().includes(search) ||
          String(product.category || "").toLowerCase().includes(search) ||
          String(product.color || "").toLowerCase().includes(search) ||
          String(product.description || "").toLowerCase().includes(search)
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (sizeFilter !== "All") {
      filtered = filtered.filter((product) =>
        (product.sizes || []).includes(sizeFilter)
      );
    }

    if (sortOption === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortOption === "stock-high") {
      filtered.sort((a, b) => Number(b.stock) - Number(a.stock));
    }

    return filtered;
  }, [products, productSearch, categoryFilter, sizeFilter, sortOption]);

  const isAdminLoggedIn = Boolean(adminToken);

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  }

  function getAdminHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    };
  }

  function handleUnauthorizedAdmin() {
    localStorage.removeItem("stylenexaAdminToken");
    localStorage.removeItem("stylenexaAdminUser");
    setAdminToken("");
    setAdminUser("");
    showMessage("Admin session expired. Please login again.");
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      showMessage("Unable to load products. Please check backend.");
    }
  }

  async function fetchAdminData() {
    if (!adminToken) return;

    try {
      const [summaryResponse, ordersResponse, returnsResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/summary`, {
            headers: getAdminHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/orders`, {
            headers: getAdminHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/returns`, {
            headers: getAdminHeaders(),
          }),
        ]);

      if (
        summaryResponse.status === 401 ||
        ordersResponse.status === 401 ||
        returnsResponse.status === 401
      ) {
        handleUnauthorizedAdmin();
        return;
      }

      const summaryData = await summaryResponse.json();
      const ordersData = await ordersResponse.json();
      const returnsData = await returnsResponse.json();

      if (summaryData.success) setAdminSummary(summaryData.summary);
      if (ordersData.success) setAdminOrders(ordersData.orders || []);
      if (returnsData.success) setAdminReturns(returnsData.requests || []);
    } catch (error) {
      showMessage("Unable to load admin data.");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken]);

  function scrollToSection(sectionId) {
    setActiveSection(sectionId);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    showMessage(`${product.name} added to cart.`);
  }

  async function openProductDetails(productId) {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedProduct(data.product);
      } else {
        showMessage(data.message || "Product details not found.");
      }
    } catch (error) {
      showMessage("Unable to load product details.");
    } finally {
      setLoading(false);
    }
  }

  function closeProductDetails() {
    setSelectedProduct(null);
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  async function askStylist() {
    if (!stylistInput.trim()) {
      showMessage("Please type your fashion question.");
      return;
    }

    setLoading(true);
    setStylistReply("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/stylist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: stylistInput }),
      });

      const data = await response.json();
      setStylistReply(data.reply || "No AI response received.");
    } catch (error) {
      setStylistReply("Unable to connect to AI stylist.");
    } finally {
      setLoading(false);
    }
  }

  async function generateDescription() {
    if (!descriptionForm.productName || !descriptionForm.category) {
      showMessage("Product name and category are required.");
      return;
    }

    setLoading(true);
    setGeneratedDescription("");

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
      setGeneratedDescription(data.description || "No description generated.");
    } catch (error) {
      setGeneratedDescription("Unable to generate product description.");
    } finally {
      setLoading(false);
    }
  }

  async function generateSizeGuide() {
    if (!sizeForm.height || !sizeForm.weight || !sizeForm.preferredFit) {
      showMessage("Height, weight, and preferred fit are required.");
      return;
    }

    setLoading(true);
    setSizeRecommendation("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/size-guide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sizeForm),
      });

      const data = await response.json();
      setSizeRecommendation(
        data.recommendation || "No size recommendation received."
      );
    } catch (error) {
      setSizeRecommendation("Unable to generate size recommendation.");
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      showMessage("Cart is empty.");
      return;
    }

    if (!checkoutForm.customerName || !checkoutForm.email) {
      showMessage("Customer name and email are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutForm,
          items: cart,
          totalAmount: cartTotal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCart([]);
        setCheckoutForm({
          customerName: "",
          email: "",
          phone: "",
          address: "",
        });
        setTrackForm({
          orderId: String(data.order.id),
          email: data.order.email,
        });
        showMessage(
          `Order placed successfully. Your Order ID is ${data.order.id}.`
        );
      } else {
        showMessage(data.message || "Unable to place order.");
      }
    } catch (error) {
      showMessage("Unable to place order.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReturnRequest(event) {
    event.preventDefault();

    if (
      !returnForm.orderId ||
      !returnForm.customerName ||
      !returnForm.reason ||
      !returnForm.requestType
    ) {
      showMessage("Please fill all required return/exchange fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/returns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnForm),
      });

      const data = await response.json();

      if (data.success) {
        setReturnForm({
          orderId: "",
          customerName: "",
          email: "",
          productName: "",
          size: "",
          requestType: "Return",
          reason: "",
        });
        showMessage("Return/exchange request submitted successfully.");
      } else {
        showMessage(data.message || "Unable to submit request.");
      }
    } catch (error) {
      showMessage("Unable to submit return/exchange request.");
    } finally {
      setLoading(false);
    }
  }

  async function trackOrder(event) {
    event.preventDefault();

    if (!trackForm.orderId || !trackForm.email) {
      showMessage("Order ID and email are required.");
      return;
    }

    setLoading(true);
    setTrackedOrder(null);

    try {
      const params = new URLSearchParams({
        orderId: trackForm.orderId,
        email: trackForm.email,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/orders/track?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setTrackedOrder(data);
        showMessage("Order found successfully.");
      } else {
        showMessage(data.message || "No order found.");
      }
    } catch (error) {
      showMessage("Unable to track order.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomerDashboard(event) {
    event.preventDefault();

    if (!customerEmail.trim()) {
      showMessage("Please enter customer email.");
      return;
    }

    setLoading(true);
    setCustomerDashboard(null);

    try {
      const params = new URLSearchParams({
        email: customerEmail,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/customer/dashboard?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setCustomerDashboard(data);
        showMessage("Customer dashboard loaded.");
      } else {
        showMessage(data.message || "Unable to load customer dashboard.");
      }
    } catch (error) {
      showMessage("Unable to load customer dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loginAdmin(event) {
    event.preventDefault();

    if (!adminLoginForm.username || !adminLoginForm.password) {
      showMessage("Enter admin username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminLoginForm),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("stylenexaAdminToken", data.token);
        localStorage.setItem("stylenexaAdminUser", data.admin.username);
        setAdminToken(data.token);
        setAdminUser(data.admin.username);
        showMessage("Admin login successful.");
      } else {
        showMessage(data.message || "Invalid admin login.");
      }
    } catch (error) {
      showMessage("Unable to login admin.");
    } finally {
      setLoading(false);
    }
  }

  function logoutAdmin() {
    localStorage.removeItem("stylenexaAdminToken");
    localStorage.removeItem("stylenexaAdminUser");
    setAdminToken("");
    setAdminUser("");
    setAdminSummary(null);
    setAdminOrders([]);
    setAdminReturns([]);
    showMessage("Admin logged out.");
  }

  async function saveProduct(event) {
    event.preventDefault();

    if (
      !productForm.name ||
      !productForm.category ||
      !productForm.price ||
      !productForm.color ||
      !productForm.description
    ) {
      showMessage("Please fill required product fields.");
      return;
    }

    const url = editingProductId
      ? `${API_BASE_URL}/api/admin/products/${editingProductId}`
      : `${API_BASE_URL}/api/admin/products`;

    const method = editingProductId ? "PUT" : "POST";

    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(productForm),
      });

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setProductForm(emptyProductForm);
        setEditingProductId(null);
        await fetchProducts();
        await fetchAdminData();
        showMessage(
          editingProductId
            ? "Product updated successfully."
            : "Product added successfully."
        );
      } else {
        showMessage(data.message || "Unable to save product.");
      }
    } catch (error) {
      showMessage("Unable to save product.");
    } finally {
      setLoading(false);
    }
  }

  function editProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      color: product.color || "",
      sizes: (product.sizes || []).join(", "),
      stock: product.stock || "",
      tag: product.tag || "",
      description: product.description || "",
      image: product.image || "",
    });
    scrollToSection("admin");
  }

  async function deleteProduct(productId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    setLoading(true);

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

      if (data.success) {
        await fetchProducts();
        await fetchAdminData();
        showMessage("Product deleted successfully.");
      } else {
        showMessage(data.message || "Unable to delete product.");
      }
    } catch (error) {
      showMessage("Unable to delete product.");
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
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

      const data = await response.json();

      if (data.success) {
        await fetchAdminData();
        showMessage("Order status updated.");
      }
    } catch (error) {
      showMessage("Unable to update order status.");
    }
  }

  async function updateReturnStatus(requestId, status) {
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
              status === "Approved" ? "Refund In Progress" : "Not Started",
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorizedAdmin();
        return;
      }

      const data = await response.json();

      if (data.success) {
        await fetchAdminData();
        showMessage("Return/exchange status updated.");
      }
    } catch (error) {
      showMessage("Unable to update return status.");
    }
  }

  return (
    <div className="app">
      {message && <div className="toast">{message}</div>}

      <nav className="navbar">
        <button className="brand" onClick={() => scrollToSection("home")}>
          <span>StyleNexa</span>
          <strong>AI</strong>
        </button>

        <div className="nav-links">
          <button onClick={() => scrollToSection("collections")}>
            Collections
          </button>
          <button onClick={() => scrollToSection("products")}>Products</button>
          <button onClick={() => scrollToSection("ai-stylist")}>
            AI Stylist
          </button>
          <button onClick={() => scrollToSection("customer")}>
            Track Order
          </button>
          <button onClick={() => scrollToSection("admin")}>Admin</button>
          <button onClick={() => scrollToSection("checkout")}>
            Cart ({cart.length})
          </button>
        </div>
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="eyebrow">AI Fashion Commerce Platform</p>
            <h1>Premium clothing store with AI shopping intelligence.</h1>
            <p>
              StyleNexa AI combines a modern fashion storefront, AI stylist,
              MongoDB cloud database, admin operations, order tracking, customer
              dashboard, product detail views, and smart search in one
              client-ready platform.
            </p>
            <div className="hero-actions">
              <button onClick={() => scrollToSection("products")}>
                Shop Collection
              </button>
              <button
                className="secondary"
                onClick={() => scrollToSection("ai-stylist")}
              >
                Ask AI Stylist
              </button>
            </div>
          </div>

          <div className="hero-card">
            <span>Live Commerce Engine</span>
            <h2>Style. Sell. Track. Scale.</h2>
            <p>
              Built for fashion brands that want AI-powered shopping,
              operations, and customer experience.
            </p>
          </div>
        </section>

        <section className="stats-section">
          <div>
            <strong>{products.length}+</strong>
            <span>Products</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>Stylist Assistant</span>
          </div>
          <div>
            <strong>MongoDB</strong>
            <span>Cloud Database</span>
          </div>
          <div>
            <strong>Admin</strong>
            <span>Operations Panel</span>
          </div>
        </section>

        <section id="collections" className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Collections</p>
            <h2>Fashion drops built for modern customers.</h2>
          </div>

          <div className="collection-grid">
            <article>
              <span>01</span>
              <h3>Streetwear</h3>
              <p>Oversized silhouettes, cargos, hoodies, and bold essentials.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Essentials</h3>
              <p>Clean daily wear for premium casual and semi-formal looks.</p>
            </article>
            <article>
              <span>03</span>
              <h3>AI Styling</h3>
              <p>Customers can ask AI for product suggestions and outfit ideas.</p>
            </article>
          </div>
        </section>

        <section id="products" className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Shop</p>
            <h2>Live product catalogue</h2>
          </div>

          <div className="product-controls">
            <input
              placeholder="Search by product, category, color..."
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {productCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={sizeFilter}
              onChange={(event) => setSizeFilter(event.target.value)}
            >
              {productSizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-high">Stock: High to Low</option>
            </select>
          </div>

          <div className="filter-summary">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </div>

          <div className="product-grid">
            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try changing your search or filter options.</p>
              </div>
            )}

            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span>{product.tag}</span>
                </div>

                <div className="product-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>

                  <div className="price-row">
                    <strong>₹{product.price}</strong>
                    {product.oldPrice ? <span>₹{product.oldPrice}</span> : null}
                  </div>

                  <div className="product-meta">
                    <span>{product.color}</span>
                    <span>{(product.sizes || []).join(" / ")}</span>
                    <span>{product.stock} in stock</span>
                  </div>

                  <div className="product-actions">
                    <button onClick={() => openProductDetails(product.id)}>
                      View Details
                    </button>
                    <button onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="ai-stylist" className="section-block ai-section">
          <div className="section-heading">
            <p className="eyebrow">AI Shopping Assistant</p>
            <h2>Ask StyleNexa AI for outfit ideas.</h2>
          </div>

          <div className="ai-tools-grid">
            <article className="chat-card">
              <h3>AI Stylist</h3>
              <textarea
                value={stylistInput}
                onChange={(event) => setStylistInput(event.target.value)}
                placeholder="Example: I need a black streetwear outfit for weekend..."
              />
              <button onClick={askStylist} disabled={loading}>
                {loading ? "Thinking..." : "Ask Stylist"}
              </button>
              {stylistReply && <div className="result-box">{stylistReply}</div>}
            </article>

            <article className="tool-panel">
              <h3>AI Product Description</h3>
              <input
                placeholder="Product name"
                value={descriptionForm.productName}
                onChange={(event) =>
                  setDescriptionForm({
                    ...descriptionForm,
                    productName: event.target.value,
                  })
                }
              />
              <input
                placeholder="Category"
                value={descriptionForm.category}
                onChange={(event) =>
                  setDescriptionForm({
                    ...descriptionForm,
                    category: event.target.value,
                  })
                }
              />
              <input
                placeholder="Color"
                value={descriptionForm.color}
                onChange={(event) =>
                  setDescriptionForm({
                    ...descriptionForm,
                    color: event.target.value,
                  })
                }
              />
              <input
                placeholder="Target audience"
                value={descriptionForm.targetAudience}
                onChange={(event) =>
                  setDescriptionForm({
                    ...descriptionForm,
                    targetAudience: event.target.value,
                  })
                }
              />
              <button onClick={generateDescription} disabled={loading}>
                Generate Copy
              </button>
              {generatedDescription && (
                <div className="result-box">{generatedDescription}</div>
              )}
            </article>

            <article className="tool-panel">
              <h3>AI Size Guide</h3>
              <input
                placeholder="Height, example: 175 cm"
                value={sizeForm.height}
                onChange={(event) =>
                  setSizeForm({ ...sizeForm, height: event.target.value })
                }
              />
              <input
                placeholder="Weight, example: 70 kg"
                value={sizeForm.weight}
                onChange={(event) =>
                  setSizeForm({ ...sizeForm, weight: event.target.value })
                }
              />
              <input
                placeholder="Preferred fit: regular / relaxed / oversized"
                value={sizeForm.preferredFit}
                onChange={(event) =>
                  setSizeForm({
                    ...sizeForm,
                    preferredFit: event.target.value,
                  })
                }
              />
              <input
                placeholder="Product name"
                value={sizeForm.productName}
                onChange={(event) =>
                  setSizeForm({
                    ...sizeForm,
                    productName: event.target.value,
                  })
                }
              />
              <button onClick={generateSizeGuide} disabled={loading}>
                Recommend Size
              </button>
              {sizeRecommendation && (
                <div className="result-box">{sizeRecommendation}</div>
              )}
            </article>
          </div>
        </section>

        <section id="customer" className="section-block customer-section">
          <div className="section-heading">
            <p className="eyebrow">Customer Experience</p>
            <h2>Track orders and view customer dashboard.</h2>
          </div>

          <div className="customer-grid">
            <article className="customer-card">
              <h3>Track Your Order</h3>
              <p>
                Enter your Order ID and email to view live order status and
                timeline.
              </p>

              <form onSubmit={trackOrder} className="form-grid">
                <input
                  placeholder="Order ID"
                  value={trackForm.orderId}
                  onChange={(event) =>
                    setTrackForm({ ...trackForm, orderId: event.target.value })
                  }
                />
                <input
                  placeholder="Email used during checkout"
                  value={trackForm.email}
                  onChange={(event) =>
                    setTrackForm({ ...trackForm, email: event.target.value })
                  }
                />
                <button type="submit" disabled={loading}>
                  Track Order
                </button>
              </form>

              {trackedOrder && (
                <div className="tracking-result">
                  <div className="tracking-header">
                    <div>
                      <span>Order ID</span>
                      <strong>#{trackedOrder.order.id}</strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>{trackedOrder.order.status}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>₹{trackedOrder.order.totalAmount}</strong>
                    </div>
                  </div>

                  <div className="timeline">
                    {trackedOrder.tracking.timeline.map((step) => (
                      <div
                        key={step.key}
                        className={`timeline-step ${
                          step.completed ? "completed" : ""
                        } ${step.active ? "active" : ""}`}
                      >
                        <span></span>
                        <div>
                          <strong>{step.label}</strong>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mini-list">
                    {(trackedOrder.order.items || []).map((item) => (
                      <div key={`${item.id}-${item.name}`}>
                        <span>{item.name}</span>
                        <strong>
                          {item.quantity} × ₹{item.price}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <article className="customer-card">
              <h3>Customer Dashboard</h3>
              <p>
                View customer order history, spending summary, returns, and
                product recommendations.
              </p>

              <form onSubmit={loadCustomerDashboard} className="form-grid">
                <input
                  placeholder="Customer email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
                <button type="submit" disabled={loading}>
                  Load Dashboard
                </button>
              </form>

              {customerDashboard && (
                <div className="dashboard-preview">
                  <div className="dashboard-grid compact">
                    <div>
                      <span>Total Orders</span>
                      <strong>{customerDashboard.customer.totalOrders}</strong>
                    </div>
                    <div>
                      <span>Active Orders</span>
                      <strong>{customerDashboard.customer.activeOrders}</strong>
                    </div>
                    <div>
                      <span>Total Spent</span>
                      <strong>₹{customerDashboard.customer.totalSpent}</strong>
                    </div>
                    <div>
                      <span>Returns</span>
                      <strong>
                        {customerDashboard.customer.totalReturnRequests}
                      </strong>
                    </div>
                  </div>

                  <h4>Recent Orders</h4>
                  <div className="mini-list">
                    {customerDashboard.orders.length === 0 && (
                      <p>No orders found for this email.</p>
                    )}
                    {customerDashboard.orders.slice(0, 5).map((order) => (
                      <div key={order.id}>
                        <span>
                          #{order.id} — {order.status}
                        </span>
                        <strong>₹{order.totalAmount}</strong>
                      </div>
                    ))}
                  </div>

                  <h4>Return Requests</h4>
                  <div className="mini-list">
                    {customerDashboard.returnRequests.length === 0 && (
                      <p>No return requests found.</p>
                    )}
                    {customerDashboard.returnRequests
                      .slice(0, 5)
                      .map((request) => (
                        <div key={request.id}>
                          <span>
                            #{request.id} — {request.requestType}
                          </span>
                          <strong>{request.status}</strong>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </section>

        <section id="admin" className="section-block admin-section">
          <div className="section-heading">
            <p className="eyebrow">Admin Operations</p>
            <h2>Manage products, orders, and returns.</h2>
          </div>

          {!isAdminLoggedIn ? (
            <div className="admin-login-card">
              <div>
                <h3>Protected admin dashboard</h3>
                <p>
                  Login to manage inventory, orders, return approvals, and
                  revenue summary.
                </p>

                <div className="demo-credentials">
                  <span>Demo Username: admin</span>
                  <span>Demo Password: admin123</span>
                </div>
              </div>

              <form onSubmit={loginAdmin} className="admin-login-form">
                <input
                  placeholder="Username"
                  value={adminLoginForm.username}
                  onChange={(event) =>
                    setAdminLoginForm({
                      ...adminLoginForm,
                      username: event.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminLoginForm.password}
                  onChange={(event) =>
                    setAdminLoginForm({
                      ...adminLoginForm,
                      password: event.target.value,
                    })
                  }
                />
                <button type="submit" disabled={loading}>
                  Login Admin
                </button>
              </form>
            </div>
          ) : (
            <div className="admin-management">
              <div className="admin-topbar">
                <div className="admin-welcome">
                  <span>Logged in as</span>
                  <strong>{adminUser || "admin"}</strong>
                </div>
                <button className="logout-btn" onClick={logoutAdmin}>
                  Logout
                </button>
              </div>

              {adminSummary && (
                <div className="dashboard-grid">
                  <div>
                    <span>Products</span>
                    <strong>{adminSummary.totalProducts}</strong>
                  </div>
                  <div>
                    <span>Orders</span>
                    <strong>{adminSummary.totalOrders}</strong>
                  </div>
                  <div>
                    <span>Revenue</span>
                    <strong>₹{adminSummary.totalRevenue}</strong>
                  </div>
                  <div>
                    <span>Pending Returns</span>
                    <strong>{adminSummary.pendingReturns}</strong>
                  </div>
                </div>
              )}

              <form onSubmit={saveProduct} className="admin-form">
                <h3>{editingProductId ? "Edit Product" : "Add Product"}</h3>

                <input
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm({ ...productForm, name: event.target.value })
                  }
                />
                <input
                  placeholder="Category"
                  value={productForm.category}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      category: event.target.value,
                    })
                  }
                />
                <input
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      price: event.target.value,
                    })
                  }
                />
                <input
                  placeholder="Old price"
                  value={productForm.oldPrice}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      oldPrice: event.target.value,
                    })
                  }
                />
                <input
                  placeholder="Color"
                  value={productForm.color}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      color: event.target.value,
                    })
                  }
                />
                <input
                  placeholder="Sizes"
                  value={productForm.sizes}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      sizes: event.target.value,
                    })
                  }
                />
                <input
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      stock: event.target.value,
                    })
                  }
                />
                <input
                  placeholder="Tag"
                  value={productForm.tag}
                  onChange={(event) =>
                    setProductForm({ ...productForm, tag: event.target.value })
                  }
                />
                <input
                  placeholder="Image URL"
                  value={productForm.image}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      image: event.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      description: event.target.value,
                    })
                  }
                />

                <button type="submit" disabled={loading}>
                  {editingProductId ? "Update Product" : "Add Product"}
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm(emptyProductForm);
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>

              <div className="admin-tables">
                <article className="admin-table-card">
                  <h3>Manage Products</h3>
                  {products.map((product) => (
                    <div className="admin-row" key={product.id}>
                      <div>
                        <strong>{product.name}</strong>
                        <span>
                          ₹{product.price} — {product.stock} stock
                        </span>
                      </div>
                      <div className="row-actions">
                        <button onClick={() => editProduct(product)}>
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(product.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </article>

                <article className="admin-table-card">
                  <h3>Orders</h3>
                  {adminOrders.length === 0 && <p>No orders yet.</p>}
                  {adminOrders.map((order) => (
                    <div className="admin-row" key={order.id}>
                      <div>
                        <strong>
                          #{order.id} — {order.customerName}
                        </strong>
                        <span>
                          ₹{order.totalAmount} — {order.status}
                        </span>
                      </div>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value)
                        }
                      >
                        <option>Order Placed</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  ))}
                </article>

                <article className="admin-table-card">
                  <h3>Return / Exchange Requests</h3>
                  {adminReturns.length === 0 && <p>No return requests yet.</p>}
                  {adminReturns.map((request) => (
                    <div className="admin-row" key={request.id}>
                      <div>
                        <strong>
                          #{request.id} — {request.customerName}
                        </strong>
                        <span>
                          {request.requestType} — {request.status}
                        </span>
                      </div>
                      <div className="row-actions">
                        <button
                          onClick={() =>
                            updateReturnStatus(request.id, "Approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            updateReturnStatus(request.id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </article>
              </div>
            </div>
          )}
        </section>

        <section id="checkout" className="section-block cart-section">
          <div className="section-heading">
            <p className="eyebrow">Checkout</p>
            <h2>Cart, checkout, and return request.</h2>
          </div>

          <div className="checkout-grid">
            <article className="cart-card">
              <h3>Your Cart</h3>

              {cart.length === 0 && <p>Your cart is empty.</p>}

              {cart.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}

              <div className="cart-total">
                <span>Total</span>
                <strong>₹{cartTotal}</strong>
              </div>
            </article>

            <form onSubmit={placeOrder} className="checkout-form">
              <h3>Place Order</h3>
              <input
                placeholder="Customer name"
                value={checkoutForm.customerName}
                onChange={(event) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    customerName: event.target.value,
                  })
                }
              />
              <input
                placeholder="Email"
                value={checkoutForm.email}
                onChange={(event) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    email: event.target.value,
                  })
                }
              />
              <input
                placeholder="Phone"
                value={checkoutForm.phone}
                onChange={(event) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    phone: event.target.value,
                  })
                }
              />
              <textarea
                placeholder="Address"
                value={checkoutForm.address}
                onChange={(event) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    address: event.target.value,
                  })
                }
              />
              <button type="submit" disabled={loading}>
                Place Order
              </button>
            </form>

            <form onSubmit={submitReturnRequest} className="return-form">
              <h3>Return / Exchange Request</h3>
              <input
                placeholder="Order ID"
                value={returnForm.orderId}
                onChange={(event) =>
                  setReturnForm({ ...returnForm, orderId: event.target.value })
                }
              />
              <input
                placeholder="Customer name"
                value={returnForm.customerName}
                onChange={(event) =>
                  setReturnForm({
                    ...returnForm,
                    customerName: event.target.value,
                  })
                }
              />
              <input
                placeholder="Email"
                value={returnForm.email}
                onChange={(event) =>
                  setReturnForm({ ...returnForm, email: event.target.value })
                }
              />
              <input
                placeholder="Product name"
                value={returnForm.productName}
                onChange={(event) =>
                  setReturnForm({
                    ...returnForm,
                    productName: event.target.value,
                  })
                }
              />
              <input
                placeholder="Size"
                value={returnForm.size}
                onChange={(event) =>
                  setReturnForm({ ...returnForm, size: event.target.value })
                }
              />
              <select
                value={returnForm.requestType}
                onChange={(event) =>
                  setReturnForm({
                    ...returnForm,
                    requestType: event.target.value,
                  })
                }
              >
                <option>Return</option>
                <option>Exchange</option>
                <option>Refund</option>
              </select>
              <textarea
                placeholder="Reason"
                value={returnForm.reason}
                onChange={(event) =>
                  setReturnForm({ ...returnForm, reason: event.target.value })
                }
              />
              <button type="submit" disabled={loading}>
                Submit Request
              </button>
            </form>
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className="product-detail-overlay">
          <div className="product-detail-modal">
            <button className="close-detail" onClick={closeProductDetails}>
              ×
            </button>

            <div className="detail-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="detail-content">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>

              <div className="detail-price">
                <strong>₹{selectedProduct.price}</strong>
                {selectedProduct.oldPrice ? (
                  <span>₹{selectedProduct.oldPrice}</span>
                ) : null}
              </div>

              <div className="detail-tags">
                <span>Color: {selectedProduct.color}</span>
                <span>Sizes: {(selectedProduct.sizes || []).join(" / ")}</span>
                <span>Stock: {selectedProduct.stock}</span>
                <span>{selectedProduct.tag}</span>
              </div>

              <div className="detail-benefits">
                <h3>Why customers will like this</h3>
                <ul>
                  <li>Premium fashion-friendly product presentation</li>
                  <li>Clear sizing and stock information</li>
                  <li>Easy cart conversion from detail view</li>
                </ul>
              </div>

              <button
                className="detail-cart-btn"
                onClick={() => {
                  addToCart(selectedProduct);
                  closeProductDetails();
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div>
          <strong>StyleNexa AI</strong>
          <p>AI-powered fashion e-commerce and operations platform.</p>
        </div>
        <span>Built with React, Node.js, Express, MongoDB, Gemini AI.</span>
      </footer>
    </div>
  );
}

export default App;