// Book Catalog Array
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

// Formatting Helper Functions
function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-IN");
}

function showMessage(message, elementId) {
  const messageElement = document.getElementById(elementId || "store-message");
  if (messageElement) {
    messageElement.textContent = message;
  }
}

// Shopping Cart Functions
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

// ==========================================
// FORM VALIDATIONS (Questions 6 & 7)
// ==========================================
function validateForm(event) {
  if (event) {
    event.preventDefault(); // Prevent default page refresh on submit
  }

  // Get field values safely
  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const name = nameInput ? nameInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";

  // Question 6.1: Name (alphabets only, minimum 6 characters)
  const nameRegex = /^[A-Za-z\s]+$/;
  if (name.length < 6 || !nameRegex.test(name)) {
    alert("Validation Failed: Name must contain alphabets only and be at least 6 characters long.");
    return false;
  }

  // Question 6.2: Password (minimum 6 characters)
  if (password.length < 6) {
    alert("Validation Failed: Password must be at least 6 characters long.");
    return false;
  }

  // Question 7.3: Email (standard pattern name@domain.com)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert("Validation Failed: E-mail ID must follow standard pattern (name@domain.com).");
    return false;
  }

  // Question 7.4: Phone Number (10 digits only)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    alert("Validation Failed: Phone number must contain exactly 10 digits.");
    return false;
  }

  alert("Registration Successful!");
  return true;
}

// Bind validation function on page load if registration form exists
document.addEventListener("DOMContentLoaded", function () {
  updateCartCounts();

  const regForm = document.getElementById("registration-form");
  if (regForm) {
    regForm.addEventListener("submit", validateForm);
  }
});
