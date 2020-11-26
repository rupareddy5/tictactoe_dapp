pragma solidity >=0.4.21 <0.6.0;


contract TicTacToe {
    address payable owner;
    enum Players { None, PlayerOne, PlayerTwo }
    enum Winners { None, PlayerOne, PlayerTwo, Draw }
    uint256 public nrOfGames;
    
    struct Game {
        address playerOne;
        address playerTwo;
        uint256 playerOneStake;
        uint256 playerTwoStake;
        uint256 playerOneWins;
        uint256 playerTwoWins;
        Winners winner;
        Players playerTurn;
        Players[3][3] board;
        uint256 threshold;
        uint256 gameTime;
        uint256 duration;
        uint256 gameNo;
    }
    constructor () public {
        owner = msg.sender; 
    }
    mapping(uint256 => Game) public games;
    mapping(address => uint256) public PlayerGameMap;
    event GameCreated(uint256 gameId, address creator);
    event PlayerJoinedGame(uint256 gameId, address player, uint8 playerNumber);
    event PlayerMadeMove(uint256 gameId, address player, uint xCoordinate, uint yCoordinate);
    event GameOver(uint256 gameId, Winners winner);
    event SentMoney(uint256 money);
    event gameDone(uint gameId, uint gameNo, Winners winner);
    event TimedOut(uint256 duration, address player);
    function newGame() public returns (uint256 gameId, address creator) {
        require(msg.sender == owner, "Only owner can create game!");
        Game memory game;
        game.playerTurn = Players.PlayerOne;
        game.threshold = 20000;
        game.gameTime = now;
        game.gameNo = 1;
        game.duration = 1000000; //10s 
        nrOfGames++;
        games[nrOfGames] = game;
        emit GameCreated(uint256 (nrOfGames), msg.sender);
        return (nrOfGames, msg.sender);
    }

    function getNoGame() public view returns (uint256){
        return nrOfGames;
    }

    function joinGame(uint256 _gameId, uint8 choice) public payable returns (bool success, string memory reason) {
        require(_gameId <= nrOfGames && nrOfGames > 0, "No such game exists");

        Game storage game = games[_gameId];
        require (msg.value >= game.threshold, "Insufficient stake");
        require (PlayerGameMap[msg.sender] == 0, "Already in a game" );
        require(msg.sender!= address(game.playerOne) && msg.sender!= address(game.playerTwo), "You are already in game");
        require(game.playerOne == address(0) || game.playerTwo == address(0), "All seats taken");
        address player = msg.sender;
        
        emit SentMoney(game.threshold); 

        require(choice == 0 || choice == 1, "Wrong choice entered- 0:Player vs Random, 1:Player vs Player");

        // Assign the new player to slot 1 if it is still available.
        if (game.playerOne == address(0)) {
            game.playerOne = player;
            game.playerOneStake = msg.value;
            emit PlayerJoinedGame(_gameId, player, uint8(Players.PlayerOne));
            PlayerGameMap[msg.sender] = _gameId;
            if (choice == 0){
                game.playerTwo = address(this);
                game.playerTwoStake = msg.value;
                emit PlayerJoinedGame(_gameId, address(this), uint8(Players.PlayerTwo));
                return (true, "Joined as player one to play with random agent." );
            }
            return (true, "Joined as player one.");
        }
        if (game.playerTwo == address(0)) {
            PlayerGameMap[msg.sender] = _gameId;
            game.playerTwoStake = msg.value;
            game.playerTwo = player;
            emit PlayerJoinedGame(_gameId, player, uint8(Players.PlayerTwo));

            return (true, "Joined as player two. Player one can make the first move.");
        }
        return (false, "All seats taken.");
    }

    
    function makeMove(uint256 _gameId, uint _xCoordinate, uint _yCoordinate) public returns (bool success, string memory reason) {
        require(_gameId <= nrOfGames && nrOfGames > 0, "No such game exists");    
        Game storage game = games[_gameId];
        require(game.winner == Winners.None, "The game has already ended");
        require(game.gameNo <= 4, "Game limit exceeded. Money already transfered to winner");

        if (now - game.gameTime > game.duration){
            emit TimedOut(now - game.gameTime, getCurrentPlayer(game));
            address payable player = address(uint256(getCurrentPlayer(game)));
            player.transfer(game.playerOneStake + game.playerTwoStake);
            return(false, "Timed out");
        }
        game.gameTime = now;
        require(msg.sender == getCurrentPlayer(game), "Not your turn");
        require(game.board[_xCoordinate][_yCoordinate] == Players.None, "Invalid move, choose another cell");

        game.board[_xCoordinate][_yCoordinate] = game.playerTurn;
        emit PlayerMadeMove(_gameId, msg.sender, _xCoordinate, _yCoordinate);

        Winners winner = calculateWinner(game.board);
        if (winner != Winners.None) {
            if (winner == Winners.PlayerOne){
                game.playerOneWins++;
            }
            if (winner == Winners.PlayerTwo){
                game.playerTwoWins++;
            }
            
             if(game.gameNo == 4){
                address payable player;
                if(game.playerOneWins > game.playerTwoWins){
                    player = address(uint256(game.playerOne));
                    game.winner = Winners.PlayerOne;
                }
                else if (game.playerTwoWins > game.playerOneWins){
                    player = address(uint256(game.playerTwo));
                    game.winner = Winners.PlayerTwo;
                }
                else {
                    player = owner;
                    game.winner = Winners.Draw;
                }
                emit gameDone(_gameId, game.gameNo, winner);
                game.gameNo = 5;
                player.transfer(game.playerOneStake + game.playerTwoStake);
                
                return (true, "The game is over.");
            }

            else {
                for(uint i = 0; i<3; i++){
                    for(uint j = 0; j<3;j++){
                        game.board[i][j] = Players.None;
                    }
                }
                emit gameDone(_gameId, game.gameNo, winner);
                game.gameNo++;
                if(game.gameNo % 2 == 0){
                    game.playerTurn = Players.PlayerTwo;
                }
                else {
                    game.playerTurn = Players.PlayerOne;
                }
                return (true, "Match over, proceeding to next one");
            }
        }

        // A move was made and there is no winner yet.
        // The next player should make her move.
        nextPlayer(game);
        if (getCurrentPlayer(game) == address(this)){
            makeRandomMove(_gameId, game);
        }
        return (true, "Your turn is over");
    }

    function genRandomNumber() private pure returns (uint256 number){
        uint256 key = 0;
        uint256 random = uint256(keccak256(abi.encode(key))) % 10;
        key += 1;
        return random;
    }

    function makeRandomMove(uint256 _gameId, Game storage game) private{
        uint256 random = genRandomNumber();
        uint256 x_coordinate = random%3;
        uint256 y_coordinate = random/3;

       while (game.board[x_coordinate][y_coordinate] != Players.None){ 
            random = genRandomNumber();
            x_coordinate = random%3;
            y_coordinate = random/3;
        }    
        game.board[x_coordinate][y_coordinate] = game.playerTurn;
        emit PlayerMadeMove(_gameId, address(this), x_coordinate, y_coordinate);
    }

    function getCurrentPlayer(Game storage _game) private view returns (address player) {
        if (_game.playerTurn == Players.PlayerOne) {
            return _game.playerOne;
        }

        if (_game.playerTurn == Players.PlayerTwo) {
            return _game.playerTwo;
        }

        return address(0);
    }

   
    function calculateWinner(Players[3][3] memory _board) private pure returns (Winners winner) {
        // First we check if there is a victory in a row.
        // If so, convert `Players` to `Winners`
        // Subsequently we do the same for columns and diagonals.
        Players player = winnerInRow(_board);
        if (player != Players.None) {
            return player == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
        }
        
        player = winnerInColumn(_board);
        if (player != Players.None) {
            return player == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
        }

        player = winnerInDiagonal(_board);
        if (player != Players.None) {
            return player == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
        }

        // If there is no winner and no more space on the board,
        // then it is a draw.
        if (isBoardFull(_board)) {
            return Winners.Draw;
        }

        return Winners.None;
    }

   
    function winnerInRow(Players[3][3] memory _board) private pure returns (Players winner) {
        for (uint8 x = 0; x < 3; x++) {
            if (
                _board[x][0] == _board[x][1]
                && _board[x][1]  == _board[x][2]
                && _board[x][0] != Players.None
            ) {
                return _board[x][0];
            }
        }

        return Players.None;
    }

    
    function winnerInColumn(Players[3][3] memory _board) private pure returns (Players winner) {
        for (uint8 y = 0; y < 3; y++) {
            if (
                _board[0][y] == _board[1][y]
                && _board[1][y] == _board[2][y]
                && _board[0][y] != Players.None
            ) {
                return _board[0][y];
            }
        }

        return Players.None;
    }

    
    function winnerInDiagonal(Players[3][3] memory _board) private pure returns (Players winner) {
        if (
            _board[0][0] == _board[1][1]
            && _board[1][1] == _board[2][2]
            && _board[0][0] != Players.None
        ) {
            return _board[0][0];
        }

        if (
            _board[0][2] == _board[1][1]
            && _board[1][1] == _board[2][0]
            && _board[0][2] != Players.None
        ) {
            return _board[0][2];
        }

        return Players.None;
    }

    
    function isBoardFull(Players[3][3] memory _board) private pure returns (bool isFull) {
        for (uint8 x = 0; x < 3; x++) {
            for (uint8 y = 0; y < 3; y++) {
                if (_board[x][y] == Players.None) {
                    return false;
                }
            }
        }

        return true;
    }

    function getCellVal(uint256 _gameID, uint256 x, uint256 y) public view returns (string memory){
        
        if(games[_gameID].board[x][y]== Players.PlayerOne){
            return "x";
        }

        if(games[_gameID].board[x][y] == Players.PlayerTwo){
            return "o";
        }
        return "";
    }

    function nextPlayer(Game storage _game) private {
        if (_game.playerTurn == Players.PlayerOne) {
            _game.playerTurn = Players.PlayerTwo;
        } else {
            _game.playerTurn = Players.PlayerOne;
        }
    }

    function getGameCount() public view returns (uint256){
        return nrOfGames;
    }

    function inGame() public view returns (uint256){
        return PlayerGameMap[msg.sender];
    }

    function bothJoined(uint256 _gameID) public view returns(bool){
        Game memory game;
        game = games[_gameID];
        if(game.playerOne!=address(0) && game.playerTwo !=address(0)){
            return true;
        }

        return false;
    }

    function myNum(uint256 _gameID) public view returns (string memory){
        Game memory game;
        game = games[_gameID];
        if(game.playerOne == msg.sender) {
            return "x";
        }

        if(game.playerTwo==msg.sender){
            return "o";
        }

        return "";
    }

    function getCurPlayer(uint256 _gameID) public view returns (string memory){
        Game memory game;
        game = games[_gameID];
        if(game.playerTurn == Players.PlayerOne){
            return "x";
        }

        if(game.playerTurn == Players.PlayerTwo){
            return "o";
        }
        return "o";
    }

    function getGameNo(uint256 _gameID) public view returns (uint256){
        Game memory game;
        game = games[_gameID];
        return game.gameNo;
    }     

    function getScore1(uint256 _gameID) public view returns(uint256){
        Game memory game;
        game = games[_gameID];
        return (game.playerOneWins);
    }

    function getScore2(uint256 _gameID) public view returns(uint256){
        Game memory game;
        game = games[_gameID];
        return (game.playerTwoWins);
    }
    

}
