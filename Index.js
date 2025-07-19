let cartCount = 0;
const cartCounter = document.getElementById("cart-count");

// Add to Cart
function addToCart(itemName) {
  cartCount++;
  cartCounter.textContent = cartCount;
  alert(`${itemName} added to cart!`);
}

// Customer Review Form
const form = document.getElementById("review-form");
const tableBody = document.querySelector("#reviews-table tbody");
const API_URL = "http://localhost:3000/reviews";

// Load reviews on page load
window.addEventListener("DOMContentLoaded", loadReviews);

// Handle form submission (POST)
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const review = Object.fromEntries(formData.entries());

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: review.name,
      phone: review.phone,
      email: review.email,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      form.reset();
      loadReviews();
    });
});

// Load and display reviews
function loadReviews() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";
      data.forEach((review) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${review.name}</td>
          <td>${review.phone}</td>
          <td>${review.email}</td>
          <td>
            <button onclick="editReview('${review.id}')">Edit</button>
            <button onclick="deleteReview('${review.id}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    });
}

// Delete review (DELETE)
function deleteReview(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => loadReviews());
}

// Edit review (PUT)
function editReview(id) {
  const name = prompt("Enter new name:");
  const phone = prompt("Enter new phone:");
  const email = prompt("Enter new email:");

  if (name && phone && email) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    }).then(() => loadReviews());
  }
}
