// ===== Products JavaScript =====

// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "smartphones",
        brand: "apple",
        price: 999,
        image: "iphone-15-pro",
        description: "The ultimate iPhone experience with titanium design and advanced camera system.",
        featured: true,
        badge: "New"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "smartphones",
        brand: "samsung",
        price: 849,
        image: "galaxy-s24",
        description: "Powerful Android smartphone with AI features and stunning display.",
        featured: true,
        badge: "Popular"
    },
    {
        id: 3,
        name: "MacBook Pro 16\"",
        category: "laptops",
        brand: "apple",
        price: 2399,
        image: "macbook-pro",
        description: "Professional laptop with M3 chip for extreme performance.",
        featured: true,
        badge: "Pro"
    },
    {
        id: 4,
        name: "Dell XPS 15",
        category: "laptops",
        brand: "dell",
        price: 1699,
        image: "dell-xps",
        description: "Sleek design with powerful Intel processor and stunning display.",
        featured: false,
        badge: "Best Seller"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        category: "audio",
        brand: "sony",
        price: 399,
        image: "sony-headphones",
        description: "Industry-leading noise cancellation with exceptional sound quality.",
        featured: true,
        badge: "Top Rated"
    },
    {
        id: 6,
        name: "iPad Pro 12.9\"",
        category: "tablets",
        brand: "apple",
        price: 1099,
        image: "ipad-pro",
        description: "Professional tablet with M2 chip and Liquid Retina XDR display.",
        featured: false,
        badge: "New"
    },
    {
        id: 7,
        name: "Samsung Galaxy Tab S9",
        category: "tablets",
        brand: "samsung",
        price: 799,
        image: "galaxy-tab",
        description: "Premium Android tablet with S Pen and AMOLED display.",
        featured: false,
        badge: null
    },
    {
        id: 8,
        name: "AirPods Pro",
        category: "audio",
        brand: "apple",
        price: 249,
        image: "airpods-pro",
        description: "Wireless earbuds with active noise cancellation and spatial audio.",
        featured: true,
        badge: "Popular"
    },
    {
        id: 9,
        name: "Apple Watch Series 9",
        category: "accessories",
        brand: "apple",
        price: 399,
        image: "apple-watch",
        description: "Advanced smartwatch with health monitoring and fitness tracking.",
        featured: false,
        badge: "New"
    },
    {
        id: 10,
        name: "Samsung Galaxy Watch",
        category: "accessories",
        brand: "samsung",
        price: 299,
        image: "galaxy-watch",
        description: "Smartwatch with comprehensive health tracking and long battery life.",
        featured: false,
        badge: null
    },
    {
        id: 11,
        name: "PlayStation 5",
        category: "accessories",
        brand: "sony",
        price: 499,
        image: "ps5",
        description: "Next-generation gaming console with stunning graphics and performance.",
        featured: true,
        badge: "Hot"
    },
    {
        id: 12,
        name: "Magic Keyboard",
        category: "accessories",
        brand: "apple",
        price: 299,
        image: "magic-keyboard",
        description: "Wireless keyboard with touch ID and numeric keypad.",
        featured: false,
        badge: null
    }
];

// Global variables for products page
let filteredProducts = [...products];
let currentPage = 1;
const productsPerPage = 8;

// ===== Product Display Functions =====
function displayProducts(productsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <i class="fas fa-mobile-alt"></i>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary quick-view-btn" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to new buttons
    initializeProductInteractions();
}

function displayFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    displayProducts(featuredProducts, 'featured-products');
}

function displayRecommendedProducts() {
    const recommendedProducts = products
        .filter(product => !product.featured)
        .slice(0, 4);
    displayProducts(recommendedProducts, 'recommended-products');
}

// ===== Filtering and Sorting =====
function filterProducts() {
    const selectedCategories = getSelectedFilters('.category-filter');
    const selectedBrands = getSelectedFilters('.brand-filter');
    const maxPrice = parseInt(document.getElementById('price-slider')?.value) || 2000;
    
    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = product.price <= maxPrice;
        
        return categoryMatch && brandMatch && priceMatch;
    });
    
    // Apply sorting
    applySorting();
    
    // Update pagination
    currentPage = 1;
    updatePagination();
    
    // Display products for current page
    displayPaginatedProducts();
}

