import React, { Component } from "react"
import styled from 'styled-components'
import Tile from "./Tile.js"


const Table = styled.div`
  width: 470px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;


class GameBoard extends Component {
    constructor() {
        super();
        this.state = {
            keys: [],
            gameBoard: ['x', 'o', '', '', '', '', '', '', ''],
            keyBoth: null,
            keyMy: null,
            keyScore1: null,
            keyScore2: null
        }
    }

    componentDidMount() {
        const { drizzle, drizzleState, gameID, account } = this.props;
        let tmp = []
        for (let i = 0; i < 9; i++) {
            const key = drizzle.contracts.TicTacToe.methods.getCellVal.cacheCall(gameID, parseInt(i / 3), parseInt(i % 3));
            tmp.push(key);
        }
        const solla = drizzle.contracts.TicTacToe.methods.bothJoined.cacheCall(gameID);
        const current = drizzle.contracts.TicTacToe.methods.myNum.cacheCall(gameID, { from: account });
        const wire = drizzle.contracts.TicTacToe.methods.getScore1.cacheCall(gameID);
        const sx = drizzle.contracts.TicTacToe.methods.getScore2.cacheCall(gameID);
        this.setState({ keys: tmp, keyBoth: solla, keyMy: current, keyScore1: wire, keyScore2: sx });
    }

    componentWillUnmount() {

    }

    printTiles() {
        let tiles = []
        for (let i = 0; i < 9; i++) {
            tiles.push(<Tile key={i} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} gameID={this.props.gameID} account={this.props.account} index={i} />);
        }

        return tiles;
    }

    render() {
        const { TicTacToe } = this.props.drizzleState.contracts;
        const keys = this.state.keys;
        let gameBoard = [];
        for (let i = 0; i < 9; i++) {
            const chk = TicTacToe.getCellVal[keys[i]];
            gameBoard.push(chk && chk.value);
        }

        const heh = TicTacToe.bothJoined[this.state.keyBoth];
        const mem = heh && heh.value;

        const yad = TicTacToe.myNum[this.state.keyMy];
        const val = yad && yad.value;
        const koj = TicTacToe.getScore1[this.state.keyScore1];

        const score1 = koj && koj.value;
        console.log(score1);

        const lanj = TicTacToe.getScore2[this.state.keyScore2];
        const score2= lanj && lanj.value;
        console.log(score2);
        return (
            <div>
                <Table>
                    {this.printTiles()}
                </Table>
                <div style={{ paddingTop: "30px" }}>
                    {mem == true ? <p>Game Started</p>
                        : <p>Opponent yet to join</p>
                    }

                    {mem == true ? <p>Your marker : {val}</p>
                        : null
                    }

                    {mem == true ? <p> X: {score1} <br></br>  O : {score2}</p>
                        : null

                    }

                </div>
            </div>
        );
    }
}

export default GameBoard;