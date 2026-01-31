import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "product_db"
});

db.connect((err) => {
  if (err) {
    console.error("DB Error:", err);
    return;
  }

  console.log("MySQL Connected");
});

export default db;