function getSelectedFilters(selector) {
    const checkboxes = document.querySelectorAll(`${selector}:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function applySorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;
    
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default sorting (featured first, then by ID)
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return a.id - b.id;
            });
    }
}

// ===== Pagination =====
function displayPaginatedProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    displayProducts(productsToShow, 'products-grid');
    updateProductsCount();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentPageElement = document.getElementById('current-page');
    const totalPagesElement = document.getElementById('total-pages');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (currentPageElement) currentPageElement.textContent = currentPage;
    if (totalPagesElement) totalPagesElement.textContent = totalPages;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function updateProductsCount() {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayPaginatedProducts();
    updatePagination();
    
    // Scroll to top of products
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== Product Interactions =====
function initializeProductInteractions() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productData = JSON.parse(this.getAttribute('data-product').replace(/&#39;/g, "'"));
            addToCart(productData);
        });
    });
    
    // Quick view buttons
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            showQuickView(productId);
        });
    });
}

function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create quick view modal
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'quick-view-modal';
    quickViewModal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view"><i class="fas fa-times"></i></button>
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <i class="fas fa-mobile-alt"></i>
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="quick-view-details">
                    <div class="product-category">${product.category}</div>
                    <h2>${product.name}</h2>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-features">
                        <h4>Key Features</h4>
                        <ul>
                            <li>Premium quality materials</li>
                            <li>1-year manufacturer warranty</li>
                            <li>Free shipping available</li>
                            <li>24/7 customer support</li>
                        </ul>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart-btn" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-heart"></i>
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    quickViewModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const quickViewContent = quickViewModal.querySelector('.quick-view-content');
    quickViewContent.style.cssText = `
        background: var(--background-color);
        border-radius: 12px;
        padding: 2rem;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(quickViewModal);
    
    // Animate in
    setTimeout(() => {
        quickViewModal.style.opacity = '1';
        quickViewContent.style.transform = 'scale(1)';
    }, 100);
    
    // Close functionality
    const closeBtn = quickViewModal.querySelector('.close-quick-view');
    closeBtn.addEventListener('click', closeQuickView);
    
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            closeQuickView();
        }
    });
    
    // Add to cart in quick view
    const addToCartBtn = quickViewModal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const productData = JSON.parse(this.getAttribute('data-product').replace(/&#39;/g, "'"));
        addToCart(productData);
        closeQuickView();
    });
    
    function closeQuickView() {
        quickViewModal.style.opacity = '0';
        quickViewContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (quickViewModal.parentNode) {
                quickViewModal.remove();
            }
        }, 300);
    }
}

// ===== URL Parameter Handling =====
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Check the corresponding checkbox
        const checkbox = document.querySelector(`.category-filter[value="${category}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
        
        // Apply filters immediately
        filterProducts();
    }
}

// ===== Initialize Products Page =====
function initializeProductsPage() {
    // Set up event listeners for filters
    const filterInputs = document.querySelectorAll('.category-filter, .brand-filter, #price-slider');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });
    
    // Price slider update
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            document.getElementById('max-price').textContent = formatPrice(parseInt(this.value));
        });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    // Reset filters
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Pagination buttons
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    }
    
    // Handle URL parameters
    handleURLParameters();
    
    // Initial display
    filterProducts();
}

function resetFilters() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        priceSlider.value = 2000;
        document.getElementById('max-price').textContent = formatPrice(2000);
    }
    
    // Reset sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'default';
    }
    
    // Reapply filters
    filterProducts();
}

// ===== Initialize Based on Page =====
document.addEventListener('DOMContentLoaded', function() {
    // Display featured products on homepage
    if (document.getElementById('featured-products')) {
        displayFeaturedProducts();
    }
    
    // Initialize products page
    if (document.getElementById('products-grid')) {
        initializeProductsPage();
    }
    
    // Display recommended products in cart
    if (document.getElementById('recommended-products')) {
        displayRecommendedProducts();
    }
});