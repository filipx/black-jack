const db = require('../data/db');

async function authenticate(email, password)
{
	const user = await db.getUserByEmail(email);

	if (user)
	{
		console.log('user returned in authService: ', user);

		// Logic will actually be more complex
		const credentialsValid = (user.email === email && user.password === password);
		if (credentialsValid)
		{
			return {
				succeeded: true,
				user: {
					email: user.email,
					role: user.role
				}
			};
		}
	}

	return {
		succeeded: false,
		error: 'Wrong email or password!'
	};
}

function _validateEmail(email)
{
	// Logic will actually be more complex

	// Simple email validation with regular expression
	const emailRgx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/u;
	const emailValid = emailRgx.test(email);

	return emailValid;
}

function _validatePassword(password)
{
	// Logic will actually be more complex

	// at least one number, one lowercase and one uppercase letter, at least 8 characters
	const passwordRgx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/u;
	const passwordValid = passwordRgx.test(password);

	console.log(`Is pass valid: ${passwordValid}`);

	return passwordValid;
}

async function _checkEmail(email)
{
	const user = await db.getUserByEmail(email);
	if (user) return true;

	return false;
}

async function createUser(userData)
{
	const existingEmail = await _checkEmail(userData.email);
	if (existingEmail)
	{
		return {
			succeeded: false,
			error: 'This email address is already in use!'
		};
	}

	console.info('Email not existing in the database, proceed to registration.');

	const emailValidated = _validateEmail(userData.email);
	const passwordValidated = _validatePassword(userData.password);

	if (emailValidated && passwordValidated)
	{
		// TODO: hash the password (md5)
		const newUser = {
			email: userData.email,
			password: userData.password,
			role: 'player'
		};

		const result = await db.registerNewUser(newUser);
		if (result.succeeded)
		{
			console.log('Inserted new user: ', result);

			return result;
		}

		throw new Error('Error on the server!');
	}

	let errorMessage = '';
	if (emailValidated) errorMessage = 'Password must be at least 8 characters long, include one number, one uppercase and one lowercase letter!';
	else errorMessage = 'Email or password is not valid!';

	return {
		succeeded: false,
		error: errorMessage
	};
}

// TODO: this is just for testing!!
async function getAllUsers()
{
	const users = await db.getUsers();

	if (users)
	{
		console.log('user returned in authService: ', users);

		return {
			succeded: true,
			users
		};
	}

	return {
		succeeded: false,
		error: 'No users found!'
	};
}

exports.authenticate = authenticate;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
