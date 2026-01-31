import db from "../config/db.js";

// Get all products
export const getAllProducts = (req, res) => {

  db.query("SELECT * FROM products", (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });

};

//Add products
export const addProduct = (req, res) => {

  const { name, price, quantity } = req.body;

  const sql =
    "INSERT INTO products (name, price, quantity) VALUES (?,?,?)";

  db.query(sql, [name, price, quantity], (err) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Product Added" });
  });

};

// Update products
export const updateProduct = (req, res) => {

  const { name, price, quantity } = req.body;
  const id = req.params.id;

  const sql =
    "UPDATE products SET name=?, price=?, quantity=? WHERE id=?";

  db.query(sql, [name, price, quantity, id], (err) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Updated" });
  });

};

// delete products
export const deleteProduct = (req, res) => {

  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({ message: "Deleted" });
    }
  );

};

// report
export const getReport = (req, res) => {

  const sql =
    "SELECT COUNT(*) AS total, SUM(quantity) AS qty FROM products";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result[0]);
  });

};
