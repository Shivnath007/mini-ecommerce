let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


const itemsContainer =
    document.getElementById(
        "checkout-items"
    );


const totalContainer =
    document.getElementById(
        "checkout-total"
    );


let total = 0;


/* =========================
   LOAD CHECKOUT
========================= */

loadCheckout();


function loadCheckout() {

    if (cart.length === 0) {

        itemsContainer.innerHTML = `

            <div class="checkout-empty">

                <div>
                    🛒
                </div>

                <p>
                    Your cart is empty.
                </p>

                <a href="index.html">
                    Start Shopping
                </a>

            </div>

        `;

        totalContainer.textContent =
            "Total: ₹0";

        return;
    }


    const requests =
        cart.map(item =>

            fetch(
                `/products/${item.productId}`
            )
                .then(response => {

                    if (!response.ok) {

                        throw new Error(
                            "Product not found"
                        );

                    }

                    return response.json();

                })
                .then(product => ({
                    item,
                    product
                }))

        );


    Promise.all(requests)

        .then(results => {

            total = 0;

            itemsContainer.innerHTML = "";


            results.forEach(
                ({ item, product }) => {

                    const itemTotal =
                        product.price *
                        item.quantity;


                    total += itemTotal;


                    const element =
                        document.createElement(
                            "div"
                        );


                    element.className =
                        "checkout-product-item";


                    element.innerHTML = `

                        <div class="checkout-product-icon">

                            ${getProductIcon(
                                product.name
                            )}

                        </div>


                        <div class="checkout-product-info">

                            <strong>
                                ${escapeHtml(
                                    product.name
                                )}
                            </strong>

                            <span>
                                ₹${Number(
                                    product.price
                                ).toFixed(2)}
                                ×
                                ${item.quantity}
                            </span>

                        </div>


                        <strong class="checkout-product-price">

                            ₹${Number(
                                itemTotal
                            ).toFixed(2)}

                        </strong>

                    `;


                    itemsContainer.appendChild(
                        element
                    );

                }
            );


            totalContainer.innerHTML = `

                <span>
                    Total
                </span>

                <strong>
                    ₹${total.toFixed(2)}
                </strong>

            `;

        })

        .catch(error => {

            console.error(error);

            itemsContainer.innerHTML = `

                <div class="store-error">

                    ⚠️

                    <p>
                        Unable to load order summary.
                    </p>

                </div>

            `;

        });
}


/* =========================
   SUBMIT ORDER
========================= */

document
    .getElementById("checkout-form")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const order = {

                customerName:
                    document
                        .getElementById("name")
                        .value
                        .trim(),

                email:
                    document
                        .getElementById("email")
                        .value
                        .trim(),

                address:
                    document
                        .getElementById("address")
                        .value
                        .trim(),

                city:
                    document
                        .getElementById("city")
                        .value
                        .trim(),

                pincode:
                    document
                        .getElementById("pincode")
                        .value
                        .trim(),

                totalAmount:
                    total

            };


            fetch("/orders", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(order)

            })

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Order could not be placed"
                    );

                }

                return response.json();

            })

            .then(savedOrder => {

                alert(
                    `Order placed successfully!\nOrder ID: ${savedOrder.id}`
                );


                localStorage.removeItem(
                    "cart"
                );


                window.location.href =
                    "index.html";

            })

            .catch(error => {

                console.error(
                    "Order error:",
                    error
                );


                alert(
                    "Something went wrong while placing the order."
                );

            });

        }
    );


/* =========================
   ICON
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


    return "📦";
}


/* =========================
   ESCAPE
========================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}