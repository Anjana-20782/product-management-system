import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.sendFile("login.html", { root: "public" });
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
