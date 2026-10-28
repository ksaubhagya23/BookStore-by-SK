const books = [
    { id: "computer-science", title: "Computer Science", author: "Robert Sedgewick", price: 4000, category: "cse", cover: "assets/computer-science.svg" },
    { id: "operating-systems", title: "Operating System Concepts", author: "Abraham Silberschatz", price: 3800, category: "cse", cover: "assets/operating-systems.svg" },
    { id: "database-systems", title: "Database System Concepts", author: "Abraham Silberschatz", price: 2500, category: "cse", cover: "assets/database-systems.svg" },
    { id: "artificial-intelligence", title: "Artificial Intelligence", author: "Charu C. Agarwal", price: 5000, category: "cse", cover: "assets/artificial-intelligence.svg" },
    { id: "digital-electronics", title: "Digital Electronics", author: "Morris Mano", price: 1800, category: "ece", cover: "assets/digital-electronics.svg" },
    { id: "signals-systems", title: "Signals and Systems", author: "Alan V. Oppenheim", price: 2200, category: "ece", cover: "assets/signals-systems.svg" },
    { id: "engineering-mechanics", title: "Engineering Mechanics", author: "R. K. Bansal", price: 1600, category: "mechanical", cover: "assets/engineering-mechanics.svg" },
    { id: "thermodynamics", title: "Engineering Thermodynamics", author: "P. K. Nag", price: 2400, category: "mechanical", cover: "assets/thermodynamics.svg" }
];

function formatPrice(amount) {
    return "Rs. " + amount.toLocaleString("en-IN");
}

function showMessage(message, elementId) {
    const messageElement = document.getElementById(elementId || "store-message");
    if (messageElement) {
        messageElement.textContent = message;
    }
}

function getQuantity(bookId) {
    try {
        const quantity = Number.parseInt(localStorage.getItem("bookstore-cart-" + bookId), 10);
        return Number.isInteger(quantity) && quantity > 0 ? quantity : 0;
    } catch (error) {
        showMessage("Cart storage is unavailable in this browser. Cart changes cannot be saved.");
        return 0;
    }
}

function saveQuantity(bookId, quantity) {
    try {
        if (quantity > 0) {
            localStorage.setItem("bookstore-cart-" + bookId, String(quantity));
        } else {
            localStorage.removeItem("bookstore-cart-" + bookId);
        }
        return true;
    } catch (error) {
        showMessage("Cart storage is unavailable in this browser. Your change could not be saved.");
        return false;
    }
}

function createBookImage(book) {
    const image = document.createElement("img");
    image.src = book.cover;
    image.alt = book.title + " book cover";
    image.className = "book-img";
    return image;
}

function updateCartCounts() {
    const count = books.reduce(function (total, book) {
        return total + getQuantity(book.id);
    }, 0);
    document.querySelectorAll(".cart-count").forEach(function (element) {
        element.textContent = String(count);
    });
}

function renderCatalogue() {
    const tableBody = document.getElementById("catalogue-books");
    if (!tableBody) {
        return;
    }

    const category = new URLSearchParams(window.location.search).get("category");
    const filteredBooks = category ? books.filter(function (book) {
        return book.category === category;
    }) : books;
    const categoryNames = { cse: "CSE", ece: "ECE", mechanical: "Mechanical" };
    const heading = document.getElementById("catalogue-heading");
    if (categoryNames[category]) {
        heading.textContent = categoryNames[category] + " Books";
    }

    filteredBooks.forEach(function (book) {
        const row = document.createElement("tr");
        const imageCell = document.createElement("td");
        imageCell.appendChild(createBookImage(book));
        row.appendChild(imageCell);

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        titleCell.className = "book-title";
        row.appendChild(titleCell);

        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        const priceCell = document.createElement("td");
        priceCell.textContent = formatPrice(book.price);
        row.appendChild(priceCell);

        const actionCell = document.createElement("td");
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "action-btn";
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", function () {
            const added = saveQuantity(book.id, getQuantity(book.id) + 1);
            if (added) {
                updateCartCounts();
                showMessage(book.title + " was added to your cart.");
            }
        });
        actionCell.appendChild(addButton);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });

    document.getElementById("empty-catalogue").hidden = filteredBooks.length > 0;
}

function renderCart() {
    const tableBody = document.getElementById("cart-books");
    if (!tableBody) {
        return;
    }

    let total = 0;
    let itemCount = 0;
    books.forEach(function (book) {
        const quantity = getQuantity(book.id);
        if (quantity === 0) {
            return;
        }

        itemCount += quantity;
        total += book.price * quantity;
        const row = document.createElement("tr");

        const imageCell = document.createElement("td");
        imageCell.appendChild(createBookImage(book));
        row.appendChild(imageCell);

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        titleCell.className = "book-title";
        row.appendChild(titleCell);

        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        const priceCell = document.createElement("td");
        priceCell.textContent = formatPrice(book.price);
        row.appendChild(priceCell);

        const quantityCell = document.createElement("td");
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.step = "1";
        quantityInput.value = String(quantity);
        quantityInput.className = "quantity-input";
        quantityInput.setAttribute("aria-label", "Quantity for " + book.title);
        quantityInput.addEventListener("change", function () {
            const newQuantity = Number.parseInt(quantityInput.value, 10);
            if (!Number.isInteger(newQuantity) || newQuantity < 1) {
                quantityInput.value = String(getQuantity(book.id));
                showMessage("Enter a quantity of 1 or more.");
                return;
            }
            if (saveQuantity(book.id, newQuantity)) {
                renderCart();
                updateCartCounts();
                showMessage("Cart quantity updated.");
            }
        });
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        const actionCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "action-btn remove";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            if (saveQuantity(book.id, 0)) {
                renderCart();
                updateCartCounts();
                showMessage(book.title + " was removed from your cart.");
            }
        });
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });

    document.getElementById("cart-total").textContent = formatPrice(total);
    document.getElementById("empty-cart").hidden = itemCount > 0;
}

function setupDemoAuthentication() {
    const registrationButton = document.getElementById("register-button");
    if (registrationButton) {
        registrationButton.addEventListener("click", function () {
            const registrationFields = document.querySelectorAll("#registration-form input[required]");
            for (const field of registrationFields) {
                if (!field.checkValidity()) {
                    field.reportValidity();
                    return;
                }
            }
            const password = document.getElementById("register-password");
            const confirmation = document.getElementById("confirm-password");
            if (password.value !== confirmation.value) {
                showMessage("The passwords do not match. No information was sent or saved.");
            } else {
                showMessage("Demo only: no account was created. Connect a secure server to enable registration.");
            }
            password.value = "";
            confirmation.value = "";
        });
    }

    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.addEventListener("click", function () {
            const loginFields = document.querySelectorAll("#login-form input[required]");
            for (const field of loginFields) {
                if (!field.checkValidity()) {
                    field.reportValidity();
                    return;
                }
            }
            document.getElementById("password").value = "";
            showMessage("Demo only: login is unavailable. No credentials were sent or saved.");
        });
    }
}

const checkoutButton = document.getElementById("checkout-button");
if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
        showMessage("Demo checkout only: no payment was collected and no order was placed.", "checkout-message");
    });
}

renderCatalogue();
renderCart();
updateCartCounts();
setupDemoAuthentication();
