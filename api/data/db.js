const mongoDb = require('mongodb').MongoClient;
const { DEV_URL } = require('../constants/mongoDbUrls');

let dbClient = null;

const connectOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

mongoDb.connect(DEV_URL, connectOptions, (error, client) =>
{
	if (error)
	{
		console.error(`Error when trying to connect to the server: ${error}`);
		throw new Error(error);
	}

	dbClient = client.db('blackjack');
});

async function registerNewUser(user)
{
	const users = dbClient.collection('users');

	try
	{
		const result = await users.insertOne(user);
		if (result.ops.length)
		{
			const newUser = result.ops[0];
			console.log('registerNewUser function result: ', newUser);

			return {
				succeeded: true,
				user: {
					email: newUser.email,
					role: newUser.role
				}
			};
		}

		return {
			succeeded: false,
			user: null
		};
	} 
	catch (error)
	{
		console.log(error);
		throw new Error(error);
	}
}

async function getUserByEmail(email)
{
	const user = await dbClient.collection('users').findOne({ email });
	console.log(`One user found: ${user.email}`);

	return user;

	// return users.find((user) => user.email === email);
}

// TODO: this is just for testing!!
async function getUsers()
{
	try
	{
		const users = [];
		const userData = await dbClient.collection('users').find({}, { projection: { email: 1, _id: 0 } });
		if (userData)
		{
			await userData.toArray((error, result) =>
			{
				if (error)
				{
					console.error(error);
					throw new Error(error);
				}
				result.forEach(item =>
				{
					console.log(`User found: ${item.email}`);
					users.push(item.email);
				});
			});
			console.log(`Array of users: ${users}`);

			return users;
		}

	}
	catch (error)
	{
		console.log(`Error finding the users: ${error}`);

		return null;
	}
}

module.exports = {
	getUserByEmail,
	registerNewUser,
	getUsers
};
