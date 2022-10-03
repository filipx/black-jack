const express = require('express');
const authController = require('./controllers/authController');
const gameController = require('./controllers/gameController');

const app = express();
const router = express.Router();
const port = process.env.PORT || 6869;

// // create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

authController.init(router);
gameController.init(router);

app.use('', router);

app.get('/', (req, res) =>
{
	res.send('<h1>Welcome to API test</h1>');
});

app.listen(port, () =>
{
	console.log(`Running on port ${port}`);
});
