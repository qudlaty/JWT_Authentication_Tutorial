require('dotenv').config();

const port = 3000,
			express = require('express'),
			app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
	{
		username: 'qwe',
		title: 'Post 1'
	},
		{
		username: 'asd',
		title: 'Post 2'
	}
];


app.get('/posts', authenticateToken, (req, res)=>{

	//req.user we know from middleware
	res.json(posts.filter(post => post.username == req.user.name));//returns only availeble posts
});

app.post('/login', (req, res)=>{
	//authenticate user - do first,  skipped for now
	
	const username = req.body.username;
	const	user = { name: username }
	
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
	res.json({ accessToken: accessToken });
});


function authenticateToken(req, res, next){
	//Bearer TOKEN
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if(token === null) return res.sendStatus(401); 
	
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if(err){
			res.send("wrong token!")
			return res.sendStatus(403);
		}
		req.user = user;
		next();
	});
}


app.listen(port, ()=>{
	console.log(`Server working on port ${port}`);	
});
