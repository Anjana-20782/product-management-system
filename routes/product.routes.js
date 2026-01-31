import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* GET ALL */
router.get("/", (req, res) => {

  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });

});

/* ADD */
router.post("/", (req, res) => {

  const { name, price, quantity } = req.body;

  const sql =
    "INSERT INTO products (name, price, quantity) VALUES (?,?,?)";

  db.query(sql, [name, price, quantity], (err) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "Product Added" });
  });

});

/* UPDATE */
router.put("/:id", (req, res) => {

  const { name, price, quantity } = req.body;
  const id = req.params.id;

  const sql =
    "UPDATE products SET name=?, price=?, quantity=? WHERE id=?";

  db.query(sql, [name, price, quantity, id], (err) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "Updated" });
  });

});

/* DELETE */
router.delete("/:id", (req, res) => {

  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Deleted" });
    }
  );

});

/* REPORT */
router.get("/report", (req, res) => {

  const sql =
    "SELECT COUNT(*) AS total, SUM(quantity) AS qty FROM products";

  db.query(sql, (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });

});

export default router;
