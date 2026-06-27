import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const emptyCheckoutForm = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "Cash on Delivery",
};

const emptyReturnForm = {
  orderId: "",
  customerName: "",
  email: "",
  productName: "",
  size: "",
  requestType: "Return",
  reason: "",
};

const emptyNewProductForm = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  color: "",
  sizes: "S,M,L,XL",
  stock: "",
  tag: "",
  description: "",
  image: "",
};

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [completeLookProducts, setCompleteLookProducts] = useState([]);
  const [completeLookLoading, setCompleteLookLoading] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [sortOption, setSortOption] = useState("featured");

  const [cart, setCart] = useState([]);
  const [checkoutForm, setCheckoutForm] = useState(emptyCheckoutForm);

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  const [trackForm, setTrackForm] = useState({
    orderId: "",
    email: "",
  });
  const [trackedOrder, setTrackedOrder] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    orderId: "",
    email: "",
    paymentMethod: "Demo UPI Payment",
  });
  const [paymentResult, setPaymentResult] = useState(null);
  const [whatsappResult, setWhatsappResult] = useState(null);

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerDashboard, setCustomerDashboard] = useState(null);

  const [returnForm, setReturnForm] = useState(emptyReturnForm);

  const [stylistMessage, setStylistMessage] = useState("");
  const [stylistReply, setStylistReply] = useState("");

  const [productAiForm, setProductAiForm] = useState({
    productName: "",
    category: "",
    color: "",
    targetAudience: "",
  });
  const [productAiReply, setProductAiReply] = useState("");

  const [sizeForm, setSizeForm] = useState({
    height: "",
    weight: "",
    preferredFit: "Regular",
    productName: "",
  });
  const [sizeReply, setSizeReply] = useState("");

  const [outfitForm, setOutfitForm] = useState({
    occasion: "weekend outing",
    stylePreference: "streetwear",
    colorPreference: "black",
    budget: "5000",
    sizePreference: "L",
  });
  const [outfitResult, setOutfitResult] = useState(null);

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("stylenexaAdminToken") || ""
  );
  const [adminLogin, setAdminLogin] = useState({
    username: "admin",
    password: "admin123",
  });
  const [adminSummary, setAdminSummary] = useState(null);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminReturns, setAdminReturns] = useState([]);
  const [adminWhatsappUpdates, setAdminWhatsappUpdates] = useState({});
  const [newProductForm, setNewProductForm] = useState(emptyNewProductForm);

  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const discountAmount = appliedCoupon
    ? Number(appliedCoupon.discountAmount || 0)
    : 0;

  const finalCartAmount = Math.max(cartTotal - discountAmount, 0);

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(Boolean);
    return ["All", ...new Set(uniqueCategories)];
  }, [products]);

  const sizes = useMemo(() => {
    const uniqueSizes = products.flatMap((product) => product.sizes || []);
    return ["All", ...new Set(uniqueSizes)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (productSearch.trim()) {
      const search = productSearch.trim().toLowerCase();

      result = result.filter((product) => {
        const text = [
          product.name,
          product.category,
          product.color,
          product.tag,
          product.description,
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(search);
      });
    }

    if (categoryFilter !== "All") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (sizeFilter !== "All") {
      result = result.filter((product) =>
        (product.sizes || []).includes(sizeFilter)
      );
    }

    if (sortOption === "priceLow") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortOption === "priceHigh") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortOption === "stockHigh") {
      result.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    }

    return result;
  }, [products, productSearch, categoryFilter, sizeFilter, sortOption]);

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (adminToken) {
      fetchAdminData(adminToken);
    }
  }, [adminToken]);

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  function resetCoupon() {
    setAppliedCoupon(null);
    setCouponMessage("");
  }

  async function copyText(text, successMessage = "Copied.") {
    if (!text) {
      showMessage("Nothing to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showMessage(successMessage);
    } catch (error) {
      showMessage("Copy failed. Please copy manually.");
    }
  }

  function openWhatsAppLink(link) {
    if (!link) {
      showMessage("WhatsApp link is not available. Add a valid phone number.");
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      showMessage("Unable to load products. Check backend connection.");
    }
  }

  async function fetchCoupons() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons`);
      const data = await response.json();

      if (data.success) {
        setAvailableCoupons(data.coupons || []);
      }
    } catch (error) {
      console.log("Unable to load coupons.");
    }
  }

  async function openProductDetails(product) {
    setSelectedProduct(product);
    setCompleteLookProducts([]);
    setCompleteLookLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product.id}/complete-look`
      );
      const data = await response.json();

      if (data.success) {
        setCompleteLookProducts(data.completeLookProducts || []);
      }
    } catch (error) {
      console.log("Unable to load complete-the-look products.");
    } finally {
      setCompleteLookLoading(false);
    }
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Number(item.quantity || 1) + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    resetCoupon();
    showMessage(`${product.name} added to cart.`);
  }

  function addMultipleToCart(productList) {
    if (!productList || productList.length === 0) {
      showMessage("No products available to add.");
      return;
    }

    productList.forEach((product) => {
      setCart((currentCart) => {
        const existingItem = currentCart.find((item) => item.id === product.id);

        if (existingItem) {
          return currentCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Number(item.quantity || 1) + 1,
                }
              : item
          );
        }

        return [
          ...currentCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      });
    });

    resetCoupon();
    showMessage("Recommended outfit products added to cart.");
  }

  function updateCartQuantity(productId, quantity) {
    const cleanQuantity = Math.max(Number(quantity || 1), 1);

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: cleanQuantity,
            }
          : item
      )
    );

    resetCoupon();
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
    resetCoupon();
    showMessage("Product removed from cart.");
  }

  async function applyCoupon() {
    if (cart.length === 0) {
      showMessage("Add products to cart before applying coupon.");
      return;
    }

    if (!couponCode.trim()) {
      showMessage("Please enter a coupon code.");
      return;
    }

    setLoading(true);
    setCouponMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode,
          totalAmount: cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAppliedCoupon(null);
        setCouponMessage(data.message || "Coupon could not be applied.");
        showMessage(data.message || "Coupon could not be applied.");
        return;
      }

      if (data.success) {
        setAppliedCoupon(data);
        setCouponMessage(data.message);
        showMessage(data.message);
      } else {
        setAppliedCoupon(null);
        setCouponMessage(data.message || "Invalid coupon.");
        showMessage(data.message || "Invalid coupon.");
      }
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage("Unable to apply coupon. Check backend URL or CORS.");
      showMessage("Unable to apply coupon. Check backend URL or CORS.");
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder() {
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
          couponCode: appliedCoupon?.couponCode || "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(
          `Order placed successfully. Order ID: ${data.order.id}. Saved ₹${
            data.savings || 0
          }.`
        );

        setTrackForm({
          orderId: String(data.order.id),
          email: checkoutForm.email,
        });

        setPaymentForm({
          orderId: String(data.order.id),
          email: checkoutForm.email,
          paymentMethod: "Demo UPI Payment",
        });

        setWhatsappResult(data.whatsappUpdate || null);
        setPaymentResult(null);

        setCart([]);
        resetCoupon();
        setCouponCode("");
        setCheckoutForm(emptyCheckoutForm);
        fetchAdminData(adminToken);
      } else {
        showMessage(data.message || "Unable to place order.");
      }
    } catch (error) {
      showMessage("Unable to place order. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  async function trackOrder() {
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

      const response = await fetch(`${API_BASE_URL}/api/orders/track?${params}`);
      const data = await response.json();

      if (data.success) {
        setTrackedOrder(data);
        setWhatsappResult(data.whatsappUpdate || null);
        setPaymentForm({
          orderId: String(data.order.id),
          email: data.order.email,
          paymentMethod: "Demo UPI Payment",
        });
        showMessage("Order tracking loaded.");
      } else {
        showMessage(data.message || "Order not found.");
      }
    } catch (error) {
      showMessage("Unable to track order.");
    } finally {
      setLoading(false);
    }
  }

  async function completeDemoPayment() {
    if (!paymentForm.orderId || !paymentForm.email) {
      showMessage("Order ID and email are required for demo payment.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentForm),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentResult(data.payment);
        setWhatsappResult(data.whatsappUpdate || null);

        setTrackForm({
          orderId: String(data.payment.orderId),
          email: paymentForm.email,
        });

        fetchAdminData(adminToken);
        showMessage("Demo payment completed successfully.");
      } else {
        showMessage(data.message || "Unable to complete demo payment.");
      }
    } catch (error) {
      showMessage("Unable to complete demo payment.");
    } finally {
      setLoading(false);
    }
  }

  async function generateCustomerWhatsappUpdate() {
    if (!paymentForm.orderId || !paymentForm.email) {
      showMessage("Order ID and email are required for WhatsApp update.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        email: paymentForm.email,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${paymentForm.orderId}/whatsapp-update?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setWhatsappResult({
          message: data.whatsappMessage,
          link: data.whatsappLink,
          phoneAvailable: data.phoneAvailable,
        });
        showMessage("WhatsApp update generated.");
      } else {
        showMessage(data.message || "Unable to generate WhatsApp update.");
      }
    } catch (error) {
      showMessage("Unable to generate WhatsApp update.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomerDashboard() {
    if (!customerEmail) {
      showMessage("Enter email to load customer dashboard.");
      return;
    }

    setLoading(true);
    setCustomerDashboard(null);

    try {
      const params = new URLSearchParams({
        email: customerEmail,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/customer/dashboard?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setCustomerDashboard(data);
        showMessage("Customer dashboard loaded.");
      } else {
        showMessage(data.message || "Unable to load dashboard.");
      }
    } catch (error) {
      showMessage("Unable to load customer dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReturnRequest() {
    if (!returnForm.orderId || !returnForm.customerName || !returnForm.reason) {
      showMessage("Order ID, customer name, and reason are required.");
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
        showMessage("Return/exchange request submitted.");
        setReturnForm(emptyReturnForm);
        fetchAdminData(adminToken);
      } else {
        showMessage(data.message || "Unable to submit request.");
      }
    } catch (error) {
      showMessage("Unable to submit return/exchange request.");
    } finally {
      setLoading(false);
    }
  }

  async function askStylist() {
    if (!stylistMessage.trim()) {
      showMessage("Enter a fashion question first.");
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
        body: JSON.stringify({
          message: stylistMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStylistReply(data.reply);
      } else {
        setStylistReply(data.reply || "Unable to generate stylist response.");
      }
    } catch (error) {
      setStylistReply("Unable to reach AI stylist.");
    } finally {
      setLoading(false);
    }
  }

  async function generateProductDescription() {
    if (!productAiForm.productName || !productAiForm.category) {
      showMessage("Product name and category are required.");
      return;
    }

    setLoading(true);
    setProductAiReply("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/product-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productAiForm),
      });

      const data = await response.json();

      if (data.success) {
        setProductAiReply(data.description);
      } else {
        setProductAiReply(data.description || "Unable to generate description.");
      }
    } catch (error) {
      setProductAiReply("Unable to reach product description AI.");
    } finally {
      setLoading(false);
    }
  }

  async function generateSizeGuide() {
    if (!sizeForm.height || !sizeForm.weight || !sizeForm.preferredFit) {
      showMessage("Height, weight, and fit preference are required.");
      return;
    }

    setLoading(true);
    setSizeReply("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/size-guide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sizeForm),
      });

      const data = await response.json();

      if (data.success) {
        setSizeReply(data.recommendation);
      } else {
        setSizeReply(data.recommendation || "Unable to generate size guide.");
      }
    } catch (error) {
      setSizeReply("Unable to reach AI size guide.");
    } finally {
      setLoading(false);
    }
  }

  async function generateOutfit() {
    if (!outfitForm.occasion || !outfitForm.stylePreference) {
      showMessage("Occasion and style preference are required.");
      return;
    }

    setLoading(true);
    setOutfitResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/outfit-builder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outfitForm),
      });

      const data = await response.json();

      if (data.success) {
        setOutfitResult(data);
        showMessage("AI outfit generated.");
      } else {
        showMessage(data.message || "Unable to generate outfit.");
      }
    } catch (error) {
      showMessage("Unable to reach AI outfit builder.");
    } finally {
      setLoading(false);
    }
  }

  async function adminLoginSubmit() {
    setAdminLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminLogin),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("stylenexaAdminToken", data.token);
        localStorage.setItem("stylenexaAdminUser", data.admin.username);
        setAdminToken(data.token);
        showMessage("Admin login successful.");
        fetchAdminData(data.token);
      } else {
        showMessage(data.message || "Invalid admin login.");
      }
    } catch (error) {
      showMessage("Unable to login admin.");
    } finally {
      setAdminLoading(false);
    }
  }

  function adminLogout() {
    localStorage.removeItem("stylenexaAdminToken");
    localStorage.removeItem("stylenexaAdminUser");
    setAdminToken("");
    setAdminSummary(null);
    setAdminAnalytics(null);
    setAdminOrders([]);
    setAdminReturns([]);
    setAdminWhatsappUpdates({});
    showMessage("Admin logged out.");
  }

  async function fetchAdminData(token = adminToken) {
    if (!token) return;

    setAdminLoading(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [summaryRes, analyticsRes, ordersRes, returnsRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/summary`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/analytics`, { headers }),
          fetch(`${API_BASE_URL}/api/orders`, { headers }),
          fetch(`${API_BASE_URL}/api/returns`, { headers }),
        ]);

      const summaryData = await summaryRes.json();
      const analyticsData = await analyticsRes.json();
      const ordersData = await ordersRes.json();
      const returnsData = await returnsRes.json();

      if (summaryData.success) {
        setAdminSummary(summaryData.summary);
      }

      if (analyticsData.success) {
        setAdminAnalytics(analyticsData.analytics);
      }

      if (ordersData.success) {
        setAdminOrders(ordersData.orders || []);
      }

      if (returnsData.success) {
        setAdminReturns(returnsData.requests || []);
      }
    } catch (error) {
      showMessage("Unable to load admin data.");
    } finally {
      setAdminLoading(false);
    }
  }

  async function generateAdminWhatsappUpdate(orderId) {
    if (!adminToken) {
      showMessage("Admin login required.");
      return;
    }

    setAdminLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/whatsapp-update`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAdminWhatsappUpdates((current) => ({
          ...current,
          [orderId]: data,
        }));
        showMessage("Admin WhatsApp update generated.");
      } else {
        showMessage(data.message || "Unable to generate WhatsApp update.");
      }
    } catch (error) {
      showMessage("Unable to generate admin WhatsApp update.");
    } finally {
      setAdminLoading(false);
    }
  }

  async function addAdminProduct() {
    if (
      !newProductForm.name ||
      !newProductForm.category ||
      !newProductForm.price ||
      !newProductForm.color ||
      !newProductForm.description
    ) {
      showMessage("Fill product name, category, price, color, and description.");
      return;
    }

    setAdminLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newProductForm),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("Product added successfully.");
        setNewProductForm(emptyNewProductForm);
        fetchProducts();
        fetchAdminData(adminToken);
      } else {
        showMessage(data.message || "Unable to add product.");
      }
    } catch (error) {
      showMessage("Unable to add product.");
    } finally {
      setAdminLoading(false);
    }
  }

  async function deleteAdminProduct(productId) {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    setAdminLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage("Product deleted.");
        fetchProducts();
        fetchAdminData(adminToken);
      } else {
        showMessage(data.message || "Unable to delete product.");
      }
    } catch (error) {
      showMessage("Unable to delete product.");
    } finally {
      setAdminLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status, paymentStatus, paymentMethod) {
    setAdminLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status,
            paymentStatus,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage("Order status updated.");
        fetchAdminData(adminToken);
      } else {
        showMessage(data.message || "Unable to update order.");
      }
    } catch (error) {
      showMessage("Unable to update order.");
    } finally {
      setAdminLoading(false);
    }
  }

  async function updateReturnStatus(requestId, status, pickupStatus, refundStatus) {
    setAdminLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/returns/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status,
            pickupStatus,
            refundStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage("Return/exchange status updated.");
        fetchAdminData(adminToken);
      } else {
        showMessage(data.message || "Unable to update return request.");
      }
    } catch (error) {
      showMessage("Unable to update return request.");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="app-shell">
      {message && <div className="toast-message">{message}</div>}

      <header className="site-header">
        <div>
          <p className="eyebrow">AI Fashion Commerce Platform</p>
          <h1>StyleNexa AI</h1>
        </div>

        <nav>
          <a href="#shop">Shop</a>
          <a href="#outfit-builder">AI Outfit</a>
          <a href="#cart">Cart</a>
          <a href="#payment-tools">Payment</a>
          <a href="#admin">Admin</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">Premium clothing store with AI shopping intelligence</p>
            <h2>Build fashion looks, manage orders, and sell smarter with AI.</h2>
            <p>
              StyleNexa AI combines a premium streetwear storefront, smart
              product discovery, coupons, order tracking, returns, admin
              analytics, AI styling, complete-the-look recommendations, demo
              payments, and WhatsApp order updates.
            </p>

            <div className="hero-actions">
              <a href="#shop" className="primary-link">
                Explore Products
              </a>
              <a href="#payment-tools" className="secondary-link">
                Payment + WhatsApp
              </a>
            </div>
          </div>

          <div className="hero-card">
            <span>Live Features</span>
            <h3>Phase 2E Active</h3>
            <ul>
              <li>AI Outfit Builder</li>
              <li>Complete-the-Look</li>
              <li>Coupon Checkout</li>
              <li>Demo Payment Flow</li>
              <li>WhatsApp Updates</li>
            </ul>
          </div>
        </section>

        <section id="shop" className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Smart Catalog</p>
            <h2>Shop Collection</h2>
            <p>Search, filter, open product details, and build looks instantly.</p>
          </div>

          <div className="filter-panel">
            <input
              type="text"
              placeholder="Search product, color, tag..."
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sizeFilter}
              onChange={(event) => setSizeFilter(event.target.value)}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  Size {size}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="stockHigh">Stock: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span>{product.tag}</span>
                </div>

                <div className="product-card-body">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="product-meta">
                    <span>{product.color}</span>
                    <span>{(product.sizes || []).join(" / ")}</span>
                    <span>{product.stock} left</span>
                  </div>

                  <div className="price-row">
                    <strong>₹{product.price}</strong>
                    {Number(product.oldPrice || 0) > Number(product.price || 0) && (
                      <del>₹{product.oldPrice}</del>
                    )}
                  </div>

                  <div className="button-row">
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                    <button
                      className="outline-button"
                      onClick={() => openProductDetails(product)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="outfit-builder" className="section-block dark-section">
          <div className="section-heading">
            <p className="eyebrow">AI Styling</p>
            <h2>AI Outfit Builder</h2>
            <p>
              Customers enter an occasion, style, color, budget, and size.
              StyleNexa AI recommends a complete outfit from the catalog.
            </p>
          </div>

          <div className="ai-outfit-layout">
            <div className="form-card">
              <label>
                Occasion
                <input
                  type="text"
                  value={outfitForm.occasion}
                  onChange={(event) =>
                    setOutfitForm({
                      ...outfitForm,
                      occasion: event.target.value,
                    })
                  }
                  placeholder="weekend outing, office, party..."
                />
              </label>

              <label>
                Style Preference
                <input
                  type="text"
                  value={outfitForm.stylePreference}
                  onChange={(event) =>
                    setOutfitForm({
                      ...outfitForm,
                      stylePreference: event.target.value,
                    })
                  }
                  placeholder="streetwear, minimal, premium..."
                />
              </label>

              <label>
                Color Preference
                <input
                  type="text"
                  value={outfitForm.colorPreference}
                  onChange={(event) =>
                    setOutfitForm({
                      ...outfitForm,
                      colorPreference: event.target.value,
                    })
                  }
                  placeholder="black, white, olive..."
                />
              </label>

              <label>
                Budget
                <input
                  type="number"
                  value={outfitForm.budget}
                  onChange={(event) =>
                    setOutfitForm({
                      ...outfitForm,
                      budget: event.target.value,
                    })
                  }
                  placeholder="5000"
                />
              </label>

              <label>
                Size Preference
                <select
                  value={outfitForm.sizePreference}
                  onChange={(event) =>
                    setOutfitForm({
                      ...outfitForm,
                      sizePreference: event.target.value,
                    })
                  }
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </label>

              <button onClick={generateOutfit} disabled={loading}>
                {loading ? "Generating..." : "Generate AI Outfit"}
              </button>
            </div>

            <div className="outfit-result-card">
              {!outfitResult ? (
                <div className="empty-state">
                  <h3>Your AI outfit will appear here</h3>
                  <p>
                    Try weekend outing + streetwear + black + ₹5000 + size L.
                  </p>
                </div>
              ) : (
                <>
                  <p className="eyebrow">AI Recommendation</p>
                  <h3>{outfitResult.outfitName}</h3>
                  <p className="ai-reply">{outfitResult.recommendation}</p>

                  <div className="summary-grid">
                    <div>
                      <span>Occasion</span>
                      <strong>{outfitResult.occasion}</strong>
                    </div>
                    <div>
                      <span>Style</span>
                      <strong>{outfitResult.stylePreference}</strong>
                    </div>
                    <div>
                      <span>Estimated Total</span>
                      <strong>₹{outfitResult.totalEstimated}</strong>
                    </div>
                    <div>
                      <span>Mode</span>
                      <strong>{outfitResult.demoMode ? "Demo AI" : "Gemini AI"}</strong>
                    </div>
                  </div>

                  <button
                    className="full-width-button"
                    onClick={() => addMultipleToCart(outfitResult.products)}
                  >
                    Add Full Outfit to Cart
                  </button>
                </>
              )}
            </div>
          </div>

          {outfitResult?.products?.length > 0 && (
            <div className="mini-product-grid">
              {outfitResult.products.map((product) => (
                <article className="mini-product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <p>{product.category}</p>
                    <h4>{product.name}</h4>
                    <strong>₹{product.price}</strong>
                    <button onClick={() => addToCart(product)}>Add Item</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="cart" className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Checkout</p>
            <h2>Cart, Coupons & Order</h2>
            <p>Apply coupons, choose payment method, and place orders.</p>
          </div>

          <div className="cart-layout">
            <div className="cart-card">
              <h3>Cart Items</h3>

              {cart.length === 0 ? (
                <p className="muted">Cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>₹{item.price}</p>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          updateCartQuantity(item.id, event.target.value)
                        }
                      />
                    </div>
                    <button
                      className="danger-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}

              <div className="coupon-box">
                <h4>Available Coupons</h4>
                <div className="coupon-list">
                  {availableCoupons.map((coupon) => (
                    <button
                      key={coupon.code}
                      className="coupon-chip"
                      onClick={() => setCouponCode(coupon.code)}
                    >
                      <strong>{coupon.code}</strong>
                      <span>Min ₹{coupon.minCartValue}</span>
                    </button>
                  ))}
                </div>

                <div className="coupon-input-row">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <button onClick={applyCoupon} disabled={loading}>
                    Apply
                  </button>
                </div>

                {couponMessage && <p className="coupon-message">{couponMessage}</p>}
              </div>
            </div>

            <div className="checkout-card">
              <h3>Order Summary</h3>

              <div className="amount-row">
                <span>Cart Total</span>
                <strong>₹{cartTotal}</strong>
              </div>

              <div className="amount-row discount">
                <span>Discount</span>
                <strong>- ₹{discountAmount}</strong>
              </div>

              <div className="amount-row final">
                <span>Final Payable</span>
                <strong>₹{finalCartAmount}</strong>
              </div>

              <label>
                Customer Name
                <input
                  type="text"
                  value={checkoutForm.customerName}
                  onChange={(event) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      customerName: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(event) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      email: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Phone
                <input
                  type="text"
                  value={checkoutForm.phone}
                  onChange={(event) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      phone: event.target.value,
                    })
                  }
                  placeholder="10-digit phone for WhatsApp update"
                />
              </label>

              <label>
                Payment Method
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={(event) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      paymentMethod: event.target.value,
                    })
                  }
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Demo UPI Payment">Demo UPI Payment</option>
                  <option value="Demo Card Payment">Demo Card Payment</option>
                </select>
              </label>

              <label>
                Address
                <textarea
                  value={checkoutForm.address}
                  onChange={(event) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      address: event.target.value,
                    })
                  }
                />
              </label>

              <button onClick={placeOrder} disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </section>

        <section id="payment-tools" className="section-block split-section">
          <div>
            <div className="section-heading left-heading">
              <p className="eyebrow">Phase 2E</p>
              <h2>Demo Payment</h2>
              <p>Simulate payment completion and generate payment reference.</p>
            </div>

            <div className="form-card payment-card">
              <label>
                Order ID
                <input
                  type="text"
                  value={paymentForm.orderId}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      orderId: event.target.value,
                    })
                  }
                  placeholder="Example: 1"
                />
              </label>

              <label>
                Order Email
                <input
                  type="email"
                  value={paymentForm.email}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="Email used during checkout"
                />
              </label>

              <label>
                Payment Method
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: event.target.value,
                    })
                  }
                >
                  <option value="Demo UPI Payment">Demo UPI Payment</option>
                  <option value="Demo Card Payment">Demo Card Payment</option>
                  <option value="Demo Net Banking">Demo Net Banking</option>
                </select>
              </label>

              <button onClick={completeDemoPayment} disabled={loading}>
                {loading ? "Processing..." : "Complete Demo Payment"}
              </button>

              <button
                className="outline-button"
                onClick={generateCustomerWhatsappUpdate}
                disabled={loading}
              >
                Generate WhatsApp Update
              </button>
            </div>

            {paymentResult && (
              <div className="result-card payment-result-card">
                <p className="success-badge">Payment Successful</p>
                <h3>Order #{paymentResult.orderId}</h3>
                <p>Status: {paymentResult.paymentStatus}</p>
                <p>Method: {paymentResult.paymentMethod}</p>
                <p>Reference: {paymentResult.paymentReference}</p>
                <p>Amount: ₹{paymentResult.finalAmount}</p>
              </div>
            )}
          </div>

          <div>
            <div className="section-heading left-heading">
              <p className="eyebrow">WhatsApp</p>
              <h2>Order Update Message</h2>
              <p>Copy the message or open WhatsApp directly.</p>
            </div>

            <div className="whatsapp-box">
              {!whatsappResult ? (
                <div className="empty-state light-empty">
                  <h3>No WhatsApp message yet</h3>
                  <p>
                    Place an order, complete demo payment, or generate update
                    using order ID and email.
                  </p>
                </div>
              ) : (
                <>
                  <div className="whatsapp-status-row">
                    <span
                      className={
                        whatsappResult.phoneAvailable
                          ? "success-badge"
                          : "warning-badge"
                      }
                    >
                      {whatsappResult.phoneAvailable
                        ? "Phone Available"
                        : "Phone Missing"}
                    </span>
                  </div>

                  <textarea
                    className="whatsapp-message-area"
                    value={whatsappResult.message || ""}
                    readOnly
                  />

                  <div className="whatsapp-actions">
                    <button
                      onClick={() =>
                        copyText(
                          whatsappResult.message,
                          "WhatsApp message copied."
                        )
                      }
                    >
                      Copy Message
                    </button>

                    <button
                      className="outline-button"
                      onClick={() => openWhatsAppLink(whatsappResult.link)}
                    >
                      Open WhatsApp
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="tracking" className="section-block split-section">
          <div>
            <div className="section-heading left-heading">
              <p className="eyebrow">Customer</p>
              <h2>Track Order</h2>
            </div>

            <div className="form-card">
              <label>
                Order ID
                <input
                  type="text"
                  value={trackForm.orderId}
                  onChange={(event) =>
                    setTrackForm({
                      ...trackForm,
                      orderId: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={trackForm.email}
                  onChange={(event) =>
                    setTrackForm({
                      ...trackForm,
                      email: event.target.value,
                    })
                  }
                />
              </label>

              <button onClick={trackOrder}>Track Order</button>
            </div>

            {trackedOrder && (
              <div className="result-card">
                <h3>Order #{trackedOrder.order.id}</h3>
                <p>Status: {trackedOrder.tracking.status}</p>
                <p>Payment: {trackedOrder.tracking.paymentStatus}</p>
                <p>Payment Method: {trackedOrder.tracking.paymentMethod}</p>
                <p>
                  Payment Ref:{" "}
                  {trackedOrder.tracking.paymentReference || "Not available"}
                </p>
                <p>Coupon: {trackedOrder.tracking.couponCode || "No Coupon"}</p>
                <p>Discount: ₹{trackedOrder.tracking.discountAmount || 0}</p>
                <p>Final Amount: ₹{trackedOrder.tracking.finalAmount}</p>

                <div className="button-row">
                  <button
                    onClick={() =>
                      setPaymentForm({
                        orderId: String(trackedOrder.order.id),
                        email: trackedOrder.order.email,
                        paymentMethod: "Demo UPI Payment",
                      })
                    }
                  >
                    Use for Payment
                  </button>

                  <button
                    className="outline-button"
                    onClick={() => {
                      setPaymentForm({
                        orderId: String(trackedOrder.order.id),
                        email: trackedOrder.order.email,
                        paymentMethod: "Demo UPI Payment",
                      });
                      setWhatsappResult(trackedOrder.whatsappUpdate || null);
                    }}
                  >
                    Show WhatsApp
                  </button>
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
              </div>
            )}
          </div>

          <div>
            <div className="section-heading left-heading">
              <p className="eyebrow">Dashboard</p>
              <h2>Customer Dashboard</h2>
            </div>

            <div className="form-card">
              <label>
                Customer Email
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
              </label>

              <button onClick={loadCustomerDashboard}>Load Dashboard</button>
            </div>

            {customerDashboard && (
              <div className="result-card">
                <div className="summary-grid">
                  <div>
                    <span>Total Orders</span>
                    <strong>{customerDashboard.customer.totalOrders}</strong>
                  </div>
                  <div>
                    <span>Active Orders</span>
                    <strong>{customerDashboard.customer.activeOrders}</strong>
                  </div>
                  <div>
                    <span>Paid Orders</span>
                    <strong>{customerDashboard.customer.paidOrders || 0}</strong>
                  </div>
                  <div>
                    <span>Total Spent</span>
                    <strong>₹{customerDashboard.customer.totalSpent}</strong>
                  </div>
                  <div>
                    <span>Total Saved</span>
                    <strong>₹{customerDashboard.customer.totalSaved}</strong>
                  </div>
                </div>

                <h4>Recent Orders</h4>
                {customerDashboard.orders.slice(0, 5).map((order) => (
                  <div className="compact-row" key={order.id}>
                    <span>#{order.id}</span>
                    <span>{order.status}</span>
                    <span>{order.paymentStatus}</span>
                    <strong>₹{order.finalAmount || order.totalAmount}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section-block dark-section">
          <div className="section-heading">
            <p className="eyebrow">AI Studio</p>
            <h2>Stylist, Size Guide & Product Copy</h2>
          </div>

          <div className="three-column-grid">
            <div className="form-card">
              <h3>AI Stylist</h3>
              <textarea
                value={stylistMessage}
                onChange={(event) => setStylistMessage(event.target.value)}
                placeholder="Suggest an outfit for college..."
              />
              <button onClick={askStylist}>Ask Stylist</button>
              {stylistReply && <p className="ai-reply">{stylistReply}</p>}
            </div>

            <div className="form-card">
              <h3>AI Size Guide</h3>
              <input
                type="text"
                placeholder="Height"
                value={sizeForm.height}
                onChange={(event) =>
                  setSizeForm({
                    ...sizeForm,
                    height: event.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Weight"
                value={sizeForm.weight}
                onChange={(event) =>
                  setSizeForm({
                    ...sizeForm,
                    weight: event.target.value,
                  })
                }
              />
              <select
                value={sizeForm.preferredFit}
                onChange={(event) =>
                  setSizeForm({
                    ...sizeForm,
                    preferredFit: event.target.value,
                  })
                }
              >
                <option value="Slim">Slim</option>
                <option value="Regular">Regular</option>
                <option value="Relaxed">Relaxed</option>
                <option value="Oversized">Oversized</option>
              </select>
              <input
                type="text"
                placeholder="Product name"
                value={sizeForm.productName}
                onChange={(event) =>
                  setSizeForm({
                    ...sizeForm,
                    productName: event.target.value,
                  })
                }
              />
              <button onClick={generateSizeGuide}>Generate Size Guide</button>
              {sizeReply && <p className="ai-reply">{sizeReply}</p>}
            </div>

            <div className="form-card">
              <h3>Product Description AI</h3>
              <input
                type="text"
                placeholder="Product name"
                value={productAiForm.productName}
                onChange={(event) =>
                  setProductAiForm({
                    ...productAiForm,
                    productName: event.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Category"
                value={productAiForm.category}
                onChange={(event) =>
                  setProductAiForm({
                    ...productAiForm,
                    category: event.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Color"
                value={productAiForm.color}
                onChange={(event) =>
                  setProductAiForm({
                    ...productAiForm,
                    color: event.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Target audience"
                value={productAiForm.targetAudience}
                onChange={(event) =>
                  setProductAiForm({
                    ...productAiForm,
                    targetAudience: event.target.value,
                  })
                }
              />
              <button onClick={generateProductDescription}>Generate Copy</button>
              {productAiReply && <p className="ai-reply">{productAiReply}</p>}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Post Purchase</p>
            <h2>Return / Exchange Request</h2>
          </div>

          <div className="form-card wide-form">
            <div className="form-grid">
              <label>
                Order ID
                <input
                  type="text"
                  value={returnForm.orderId}
                  onChange={(event) =>
                    setReturnForm({
                      ...returnForm,
                      orderId: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Customer Name
                <input
                  type="text"
                  value={returnForm.customerName}
                  onChange={(event) =>
                    setReturnForm({
                      ...returnForm,
                      customerName: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={returnForm.email}
                  onChange={(event) =>
                    setReturnForm({
                      ...returnForm,
                      email: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Product Name
                <input
                  type="text"
                  value={returnForm.productName}
                  onChange={(event) =>
                    setReturnForm({
                      ...returnForm,
                      productName: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Size
                <input
                  type="text"
                  value={returnForm.size}
                  onChange={(event) =>
                    setReturnForm({
                      ...returnForm,
                      size: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Request Type
                <select
                  value={returnForm.requestType}
                  onChange={(event) =>
                    setReturnForm({
                      ...returnForm,
                      requestType: event.target.value,
                    })
                  }
                >
                  <option value="Return">Return</option>
                  <option value="Exchange">Exchange</option>
                  <option value="Refund">Refund</option>
                </select>
              </label>
            </div>

            <label>
              Reason
              <textarea
                value={returnForm.reason}
                onChange={(event) =>
                  setReturnForm({
                    ...returnForm,
                    reason: event.target.value,
                  })
                }
              />
            </label>

            <button onClick={submitReturnRequest}>Submit Request</button>
          </div>
        </section>

        <section id="admin" className="section-block admin-section">
          <div className="section-heading">
            <p className="eyebrow">Business Panel</p>
            <h2>Admin Dashboard</h2>
            <p>Manage inventory, orders, returns, payments, WhatsApp updates, and revenue analytics.</p>
          </div>

          {!adminToken ? (
            <div className="form-card admin-login-card">
              <h3>Admin Login</h3>

              <label>
                Username
                <input
                  type="text"
                  value={adminLogin.username}
                  onChange={(event) =>
                    setAdminLogin({
                      ...adminLogin,
                      username: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={adminLogin.password}
                  onChange={(event) =>
                    setAdminLogin({
                      ...adminLogin,
                      password: event.target.value,
                    })
                  }
                />
              </label>

              <button onClick={adminLoginSubmit} disabled={adminLoading}>
                Login
              </button>
            </div>
          ) : (
            <div className="admin-dashboard">
              <div className="admin-topbar">
                <h3>StyleNexa Admin</h3>
                <div>
                  <button
                    className="outline-button"
                    onClick={() => fetchAdminData(adminToken)}
                  >
                    Refresh
                  </button>
                  <button className="danger-button" onClick={adminLogout}>
                    Logout
                  </button>
                </div>
              </div>

              {adminSummary && (
                <div className="summary-grid admin-summary-grid">
                  <div>
                    <span>Products</span>
                    <strong>{adminSummary.totalProducts}</strong>
                  </div>
                  <div>
                    <span>Orders</span>
                    <strong>{adminSummary.totalOrders}</strong>
                  </div>
                  <div>
                    <span>Total Revenue</span>
                    <strong>₹{adminSummary.totalRevenue}</strong>
                  </div>
                  <div>
                    <span>Paid Revenue</span>
                    <strong>₹{adminSummary.paidRevenue || 0}</strong>
                  </div>
                  <div>
                    <span>Inventory</span>
                    <strong>{adminSummary.totalInventory}</strong>
                  </div>
                  <div>
                    <span>Returns</span>
                    <strong>{adminSummary.totalReturnRequests}</strong>
                  </div>
                </div>
              )}

              {adminAnalytics && (
                <div className="analytics-panel">
                  <h3>Revenue Analytics</h3>

                  <div className="summary-grid">
                    <div>
                      <span>Gross Revenue</span>
                      <strong>₹{adminAnalytics.grossRevenue}</strong>
                    </div>
                    <div>
                      <span>Discount Given</span>
                      <strong>₹{adminAnalytics.totalDiscountGiven}</strong>
                    </div>
                    <div>
                      <span>Net Revenue</span>
                      <strong>₹{adminAnalytics.netRevenue}</strong>
                    </div>
                    <div>
                      <span>Paid Revenue</span>
                      <strong>₹{adminAnalytics.paidRevenue || 0}</strong>
                    </div>
                    <div>
                      <span>Paid Orders</span>
                      <strong>{adminAnalytics.paidOrders || 0}</strong>
                    </div>
                    <div>
                      <span>Pending Payment</span>
                      <strong>{adminAnalytics.pendingPaymentOrders || 0}</strong>
                    </div>
                  </div>

                  <div className="analytics-grid">
                    <div>
                      <h4>Payment Methods</h4>
                      {Object.entries(adminAnalytics.paymentMethodCounts || {}).map(
                        ([method, count]) => (
                          <div className="compact-row" key={method}>
                            <span>{method}</span>
                            <strong>{count}</strong>
                          </div>
                        )
                      )}
                    </div>

                    <div>
                      <h4>Coupon Usage</h4>
                      {Object.entries(adminAnalytics.couponUsage || {}).map(
                        ([code, count]) => (
                          <div className="compact-row" key={code}>
                            <span>{code}</span>
                            <strong>{count}</strong>
                          </div>
                        )
                      )}
                    </div>

                    <div>
                      <h4>Top Products</h4>
                      {(adminAnalytics.topProducts || []).map((product) => (
                        <div className="compact-row" key={product.productName}>
                          <span>{product.productName}</span>
                          <strong>{product.quantitySold}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="admin-grid">
                <div className="form-card">
                  <h3>Add Product</h3>

                  <input
                    type="text"
                    placeholder="Name"
                    value={newProductForm.name}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        name: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newProductForm.category}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        category: event.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProductForm.price}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        price: event.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Old Price"
                    value={newProductForm.oldPrice}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        oldPrice: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Color"
                    value={newProductForm.color}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        color: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Sizes: S,M,L,XL"
                    value={newProductForm.sizes}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        sizes: event.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProductForm.stock}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        stock: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Tag"
                    value={newProductForm.tag}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        tag: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProductForm.image}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        image: event.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={newProductForm.description}
                    onChange={(event) =>
                      setNewProductForm({
                        ...newProductForm,
                        description: event.target.value,
                      })
                    }
                  />

                  <button onClick={addAdminProduct} disabled={adminLoading}>
                    Add Product
                  </button>
                </div>

                <div className="admin-list-card">
                  <h3>Inventory</h3>

                  {products.map((product) => (
                    <div className="admin-list-row" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        <p>
                          ₹{product.price} · {product.stock} stock
                        </p>
                      </div>
                      <button
                        className="danger-button"
                        onClick={() => deleteAdminProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-table-card">
                <h3>Orders, Payment & WhatsApp</h3>

                {adminOrders.length === 0 ? (
                  <p className="muted">No orders yet.</p>
                ) : (
                  adminOrders.map((order) => {
                    const adminWhatsapp = adminWhatsappUpdates[order.id];

                    return (
                      <div className="admin-order-card" key={order.id}>
                        <div>
                          <h4>
                            #{order.id} · {order.customerName}
                          </h4>
                          <p>{order.email}</p>
                          <p>Phone: {order.phone || "Not available"}</p>
                          <p>
                            Cart ₹{order.totalAmount} · Discount ₹
                            {order.discountAmount || 0} · Final ₹
                            {order.finalAmount || order.totalAmount}
                          </p>
                          <p>Payment: {order.paymentStatus}</p>
                          <p>Method: {order.paymentMethod || "Not updated"}</p>
                          <p>Ref: {order.paymentReference || "Not generated"}</p>
                          <p>Coupon: {order.couponCode || "No Coupon"}</p>

                          <div className="whatsapp-actions admin-whatsapp-actions">
                            <button
                              onClick={() => generateAdminWhatsappUpdate(order.id)}
                            >
                              Generate WhatsApp
                            </button>

                            {adminWhatsapp && (
                              <>
                                <button
                                  className="outline-button"
                                  onClick={() =>
                                    copyText(
                                      adminWhatsapp.whatsappMessage,
                                      "Admin WhatsApp message copied."
                                    )
                                  }
                                >
                                  Copy
                                </button>

                                <button
                                  className="outline-button"
                                  onClick={() =>
                                    openWhatsAppLink(adminWhatsapp.whatsappLink)
                                  }
                                >
                                  Open WhatsApp
                                </button>
                              </>
                            )}
                          </div>

                          {adminWhatsapp && (
                            <textarea
                              className="whatsapp-message-area admin-whatsapp-textarea"
                              value={adminWhatsapp.whatsappMessage}
                              readOnly
                            />
                          )}
                        </div>

                        <div className="status-controls">
                          <select
                            value={order.status}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                event.target.value,
                                order.paymentStatus,
                                order.paymentMethod
                              )
                            }
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <select
                            value={order.paymentStatus}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                order.status,
                                event.target.value,
                                order.paymentMethod
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                          </select>

                          <select
                            value={order.paymentMethod || "Cash on Delivery"}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                order.status,
                                order.paymentStatus,
                                event.target.value
                              )
                            }
                          >
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Demo UPI Payment">Demo UPI Payment</option>
                            <option value="Demo Card Payment">Demo Card Payment</option>
                            <option value="Razorpay Payment">Razorpay Payment</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="admin-table-card">
                <h3>Returns / Exchanges</h3>

                {adminReturns.length === 0 ? (
                  <p className="muted">No return requests yet.</p>
                ) : (
                  adminReturns.map((request) => (
                    <div className="admin-order-card" key={request.id}>
                      <div>
                        <h4>
                          #{request.id} · Order {request.orderId}
                        </h4>
                        <p>
                          {request.customerName} · {request.requestType}
                        </p>
                        <p>{request.reason}</p>
                      </div>

                      <div className="status-controls">
                        <select
                          value={request.status}
                          onChange={(event) =>
                            updateReturnStatus(
                              request.id,
                              event.target.value,
                              request.pickupStatus,
                              request.refundStatus
                            )
                          }
                        >
                          <option value="Pending Admin Review">
                            Pending Admin Review
                          </option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <select
                          value={request.pickupStatus}
                          onChange={(event) =>
                            updateReturnStatus(
                              request.id,
                              request.status,
                              event.target.value,
                              request.refundStatus
                            )
                          }
                        >
                          <option value="Not Scheduled">Not Scheduled</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Picked Up">Picked Up</option>
                        </select>

                        <select
                          value={request.refundStatus}
                          onChange={(event) =>
                            updateReturnStatus(
                              request.id,
                              request.status,
                              request.pickupStatus,
                              event.target.value
                            )
                          }
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div className="modal-product-layout">
              <img src={selectedProduct.image} alt={selectedProduct.name} />

              <div>
                <p className="eyebrow">{selectedProduct.category}</p>
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.description}</p>

                <div className="product-meta modal-meta">
                  <span>{selectedProduct.color}</span>
                  <span>{(selectedProduct.sizes || []).join(" / ")}</span>
                  <span>{selectedProduct.stock} in stock</span>
                </div>

                <div className="price-row modal-price">
                  <strong>₹{selectedProduct.price}</strong>
                  {Number(selectedProduct.oldPrice || 0) >
                    Number(selectedProduct.price || 0) && (
                    <del>₹{selectedProduct.oldPrice}</del>
                  )}
                </div>

                <button onClick={() => addToCart(selectedProduct)}>
                  Add Main Product to Cart
                </button>
              </div>
            </div>

            <div className="complete-look-panel">
              <div className="section-heading left-heading">
                <p className="eyebrow">AI Complete-the-Look</p>
                <h3>Recommended with {selectedProduct.name}</h3>
              </div>

              {completeLookLoading ? (
                <p className="muted">Loading recommendations...</p>
              ) : completeLookProducts.length === 0 ? (
                <p className="muted">No complete-the-look products found.</p>
              ) : (
                <>
                  <div className="mini-product-grid">
                    {completeLookProducts.map((product) => (
                      <article className="mini-product-card" key={product.id}>
                        <img src={product.image} alt={product.name} />
                        <div>
                          <p>{product.category}</p>
                          <h4>{product.name}</h4>
                          <strong>₹{product.price}</strong>
                          <button onClick={() => addToCart(product)}>
                            Add Item
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    className="full-width-button"
                    onClick={() => addMultipleToCart(completeLookProducts)}
                  >
                    Add Complete Look to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;