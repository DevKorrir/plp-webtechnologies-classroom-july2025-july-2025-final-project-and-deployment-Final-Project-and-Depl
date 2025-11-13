// ===== Cart JavaScript =====

// ===== Cart Display Functions =====
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cart = JSON.parse(localStorage.getItem('aldobiz-cart')) || [];
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        updateCheckoutButton(false);
        return;
    }
    
    cartEmpty.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" data-product-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-product-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `).join('');
    
    initializeCartInteractions();
    updateCartSummary();
    updateCheckoutButton(true);
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('aldobiz-cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get selected shipping method
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    const shippingCost = selectedShipping ? parseFloat(selectedShipping.value === 'express' ? 12.99 : 5.99) : 5.99;
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    
    // Update summary elements
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shippingCost);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
}

function updateCheckoutButton(enabled) {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = !enabled;
        checkoutBtn.textContent = enabled ? 'Proceed to Checkout' : 'Cart is Empty';
    }
}

// ===== Cart Interactions =====
function initializeCartInteractions() {
    // Quantity decrease buttons
    const decreaseButtons = document.querySelectorAll('.decrease-btn');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    // Quantity increase buttons
    const increaseButtons = document.querySelectorAll('.increase-btn');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            removeFromCart(productId);
            displayCartItems();
        });
    });
    
    // Shipping method changes
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', updateCartSummary);
    });
}

function updateCartItemQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('aldobiz-cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
            showNotification('Item removed from cart', 'info');
        } else {
            showNotification(`Quantity updated to ${item.quantity}`, 'success');
        }
        
        localStorage.setItem('aldobiz-cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

// ===== Checkout Process =====
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Simulate checkout process
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            setTimeout(() => {
                showNotification('Order placed successfully!', 'success');
                
                // Clear cart
                localStorage.removeItem('aldobiz-cart');
                updateCartCount();
                displayCartItems();
                
                // Reset button
                this.disabled = false;
                this.innerHTML = 'Proceed to Checkout';
            }, 2000);
        });
    }
}

// ===== Initialize Cart Page =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-items')) {
        displayCartItems();
        initializeCheckout();
    }
});