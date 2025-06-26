// === INISIALISASI AOS ===
AOS.init({ duration: 1000, once: false });

// === DATA SEPATU ===
const shoes = [
  { id: 1, image: "1.png", title: "Red Blaze", desc: "🔥 Red Blaze – Sepatu merah menyala yang bikin lo langsung jadi pusat perhatian! Didesain sporty & stylish, nyaman dipake buat olahraga, nongkrong, sampai OOTD-an.", price: "Rp 499.000", bg: "linear-gradient(135deg,#8b0000,#FF0000)" },
  { id: 2, image: "2.png", title: "Golden Strike", desc: "🌟 Golden Strike – Kesan mewah dari warna emas-oranye. Cocok buat lo yang suka tampil classy tapi tetap energik!", price: "Rp 499.000", bg: "linear-gradient(135deg,#FFD700,#FFA500)" },
  { id: 3, image: "3.png", title: "Vintage Gold", desc: "🏆 Vintage Gold – Sepatu gaya klasik dengan warna keemasan retro yang bikin lo tampil dewasa tapi tetap keren!", price: "Rp 499.000", bg: "linear-gradient(135deg,#DAA520,#FFD700)" },
  { id: 4, image: "4.png", title: "Ocean Rush", desc: "💧 Ocean Rush – Warna biru deep & soft buat lo yang suka vibes adem tapi tetep sporty!", price: "Rp 499.000", bg: "linear-gradient(135deg,#00008B,#1E90FF)" }
];

// === GLOBAL STATE ===
// Pastikan cart selalu array dan bisa diakses global
if (!window.cart) {
  window.cart = [];
}
let wishlist = [];
let currentQty = 1;
let selectedSize = '39';

// === DOM ELEMENTS ===
const mainShoe = document.getElementById('mainShoe');
const shoeTitle = document.getElementById('shoeTitle');
const shoeDesc = document.getElementById('shoeDesc');
const shoePrice = document.getElementById('shoePrice');
const produkSection = document.getElementById('produk');
const icons = document.querySelectorAll('#produk .icon');

// === SHOE SWITCH ===
function updateShoe(id) {
  showLoading();
  setTimeout(() => {
    const shoe = shoes.find(s => s.id === id);
    if (!shoe) {
      hideLoading();
      return;
    }
    mainShoe.src = shoe.image;
    shoeTitle.textContent = shoe.title;
    shoeDesc.textContent = shoe.desc;
    shoePrice.textContent = shoe.price;
    produkSection.style.background = shoe.bg;

    icons.forEach(icon => {
      icon.classList.toggle('active', parseInt(icon.dataset.shoe) === id);
    });
    hideLoading();
  }, 800);
}

icons.forEach(icon => {
  icon.addEventListener('click', () => {
    const id = parseInt(icon.dataset.shoe);
    updateShoe(id);
  });
});

// === CART FUNCTIONS ===
function addToCart() {
  const shoeTitleEl = document.getElementById('shoeTitle');
  if (!shoeTitleEl || !shoeTitleEl.textContent) {
    showToast("Sepatu tidak ditemukan!", "error");
    return;
  }

  const currentShoe = shoes.find(s => s.title === shoeTitleEl.textContent);
  if (!currentShoe) {
    showToast("Produk tidak tersedia di katalog!", "error");
    return;
  }

  const item = {
    id: Date.now(),
    name: currentShoe.title,
    price: 499000,
    size: selectedSize,
    qty: currentQty,
    image: currentShoe.image
  };
  
  // Pastikan cart array dan push item
  if (!Array.isArray(window.cart)) {
    window.cart = [];
  }
  
  window.cart.push(item);
  console.log('Item added to cart:', item); // Debug log
  console.log('Current cart:', window.cart); // Debug log
  
  updateCartBadge();
  showToast(`${item.name} (Size ${item.size}) berhasil ditambahkan ke cart!`, 'success');
}

function addToCartFromCatalog(name, price) {
  const item = {
    id: Date.now(),
    name: name,
    price: price,
    size: '39',
    qty: 1,
    image: getImageByName(name)
  };
  
  // Pastikan cart array dan push item
  if (!Array.isArray(window.cart)) {
    window.cart = [];
  }
  
  window.cart.push(item);
  console.log('Item added from catalog:', item); // Debug log
  console.log('Current cart:', window.cart); // Debug log
  
  updateCartBadge();
  showToast(`${name} berhasil ditambahkan ke cart!`, 'success');
}

function getImageByName(name) {
  const shoe = shoes.find(s => s.title === name);
  return shoe ? shoe.image : '1.png';
}

function updateCartBadge() {
  const cartBadgeEl = document.getElementById('cartBadge');
  if (cartBadgeEl) {
    const cartLength = Array.isArray(window.cart) ? window.cart.length : 0;
    cartBadgeEl.textContent = cartLength;
    console.log('Cart badge updated:', cartLength); // Debug log
  }
}

function toggleCart() {
  console.log('Toggle cart called, cart length:', window.cart ? window.cart.length : 0); // Debug log
  
  // Pastikan cart ada dan cek apakah kosong
  if (!Array.isArray(window.cart) || window.cart.length === 0) {
    showToast('Cart masih kosong!', 'warning');
    return;
  }
  
  let cartItems = window.cart.map(item =>
    `${item.name} (Size ${item.size}) x${item.qty} - Rp ${item.price.toLocaleString()}`
  ).join('\n');
  
  // Hitung total
  const total = window.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  alert("Isi Keranjang:\n\n" + cartItems + "\n\nTotal: Rp " + total.toLocaleString());
}

