const API = "http://localhost:3000/api/products";

let editId = null;

/* INPUT ELEMENTS */
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("qty");

/* LOGIN */
function login() {

  const user = document.getElementById("username");
  const pass = document.getElementById("password");
  const error = document.getElementById("error");

  if (
    user.value === "admin" &&
    pass.value === "1234"
  ) {
    location.href = "dashboard.html";
  } else {
    error.innerText = "Invalid Login";
  }
}

/* LOAD PRODUCTS */
async function loadProducts() {

  const res = await fetch(API);
  const data = await res.json();

  let html = "";

  data.forEach(p => {

    const safeName = encodeURIComponent(p.name);

   /* Inside your loadProducts loop */
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

/* ADD / UPDATE */
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

/* EDIT */
function editProduct(id, encodedName, price, qty) {

  editId = id;

  nameInput.value = decodeURIComponent(encodedName);
  priceInput.value = price;
  qtyInput.value = qty;

  document.getElementById("saveBtn").innerText = "Update";
}

/* DELETE */
async function deleteProduct(id) {

  if (!confirm("Delete this product?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadProducts();
}

/* REPORT */
async function loadReport() {

  const res = await fetch(`${API}/report`);
  const data = await res.json();

  document.getElementById("report").innerText =
    `Total Products: ${data.total}, Total Qty: ${data.qty}`;
}

/* CLEAR */
function clearForm() {

  nameInput.value = "";
  priceInput.value = "";
  qtyInput.value = "";

  editId = null;

  document.getElementById("saveBtn").innerText = "Save";
}

/* AUTO LOAD */
if (document.getElementById("list")) {
  loadProducts();
}
