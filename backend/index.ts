import express from "express";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello from backendd");
});

app.listen(port, () => {
  console.log(`backendd listening at http://localhost:${port}`);
});