// === CLEAR CART FUNCTION (tambahan) ===
function clearCart() {
  window.cart = [];
  updateCartBadge();
  showToast('Cart berhasil dikosongkan!', 'info');
}

// === WISHLIST ===
function toggleWishlist(btn) {
  const productName = btn.closest('.card').querySelector('h5').textContent;
  const icon = btn.querySelector('i');
  if (icon.classList.contains('far')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    btn.classList.add('active');
    wishlist.push(productName);
    showToast(`${productName} ditambahkan ke wishlist!`, 'success');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    btn.classList.remove('active');
    wishlist = wishlist.filter(item => item !== productName);
    showToast(`${productName} dihapus dari wishlist!`, 'info');
  }
}

// === SIZE & QUANTITY ===
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedSize = this.dataset.size;
  });
});

function increaseQty() {
  if (currentQty < 10) currentQty++;
  const qtyDisplay = document.getElementById('qtyDisplay');
  if (qtyDisplay) {
    qtyDisplay.textContent = currentQty;
  }
}

function decreaseQty() {
  if (currentQty > 1) currentQty--;
  const qtyDisplay = document.getElementById('qtyDisplay');
  if (qtyDisplay) {
    qtyDisplay.textContent = currentQty;
  }
}

// === QUICK VIEW ===
function quickView(productName) {
  const shoe = shoes.find(s => s.title === productName);
  if (!shoe) return;
  
  const modalTitle = document.getElementById('modalTitle');
  const modalProductName = document.getElementById('modalProductName');
  const modalImage = document.getElementById('modalImage');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  
  if (modalTitle) modalTitle.textContent = productName;
  if (modalProductName) modalProductName.textContent = productName;
  if (modalImage) modalImage.src = shoe.image;
  if (modalDescription) modalDescription.textContent = shoe.desc;
  if (modalPrice) modalPrice.textContent = shoe.price;
  
  const modal = document.getElementById('quickViewModal');
  if (modal && typeof bootstrap !== 'undefined') {
    new bootstrap.Modal(modal).show();
  }
}

function addToCartFromModal() {
  const modalProductName = document.getElementById('modalProductName');
  if (modalProductName && modalProductName.textContent) {
    addToCartFromCatalog(modalProductName.textContent, 499000);
    
    const modal = document.getElementById('quickViewModal');
    if (modal && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}

// === SEARCH & FILTER ===
function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  document.querySelectorAll('.product-item').forEach(product => {
    const productName = product.querySelector('h5');
    const productDesc = product.querySelector('.text-muted');
    
    if (productName && productDesc) {
      const nameText = productName.textContent.toLowerCase();
      const descText = productDesc.textContent.toLowerCase();
      product.style.display = (nameText.includes(searchTerm) || descText.includes(searchTerm)) ? 'block' : 'none';
    }
  });
}

// Event listener untuk search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchProducts();
  });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.product-item').forEach(product => {
      const categories = product.dataset.category ? product.dataset.category.split(' ') : [];
      product.style.display = (filter === 'all' || categories.includes(filter)) ? 'block' : 'none';
    });
  });
});

// === UTILITIES ===
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    // Fallback jika toast container tidak ada
    console.log(`Toast: ${message} (${type})`);
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `${icons[type]} ${message}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
}

function openChat() {
  showToast('Menghubungkan ke customer service...', 'info');
  setTimeout(() => {
    alert('Hi! Ada yang bisa kami bantu?\n\nWhatsApp: +62 87794528713\nEmail: ihyaneed10ms@gmail.com\nJam Kerja: 09:00 - 21:00');
  }, 1000);
}

function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  if (!emailInput) return;
  
  const email = emailInput.value;
  if (!email) return showToast('Masukkan email dulu ya!', 'warning');
  if (!email.includes('@')) return showToast('Format email tidak valid!', 'error');
  showToast('Berhasil subscribe newsletter! Check email kamu ya 📧', 'success');
  emailInput.value = '';
}

// === BUY NOW FUNCTION ===
function buyNow() {
  const shoeTitleEl = document.getElementById('shoeTitle');
  if (!shoeTitleEl || !shoeTitleEl.textContent) {
    showToast('Pilih produk dulu ya!', 'warning');
    return;
  }
  
  const productName = shoeTitleEl.textContent;
  const item = {
    name: productName,
    size: selectedSize,
    qty: currentQty
  };
  window.location.href = `https://wa.me/6287794528713?text=Halo%20saya%20mau%20beli%20${encodeURIComponent(item.name)}%20(size%20${item.size})%20x${item.qty}`;
}

// === INIT ===
// Initialize cart badge saat load
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateShoe(1);
});

// Promo banner auto hide
setTimeout(() => {
  const banner = document.querySelector('.promo-banner');
  if (banner) {
    banner.style.transform = 'translateY(-100%)';
    setTimeout(() => banner.remove(), 500);
  }
}, 10000);

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("mainNavbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// 3D shoe effect
document.addEventListener('mousemove', function(e) {
  const shoe = document.getElementById('mainShoe');
  if (!shoe) return;
  
  const rect = shoe.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotateX = (y / rect.height) * 10;
  const rotateY = (x / rect.width) * 10;
  shoe.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
});

const mainShoeEl = document.getElementById('mainShoe');
if (mainShoeEl) {
  mainShoeEl.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// === AOS RESET ANIMATIONS ON SCROLL DOWN ===
document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('[data-aos]');
  elements.forEach(el => {
    el.classList.remove('aos-animate');
    void el.offsetWidth; // Force reflow
    el.classList.add('aos-animate');
  });
});