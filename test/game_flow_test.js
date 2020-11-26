var TicTacToe = artifacts.require("TicTacToe");

const GAME_CREATED_EVENT = "GameCreated";
const GAME_DONE_EVENT = "gameDone";

contract('TicTacToe', function(accounts) {

	it("should let 2 players play 4 matches in a row(Winner is player2)", () => {
        var tic_tac_toe;
        var price = 200000;
        var choice = 1;
        var game_id;
        var balance;
        var diff;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;

        	return tic_tac_toe.joinGame(game_id, choice, {from: accounts[0], value: price});
        }).then((result) => {
        	return tic_tac_toe.joinGame(game_id, choice, {from: accounts[1], value: price});
			//Match below is won by player1(with x)
			//Board status
			//x|o|o
			//x|x|_
			//x|_|o
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[0]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[0]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 1, "Match won by wrong winner");
			//Match below is ends in a draw
			//Board status
			//o|x|o
			//x|x|o
			//x|o|x
			return tic_tac_toe.makeMove(game_id, 1, 1, {from : accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[1]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 3, "Match won by wrong winner");
        	//Match below is won by player2(with o)
			//Board status
			//_|o|x
			//x|o|x
			//_|o|_
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 2, "Match won by wrong winner");
			//Match below is won by player2(with x)
			//Board status
			//o|o|x
			//_|o|x
			//x|_|x
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[0]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[0]});
		}).then(async(result) => {
			balance = await web3.eth.getBalance(accounts[1]);
			let receipt = await tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
			let gas = receipt.receipt.gasUsed;
			let tx = await web3.eth.getTransaction(receipt.tx);
			let price = tx.gasPrice;
			diff = gas*price;
        	return receipt;
		}).then(async(result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 2, "Match won by wrong winner");
			let new_balance = await web3.eth.getBalance(accounts[1]);
            let error = (balance+2*price-new_balance-diff)/(new_balance+diff);
			assert.isAbove(1e-5, error, "Prize Money not recieved.");
			// console.log(diff);
			// console.log(balance-new_balance);
			try{
        		await tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[0]});
			}
			catch(err){
				assert.include(err.message, "revert");
			}
		});
    });

	it("should let 2 players play 4 matches in a row(Ends in a draw)", () => {
        var tic_tac_toe;
        var price = 200000;
        var choice = 1;
        var game_id;
        var balance;
        var diff;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;
        	return tic_tac_toe.joinGame(game_id, choice, {from: accounts[2], value: price});
        }).then((result) => {
        	return tic_tac_toe.joinGame(game_id, choice, {from: accounts[1], value: price});
        }).then((result) => {
			//Match below is won by player1(with x)
			//Board status
			//o|o|x
			//_|x|x
			//o|_|x
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[2]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[2]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 1, "Match won by wrong winner");
			//Match below ends in a draw
			//Board status
			//o|o|x
			//x|x|o
			//o|x|x			
			return tic_tac_toe.makeMove(game_id, 1, 1, {from : accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 3, "Match won by wrong winner");
			//Match below ends in a draw
			//Board status
			//o|x|o
			//x|o|x
			//x|o|x        	
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[2]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 3, "Match won by wrong winner");
			//Match below is won by player2(with x)
			//Board status
			//x|_|o
			//x|o|x
			//x|o|_
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[2]});
		}).then(async (result) => {
			balance = await web3.eth.getBalance(accounts[1]);
			let receipt = await tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[1]});
			let gas = receipt.receipt.gasUsed;
			let tx = await web3.eth.getTransaction(receipt.tx);
			let price = tx.gasPrice;
			diff = gas*price;
        	return receipt;
		}).then(async(result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 2, "Match won by wrong winner");
			let new_balance = await web3.eth.getBalance(accounts[1]);
            let error = (balance-new_balance-diff)/(new_balance+diff);
			assert.isAbove(1e-5, error, "Wrong winner recieved money");
			// console.log(diff);
			// console.log(balance-new_balance);
			try{
        		await tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[2]});
			}
			catch(err){
				assert.include(err.message, "revert");
			}
		});
    });

	it("should let 2 players play 4 matches in a row(Winner is player1)", () => {
        var tic_tac_toe;
        var price = 200000;
        var choice = 1;
        var game_id;
        var balance;
        var diff;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;
        	return tic_tac_toe.joinGame(game_id, choice, {from: accounts[2], value: price});
        }).then((result) => {
        	return tic_tac_toe.joinGame(game_id, choice, {from: accounts[1], value: price});
        }).then((result) => {
			//Match below is won by player1(with x)
			//Board status
			//x|o|_
			//x|x|o
			//x|_|o
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[2]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[2]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 1, "Match won by wrong winner");
			//Match below ends with a draw
			//Board status
			//o|x|o
			//x|x|o
			//x|o|x
			return tic_tac_toe.makeMove(game_id, 1, 1, {from : accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[1]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 3, "Match won by wrong winner");
			//Match below is won by player1(with x)
			//Board status
			//x|o|x
			//x|o|_
			//x|_|o
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 1, 0, {from: accounts[2]});
		}).then((result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 1, "Match won by wrong winner");
			//Match below is won by player2(with x)
			//Board status
			//x|o|x
			//x|o|_
			//x|_|o
        	return tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 2, 2, {from: accounts[1]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[2]});
		}).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[1]});
		}).then(async(result) => {
			balance = await web3.eth.getBalance(accounts[2]);
			let receipt = await tic_tac_toe.makeMove(game_id, 2, 1, {from: accounts[2]});
			let gas = receipt.receipt.gasUsed;
			let tx = await web3.eth.getTransaction(receipt.tx);
			let price = tx.gasPrice;
			diff = gas*price;
        	return receipt;
		}).then((result) => {
			return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[1]});
		}).then(async(result) => {
			eventArgs = getEventArgs(result, GAME_DONE_EVENT);
			assert.isTrue(eventArgs !== false, "Match didn't end");
			assert.equal(eventArgs.winner, 2, "Match won by wrong winner");
			let new_balance = await web3.eth.getBalance(accounts[2]);
            let error = (balance+2*price-new_balance-diff)/(new_balance+diff);
			assert.isAbove(1e-5, error, "Prize money not recieved by player1");
			// console.log(diff);
			// console.log(balance-new_balance);
			try{
        		await tic_tac_toe.makeMove(game_id, 2, 0, {from: accounts[2]});
			}
			catch(err){
				assert.include(err.message, "revert");
			}
		});
    });
});

function getEventArgs(transaction_result, event_name) {
	for (var i = 0; i < transaction_result.logs.length; i++) {
        var log = transaction_result.logs[i];

        if (log.event == event_name) {
            return log.args;
        }
    }

    return false;
}
