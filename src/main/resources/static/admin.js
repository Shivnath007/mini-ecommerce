/* =========================
   ELEMENTS
========================= */

const productContainer =
    document.getElementById("admin-product-container");

const productModal =
    document.getElementById("product-modal");

const productForm =
    document.getElementById("product-form");

const formTitle =
    document.getElementById("form-title");

const productId =
    document.getElementById("product-id");

const productName =
    document.getElementById("product-name");

const productDescription =
    document.getElementById("product-description");

const productPrice =
    document.getElementById("product-price");

const productQuantity =
    document.getElementById("product-quantity");

const addProductBtn =
    document.getElementById("add-product-btn");

const closeModalBtn =
    document.getElementById("close-modal-btn");

const cancelFormBtn =
    document.getElementById("cancel-form-btn");

const searchInput =
    document.getElementById("search-product");

const stockFilter =
    document.getElementById("stock-filter");

const totalProducts =
    document.getElementById("total-products");

const inStock =
    document.getElementById("in-stock");

const lowStock =
    document.getElementById("low-stock");

const outOfStock =
    document.getElementById("out-of-stock");

const resultText =
    document.getElementById("product-result-text");

const visibleCount =
    document.getElementById("visible-count");

const toast =
    document.getElementById("admin-toast");

const toastIcon =
    document.getElementById("toast-icon");

const toastMessage =
    document.getElementById("toast-message");


let products = [];

let toastTimer;


/* =========================
   LOAD PRODUCTS
========================= */

