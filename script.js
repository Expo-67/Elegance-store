// Fetch and render products
fetch("http://localhost:3000/products")
  .then((res) => res.json())
  .then((products) => {
    const productContainer = document.querySelector(".product-list");
    productContainer.innerHTML = products
      .map(
        (product) => `
      <div class="product-card">
        <img src="${product.image}" style="width:100%; border-radius:8px;">
        <h3>${product.name}</h3>
        <p><strong>Size:</strong> ${product.size}</p>
        <p><strong>Gender:</strong> ${product.gender || "NA"}</p>
        <p>${product.description}</p>
        <p><strong>Price:</strong> Ksh ${product.price}</p>
        <button class="add-to-cart" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}">
          🛒 Add to Cart
        </button>
      </div>
    `
      )
      .join("");
  })
  .catch((err) => console.error("Error loading products:", err));

// Fetch and render reviews
fetch("http://localhost:3000/reviews")
  .then((res) => res.json())
  .then((reviews) => {
    const reviewContainer = document.querySelector(".customer-review");
    reviewContainer.innerHTML = reviews
      .map(
        (review) => `
      <div class="review-card">
        <p>“${review.content}”</p>
        <span>- ${review.author}</span><br>
        <span>${"⭐".repeat(review.rating)}</span>
      </div>
    `
      )
      .join("");
  })
  .catch((err) => console.error("Error loading reviews:", err));

// Cart management
let cart = [];

// Update cart count on cart icon
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Add to cart
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    updateCartCount();
    renderCartModal();
  }
});

// Render cart modal
function renderCartModal() {
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalSpan = document.getElementById("cart-total");

  cartItemsList.innerHTML = cart
    .map(
      (item) => `
    <li>${item.name} x${item.quantity} — Ksh ${(
        item.price * item.quantity
      ).toFixed(2)}</li>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalSpan.textContent = total.toFixed(2);
}

// Toggle cart modal visibility
document.getElementById("cart-icon").addEventListener("click", () => {
  document.getElementById("cart-modal").classList.toggle("hidden");
});

// Handle checkout
document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let summary = cart
    .map(
      (item) =>
        `${item.name} x${item.quantity} - Ksh ${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

  let total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (
    confirm(
      `Your order:\n\n${summary}\n\nTotal: Ksh ${total}\n\nClick OK to clear cart.`
    )
  ) {
    cart = [];
    updateCartCount();
    renderCartModal();
  }
});

// Handle contact form submissions
document
  .querySelector("#contact form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && email && message) {
      const tableBody = document.querySelector("#submission-table tbody");
      const newRow = document.createElement("tr");

      newRow.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${message}</td>
    `;

      tableBody.appendChild(newRow);
      e.target.reset();
    }
  });
