require("dotenv").config();

const port = 4000,
  express = require("express"),
  app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

//tokens to store in DB
let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401); //checek token
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // is token valid?
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accesToken = generateAccessToken({ name: user.name });
    res.json({ accesToken });
  });
});

app.delete("/logout", (req, res) => {
  //del refreshs tokens
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  //authenticate user - do first,  skipped for now

  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "45s" });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
