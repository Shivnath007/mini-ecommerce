let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart-container");
const totalContainer = document.getElementById("cart-total");


loadCart();


function loadCart() {

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <a href="index.html">Start Shopping</a>
            </div>
        `;

        totalContainer.innerHTML = "";

        return;
    }


    let total = 0;


    cart.forEach(item => {

        fetch(`/products/${item.productId}`)
            .then(response => response.json())
            .then(product => {

                const itemTotal = product.price * item.quantity;

                total += itemTotal;


                const cartItem = document.createElement("div");

                cartItem.className = "cart-item";

                cartItem.innerHTML = `
                    <div>
                        <h3>${product.name}</h3>

                        <p>₹${product.price}</p>
                    </div>

                    <div class="quantity-controls">

                        <button onclick="decreaseQuantity(${product.id})">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="increaseQuantity(${product.id})">
                            +
                        </button>

                    </div>

                    <div>
                        <p>₹${itemTotal}</p>

                        <button
                            class="remove-btn"
                            onclick="removeFromCart(${product.id})">
                            Remove
                        </button>
                    </div>
                `;

                container.appendChild(cartItem);

                totalContainer.innerHTML = `
    <h2>Total: ₹${total}</h2>

    <a href="checkout.html" class="checkout-btn">
        Proceed to Checkout
    </a>
`;
            });
    });
}


function increaseQuantity(productId) {

    const item = cart.find(
        item => item.productId === productId
    );

    if (item) {
        item.quantity++;
    }

    saveCart();

    loadCart();
}


function decreaseQuantity(productId) {

    const item = cart.find(
        item => item.productId === productId
    );

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart = cart.filter(
            item => item.productId !== productId
        );
    }

    saveCart();

    loadCart();
}


function removeFromCart(productId) {

    cart = cart.filter(
        item => item.productId !== productId
    );

    saveCart();

    loadCart();
}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}