const API = "http://localhost:3000/api/products";

let editId = null;


const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("qty");
const saveBtn = document.getElementById("saveBtn");



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

  if (!user.value || !pass.value) {
    error.innerText = "Please enter username and password";
    return;
  }

  if (user.value === "admin" && pass.value === "1234") {

    localStorage.setItem("isLoggedIn", "true");

    showNotification("Login Successful");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);

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

      <button 
        class="edit-btn"
        onclick="editProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, ${p.quantity})">
        Edit
      </button>

      <button 
        class="delete-btn"
        onclick="deleteProduct(${p.id})">
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

// Show Notification
function showNotification(message, type = "success") {

  const box = document.getElementById("notification");

  box.innerText = message;
  box.className = type; // only success or error
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 3000); // hide after 2.5 sec
}

// add or update
async function saveProduct() {

  const nameVal = nameInput.value.trim();
  const priceVal = priceInput.value;
  const qtyVal = qtyInput.value;

  if (!nameVal || !priceVal || !qtyVal) {
    showNotification("All fields are required", "error");
    return;
  }

  const data = {
    name: nameVal,
    price: priceVal,
    quantity: qtyVal
  };

  try {

    let url = API;
    let method = "POST";

    // UPDATE MODE
    if (editId !== null) {
      url = `${API}/${editId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Save failed");
    }

    showNotification(
      editId ? "Product Updated Successfully" : "Product Added Successfully",
      "success"
    );

    clearForm();
    loadProducts();

  } catch (error) {

    console.error(error);

    showNotification("Operation Failed", "error");
  }
}



// edit
function editProduct(id, nameVal, priceVal, qtyVal) {

  nameInput.value = nameVal;
  priceInput.value = priceVal;
  qtyInput.value = qtyVal;

  editId = id;

  saveBtn.innerText = "Update Product";

  showNotification("Edit Mode Enabled");
}


// delete
async function deleteProduct(id) {

  const confirmDelete = confirm("Are you sure you want to delete this product?");

  if (!confirmDelete) return;

  try {

    const res = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    showNotification("Product deleted successfully", "success");

    loadProducts();

  } catch (error) {

    console.error(error);

    showNotification("Unable to delete product", "error");
  }
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

  saveBtn.innerText = "Add Product";
}


if (document.getElementById("list")) {
  loadProducts();
}

// Logout function
function logout() {

  showNotification("Logged out successfully");

  localStorage.removeItem("isLoggedIn");

  setTimeout(() => {
    window.location.href = "/";
  }, 800);
}