const API = "http://localhost:3000/api/products";

let editId = null;


const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("qty");


if (window.location.pathname.includes("dashboard.html")) {

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    window.location.href = "/";
  }
}

// login
function login() {

  const user = document.getElementById("username");
  const pass = document.getElementById("password");
  const error = document.getElementById("error");

  if (
    user.value === "admin" &&
    pass.value === "1234"
  ) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    error.innerText = "Invalid Username or Password";
  }
}

// load products
async function loadProducts() {

  const res = await fetch(API);
  const data = await res.json();

  let html = "";

  data.forEach(p => {

    const safeName = encodeURIComponent(p.name);

  
html += `
  <tr>
    <td>${p.name}</td>
    <td>${p.price}</td>
    <td>${p.quantity}</td>
    <td>
      <div class="action-buttons">
        <button class="edit-btn" onclick="editProduct(${p.id}, '${safeName}', ${p.price}, ${p.quantity})">
          Edit
        </button>
        <button class="delete-btn" onclick="deleteProduct(${p.id})">
          Delete
        </button>
      </div>
    </td>
  </tr>
`;
  });

  document.getElementById("list").innerHTML = html;

  loadReport();
}

// add or update
async function saveProduct() {

  const name = nameInput.value.trim();
  const price = priceInput.value;
  const qty = qtyInput.value;

  if (!name || !price || !qty) {
    alert("All fields are required");
    return;
  }

  const product = {
    name,
    price: Number(price),
    quantity: Number(qty)
  };

  if (editId) {

    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    editId = null;

  } else {

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

  }

  clearForm();
  loadProducts();
}

// edit
function editProduct(id, encodedName, price, qty) {

  editId = id;

  nameInput.value = decodeURIComponent(encodedName);
  priceInput.value = price;
  qtyInput.value = qty;

  document.getElementById("saveBtn").innerText = "Update";
}

// delete
async function deleteProduct(id) {

  if (!confirm("Delete this product?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadProducts();
}

// report
async function loadReport() {

  const res = await fetch(`${API}/report`);
  const data = await res.json();

  document.getElementById("report").innerText =
    `Total Products: ${data.total}, Total Qty: ${data.qty}`;
}

// clear
function clearForm() {

  nameInput.value = "";
  priceInput.value = "";
  qtyInput.value = "";

  editId = null;

  document.getElementById("saveBtn").innerText = "Save";
}


if (document.getElementById("list")) {
  loadProducts();
}

// Logout function
function logout() {
  
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/";
}