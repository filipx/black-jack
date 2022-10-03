const { PACK } = require('../constants/pack');

const _pack = PACK;

function placeBet(bet)
{
	// TODO: finish place bet 
	if (bet)
	{
		return Promise.resolve(bet);
	} else
	{
		return Promise.reject();
	}
}

function gameDraw()
{
	console.log(`Game Draw, initial ${_pack.length} cards left.`);

	const playerCards = {
		dealer: {
			firstCard: '',
			secondCard: ''
		},
		player: {
			firstCard: '',
			secondCard: ''
		}
	};

	for (let i = 0; i < 4; i++)
	{
		const index = Math.floor(Math.random() * _pack.length);
		if (i === 0)
		{
			console.log(`Draw first card - ${_pack[index]} dealer`);
			playerCards.dealer.firstCard = _pack.splice(index, 1);
			console.log(`${_pack.length} cards left.`);
		}
		else if (i === 1)
		{
			console.log(`Draw first card - ${_pack[index]} player`);
			playerCards.player.firstCard = _pack.splice(index, 1);
			console.log(`${_pack.length} cards left.`);
		}
		else if (i === 2)
		{
			console.log(`Draw second card - ${_pack[index]} player`);
			playerCards.player.secondCard = _pack.splice(index, 1);
			console.log(`${_pack.length} cards left.`);
		}
		else if (i === 3)
		{
			console.log(`Draw first card - ${_pack[index]} dealer`);
			playerCards.dealer.secondCard = _pack.splice(index, 1);
			console.log(`${_pack.length} cards left.`);
		}
	}

	return playerCards;
}

function gameHit()
{
	console.log(`${_pack.length} cards left.`);
	if (_pack.length)
	{
		const index = Math.floor(Math.random() * _pack.length);
		console.log(`Hit card - ${_pack[index]} player`);
		const card = _pack.splice(index, 1);
		console.log(`${_pack.length} cards left.`);

		return card;
	}

	return {
		succeeded: false,
		error: 'No cards left. End of the game.'
	};
}

exports.placeBet = placeBet;
exports.gameDraw = gameDraw;
exports.gameHit = gameHit;