function loadProducts() {

    productContainer.innerHTML = `
        <div class="admin-loading-v3">

            <div class="loading-spinner"></div>

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

        .then(data => {

            products = data;

            updateStatistics();

            applyFilters();

        })

        .catch(error => {

            console.error(error);

            productContainer.innerHTML = `

                <div class="admin-error-v3">

                    <div>
                        ⚠️
                    </div>

                    <h3>
                        Unable to load products
                    </h3>

                    <p>
                        Make sure the Spring Boot server
                        is running.
                    </p>

                    <button
                        onclick="loadProducts()"
                        class="retry-btn"
                    >
                        Try Again
                    </button>

                </div>
            `;

        });
}


/* =========================
   STATISTICS
========================= */

function updateStatistics() {

    const total =
        products.length;


    const stock =
        products.filter(
            product => product.quantity > 0
        ).length;


    const low =
        products.filter(
            product =>
                product.quantity > 0 &&
                product.quantity <= 5
        ).length;


    const out =
        products.filter(
            product =>
                product.quantity === 0
        ).length;


    totalProducts.textContent =
        total;

    inStock.textContent =
        stock;

    lowStock.textContent =
        low;

    outOfStock.textContent =
        out;
}


/* =========================
   FILTER PRODUCTS
========================= */

function applyFilters() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filter =
        stockFilter.value;


    let filteredProducts =
        products.filter(product => {

            const matchesSearch =

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.description
                    .toLowerCase()
                    .includes(search);


            let matchesFilter = true;


            if (filter === "in-stock") {

                matchesFilter =
                    product.quantity > 0;

            }


            if (filter === "low-stock") {

                matchesFilter =
                    product.quantity > 0 &&
                    product.quantity <= 5;

            }


            if (filter === "out-stock") {

                matchesFilter =
                    product.quantity === 0;

            }


            return matchesSearch &&
                   matchesFilter;

        });


    renderProducts(filteredProducts);
}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(productList) {

    productContainer.innerHTML = "";


    visibleCount.textContent =
        productList.length;


    resultText.textContent =
        `${productList.length} product${
            productList.length === 1
                ? ""
                : "s"
        }`;


    if (productList.length === 0) {

        productContainer.innerHTML = `

            <div class="admin-empty-v3">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try changing your search
                    or filter.
                </p>

            </div>
        `;

        return;
    }


    productList.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "admin-product-row";


        const status =
            getProductStatus(product.quantity);


        card.innerHTML = `

            <div class="product-main-info">

                <div class="product-icon-box">
                    ${getProductIcon(product.name)}
                </div>

                <div class="product-info">

                    <strong>
                        ${escapeHtml(product.name)}
                    </strong>

                    <span>
                        ID #${product.id}
                    </span>

                    <p>
                        ${escapeHtml(product.description)}
                    </p>

                </div>

            </div>


            <div class="product-price">

                <span>
                    Price
                </span>

                <strong>
                    ₹${Number(product.price).toFixed(2)}
                </strong>

            </div>


            <div class="product-stock">

                <span>
                    Stock
                </span>

                <strong>
                    ${product.quantity}
                </strong>

            </div>


            <div class="product-status">

                <span class="
                    stock-status
                    ${status.className}
                ">

                    <span class="status-dot"></span>

                    ${status.text}

                </span>

            </div>


            <div class="product-actions">

                <button
                    type="button"
                    class="edit-product-btn"
                    data-id="${product.id}"
                >
                    ✏️ Edit
                </button>


                <button
                    type="button"
                    class="delete-product-btn"
                    data-id="${product.id}"
                >
                    🗑️ Delete
                </button>

            </div>
        `;


        productContainer.appendChild(card);

    });


    attachProductActions();
}


/* =========================
   PRODUCT STATUS
========================= */

function getProductStatus(quantity) {

    if (quantity === 0) {

        return {
            text: "Out of Stock",
            className: "status-out-v3"
        };

    }


    if (quantity <= 5) {

        return {
            text: "Low Stock",
            className: "status-low-v3"
        };

    }


    return {
        text: "In Stock",
        className: "status-good-v3"
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
   ACTION BUTTONS
========================= */

function attachProductActions() {

    document
        .querySelectorAll(".edit-product-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    editProduct(
                        Number(this.dataset.id)
                    );

                }
            );

        });


    document
        .querySelectorAll(".delete-product-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    deleteProduct(
                        Number(this.dataset.id)
                    );

                }
            );

        });
}


/* =========================
   OPEN ADD MODAL
========================= */

function showAddModal() {

    productForm.reset();

    productId.value = "";

    formTitle.textContent =
        "Add Product";


    productModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        productName.focus();

    }, 100);
}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    productModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    productForm.reset();

    productId.value = "";
}


/* =========================
   EDIT PRODUCT
========================= */

function editProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );

        return;
    }


    productId.value =
        product.id;

    productName.value =
        product.name;

    productDescription.value =
        product.description;

    productPrice.value =
        product.price;

    productQuantity.value =
        product.quantity;


    formTitle.textContent =
        "Edit Product";


    productModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        productName.focus();

    }, 100);
}


/* =========================
   SAVE PRODUCT
========================= */

productForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            productId.value;


        const product = {

            name:
                productName.value.trim(),

            description:
                productDescription.value.trim(),

            price:
                Number(productPrice.value),

            quantity:
                Number(productQuantity.value)

        };


        if (!product.name) {

            showToast(
                "Product name is required.",
                "error"
            );

            return;
        }


        if (!product.description) {

            showToast(
                "Product description is required.",
                "error"
            );

            return;
        }


        if (
            !Number.isFinite(product.price) ||
            product.price <= 0
        ) {

            showToast(
                "Price must be greater than 0.",
                "error"
            );

            return;
        }


        if (
            !Number.isInteger(product.quantity) ||
            product.quantity < 0
        ) {

            showToast(
                "Quantity cannot be negative.",
                "error"
            );

            return;
        }


        const url =
            id
                ? `/products/${id}`
                : "/products";


        const method =
            id
                ? "PUT"
                : "POST";


        fetch(url, {

            method: method,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(product)

        })

        .then(response => {

            if (!response.ok) {

                return response
                    .text()
                    .then(message => {

                        throw new Error(
                            message ||
                            "Unable to save product"
                        );

                    });

            }

            return response.json();

        })

        .then(() => {

            closeModal();


            showToast(
                id
                    ? "Product updated successfully!"
                    : "Product added successfully!",
                "success"
            );


            loadProducts();

        })

        .catch(error => {

            console.error(error);

            showToast(
                error.message ||
                "Something went wrong.",
                "error"
            );

        });

    }
);


/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmed) {
        return;
    }


    fetch(`/products/${id}`, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {

            return response
                .text()
                .then(message => {

                    throw new Error(
                        message ||
                        "Unable to delete product"
                    );

                });

        }

        return response.text();

    })

    .then(() => {

        showToast(
            "Product deleted successfully!",
            "success"
        );


        loadProducts();

    })

    .catch(error => {

        console.error(error);

        showToast(
            error.message ||
            "Unable to delete product.",
            "error"
        );

    });
}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    applyFilters
);


/* =========================
   STOCK FILTER
========================= */

stockFilter.addEventListener(
    "change",
    applyFilters
);


/* =========================
   TOAST
========================= */

function showToast(message, type) {

    clearTimeout(toastTimer);


    toastMessage.textContent =
        message;


    if (type === "error") {

        toastIcon.textContent =
            "⚠";

        toast.classList.add(
            "toast-error"
        );

    } else {

        toastIcon.textContent =
            "✓";

        toast.classList.remove(
            "toast-error"
        );

    }


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3500);
}


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


/* =========================
   BUTTON EVENTS
========================= */

addProductBtn.addEventListener(
    "click",
    showAddModal
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelFormBtn.addEventListener(
    "click",
    closeModal
);


document
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        closeModal
    );


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            !productModal.hidden
        ) {

            closeModal();

        }

    }
);


/* =========================
   INITIAL LOAD
========================= */

loadProducts();