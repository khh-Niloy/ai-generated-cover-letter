import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("all okay");
});

app.listen(8000, () => {
  console.log("Server is running at 8000");
});
