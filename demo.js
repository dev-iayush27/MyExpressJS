const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("Hello from Home page");
});

app.get("/about", (req, res) => {
  return res.send("Hello from About page" + " Hey " + req.query.name + ".");
});

app.listen(8000, () => console.log("Server Started!"));
