require("dotenv").config();

const port = 3000,
  express = require("express"),
  app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "qwe",
    title: "Post 1"
  },
  {
    username: "asd",
    title: "Post 2"
  }
];

app.get("/posts", authenticateToken, (req, res) => {
  //req.user we know from middleware
  res.json(posts.filter(post => post.username == req.user.name));
  //returns only availeble posts
});

function authenticateToken(req, res, next) {
  //Bearer TOKEN
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
