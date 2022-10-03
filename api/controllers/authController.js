const bodyParser = require('body-parser');
const authService = require('../services/authService');
const mongoDb = require('mongodb').MongoClient;
const { DEV_URL } = require('../constants/mongoDbUrls');

const controllerRoute = '/auth';

// create application/json parser
const jsonParser = bodyParser.json();

function init(router)
{
	// registration
	router.post(`${controllerRoute}/register`, jsonParser, async (req, res) =>
	{
		const userData = {
			email: req.body.email,
			password: req.body.password
		};
		const createdUser = await authService.createUser(userData);
		if (createdUser.succeeded)
		{
			res.json(createdUser);
		}
		else
		{
			res.status(401).json(createdUser);
		}
	});

	// login
	router.post(`${controllerRoute}/login`, jsonParser, async (req, res) =>
	{
		const login = await authService.authenticate(req.body.email, req.body.password);
		if (login.succeeded)
		{
			console.log('login user: ', login.user);
			res.send(login);
		} else
		{
			res.status(401).json(login);
		}
	});

	// get users
	router.get(`${controllerRoute}/users`, jsonParser, (req, res) =>
	{
		try {
			mongoDb.connect(DEV_URL, (error, client) =>
			{
				if (error)
				{
					console.error(`Error when trying to connect to the server: ${error}`);
					throw new Error(error);
				}
				
				const dbClient = client.db('blackjack');
				dbClient.collection('users').find({}, { projection: { _id: 0, email: 1, role: 1 } }).toArray((err, result) =>
				{
					if (err)
					{
						res.status(401).json({
							succeeded: false,
							error: err
						});
					}
					else
					{
						res.json({
							succeeded: true,
							users: result
						});
					}
				});
			});
		}
		catch (error) {
			console.error(error);
		}

		// const users = await authService.getAllUsers();
		// if (users && users.succeeded) {
		// 	res.json(users);
		// } else {
		// 	res.status(401).json(users);
		// }
	});
}

exports.init = init;
