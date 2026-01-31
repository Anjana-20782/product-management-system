import db from "../config/db.js";

// Get all products
export const getAllProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.status(200).json({ success: true, data: result });
  });
};

// Add new product
export const addProduct = (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  db.query(
    "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)",
    [name, price, quantity],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.status(201).json({ success: true, message: "Product added successfully", data: { id: result.insertId, name, price, quantity } });
    }
  );
};

// Update product
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  db.query(
    "UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?",
    [name, price, quantity, id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.status(200).json({ success: true, message: "Product updated successfully" });
    }
  );
};

// Delete product
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  });
};

// Report (Total Products & Quantity)
export const getReport = (req, res) => {
  db.query("SELECT COUNT(*) AS total, SUM(quantity) AS qty FROM products", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.status(200).json({ success: true, total: result[0].total, qty: result[0].qty });
  });
};
