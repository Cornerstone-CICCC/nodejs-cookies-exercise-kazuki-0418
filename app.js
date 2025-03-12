const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const users = [
  {
    username: "admin",
    password: "admin12345",
  },
];

const isAuthenticated = (req, res, next) => {
  const { username } = req.cookies;
  if (username) {
    return next();
  }
  res.redirect("/login");
};

app.get("/", (req, res) => {
  res.render("home", {
    username: req.cookies.username,
  });
});

app.get("/login", (req, res) => {
  if (req.cookies.username) {
    return res.redirect("/profile");
  }
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    res.cookie("username", username);
    res.redirect("/profile");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", {
    username: req.cookies.username,
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
