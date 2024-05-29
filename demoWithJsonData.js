const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();

// *** Middleware - For request (kind of plugin) ***

// encode/decode request body
app.use(express.urlencoded({ extended: false }));

// Create log
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

// *** Return HTML response ***

app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  return res.send(html);
});

// *** Return JSON response ***

app.post("/api/user", (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.designation
  ) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  const id = users.length + 1;
  users.push({ ...body, id: id });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "Success", id: id });
  });
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

// app.get("/api/user/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
// if (!user) {
//   return res.status(404).json({ error: "User not found" });
// }
//   return res.json(user);
// });

// app.patch("/api/user/:id", (req, res) => {
//   return res.json({ status: "Pending" });
// });

// app.delete("/api/user/:id", (req, res) => {
//   return res.json({ status: "Pending" });
// });

// *** Grouping of same route with multiple HTTP methods ***

app
  .route("/api/user/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  })
  .patch((req, res) => {
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    users.splice({ user });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", id: id });
    });
  });

app.listen(8000, () => console.log("Server Started!"));
