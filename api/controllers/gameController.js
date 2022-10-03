const bodyParser = require('body-parser');
const gameService = require('../services/gameService');

const controllerRoute = '/game';

// create application/json parser
const jsonParser = bodyParser.json();

function init(router)
{
	router.post(`${controllerRoute}/start`, jsonParser, async (req, res) =>
	{
		console.log(`Player bet: ${req.body.bet}`);
		const bet = await gameService.placeBet(req.body.bet);
		if (bet)
		{
			res.json(gameService.gameDraw());
		}
		else
		{
			res.status(401);
			console.log('Invalid Bet: ', req.body.bet);
		}
	});

	router.get(`${controllerRoute}/hit`, jsonParser, (req, res) =>
	{
		const card = gameService.gameHit();
		if (card)
		{
			res.json(card);
		}
		else
		{
			res.status(401).json(card);
		}
	});
}

exports.init = init;
