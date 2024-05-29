const express = require("express");
const { mongoose } = require("mongoose");

const app = express();

// DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/my-app")
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log("Error: ", err));

// Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    designation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const User = mongoose.model("user", userSchema);

// Middleware
app.use(express.urlencoded({ extended: false }));

// *** Return HTML response ***

app.get("/users", async (req, res) => {
  const users = await User.find({});
  const html = `
    <ul>
      ${users
        .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
        .join("")}
    </ul>
  `;
  return res.send(html);
});

// *** Return JSON response ***

app.post("/api/user", async (req, res) => {
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

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    designation: body.designation,
  });

  return res.status(201).json({ status: "Success" });
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

app
  .route("/api/user/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
      lastName: req.body.last_name,
    });
    const user = await User.findById(req.params.id);
    return res.status(201).json({ status: "Success", user: user });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ status: "Success", msg: "User has been deleted." });
  });

app.listen(8000, () => console.log("Server Started!"));
