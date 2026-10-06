let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let allProducts = [];


const productContainer =
    document.getElementById("product-container");

const searchInput =
    document.getElementById("product-search");


/* =========================
   CART COUNT
========================= */

updateCartCount();


/* =========================
   LOAD PRODUCTS
========================= */

loadProducts();


function loadProducts() {

    productContainer.innerHTML = `

        <div class="store-loading">

            <div class="store-spinner"></div>

            <p>
                Loading products...
            </p>

        </div>
    `;


    fetch("/products")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load products"
                );

            }

            return response.json();

        })

        .then(products => {

            allProducts = products;

            renderProducts(products);

        })

        .catch(error => {

            console.error(error);

            productContainer.innerHTML = `

                <div class="store-error">

                    <div>
                        ⚠️
                    </div>

                    <h3>
                        Unable to load products
                    </h3>

                    <p>
                        Please make sure the server
                        is running.
                    </p>

                    <button
                        onclick="loadProducts()"
                    >
                        Try Again
                    </button>

                </div>

            `;

        });
}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(products) {

    productContainer.innerHTML = "";


    if (products.length === 0) {

        productContainer.innerHTML = `

            <div class="store-empty">

                <div>
                    📦
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "store-product-card";


        const outOfStock =
            product.quantity === 0;


        const status =
            getStockStatus(
                product.quantity
            );


        card.innerHTML = `

            <div class="product-image-area">

                <div class="customer-product-icon">

                    ${getProductIcon(product.name)}

                </div>


                <span
                    class="
                        customer-stock-badge
                        ${status.className}
                    "
                >

                    ${status.text}

                </span>

            </div>


            <div class="customer-product-content">

                <span class="customer-product-category">
                    MINI SHOP
                </span>


                <h3>
                    ${escapeHtml(product.name)}
                </h3>


                <p class="customer-product-description">

                    ${escapeHtml(
                        product.description
                    )}

                </p>


                <div class="customer-product-bottom">

                    <div>

                        <span>
                            Price
                        </span>

                        <strong>
                            ₹${Number(
                                product.price
                            ).toFixed(2)}
                        </strong>

                    </div>


                    <button
                        class="customer-add-btn"
                        data-id="${product.id}"
                        ${outOfStock ? "disabled" : ""}
                    >

                        ${
                            outOfStock
                                ? "Out of Stock"
                                : "+ Add to Cart"
                        }

                    </button>

                </div>

            </div>

        `;


        productContainer.appendChild(card);

    });


    attachCartButtons();
}


/* =========================
   STOCK STATUS
========================= */

function getStockStatus(quantity) {

    if (quantity === 0) {

        return {
            text: "Out of Stock",
            className:
                "customer-status-out"
        };

    }


    if (quantity <= 5) {

        return {
            text: "Low Stock",
            className:
                "customer-status-low"
        };

    }


    return {
        text: "In Stock",
        className:
            "customer-status-good"
    };
}


/* =========================
   PRODUCT ICON
========================= */

function getProductIcon(name) {

    const lower =
        name.toLowerCase();


    if (
        lower.includes("shoe") ||
        lower.includes("sport")
    ) {
        return "👟";
    }


    if (
        lower.includes("hoodie") ||
        lower.includes("shirt") ||
        lower.includes("cloth")
    ) {
        return "👕";
    }


    if (
        lower.includes("mouse") ||
        lower.includes("keyboard") ||
        lower.includes("laptop")
    ) {
        return "🖥️";
    }


    if (
        lower.includes("phone") ||
        lower.includes("mobile")
    ) {
        return "📱";
    }


    if (
        lower.includes("watch")
    ) {
        return "⌚";
    }


    if (
        lower.includes("book")
    ) {
        return "📚";
    }


    return "📦";
}


/* =========================
   ADD TO CART
========================= */

function attachCartButtons() {

    document
        .querySelectorAll(".customer-add-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    addToCart(
                        Number(this.dataset.id)
                    );

                }
            );

        });
}


function addToCart(productId) {

    const existingProduct =
        cart.find(
            item =>
                item.productId === productId
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            productId: productId,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showCartMessage();

}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {
        return;
    }


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;


    cartCount.classList.add(
        "cart-count-pop"
    );


    setTimeout(() => {

        cartCount.classList.remove(
            "cart-count-pop"
        );

    }, 250);
}


/* =========================
   CART MESSAGE
========================= */

function showCartMessage() {

    let message =
        document.getElementById(
            "cart-message"
        );


    if (!message) {

        message =
            document.createElement(
                "div"
            );

        message.id =
            "cart-message";

        message.className =
            "customer-cart-message";

        document.body.appendChild(
            message
        );

    }


    message.textContent =
        "✓ Product added to cart";

    message.classList.add(
        "show"
    );


    setTimeout(() => {

        message.classList.remove(
            "show"
        );

    }, 1800);
}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    function() {

        const search =
            this.value
                .trim()
                .toLowerCase();


        const filtered =
            allProducts.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.description
                    .toLowerCase()
                    .includes(search)

            );


        renderProducts(filtered);

    }
);


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}