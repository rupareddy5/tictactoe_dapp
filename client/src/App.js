import React, { Component } from 'react';
import NoGames from "./GameCount.js";
import CreateGame from './CreateGame.js';
import GameBoard from './Gameboard.js'
import { create } from 'domain';
import { throws } from 'assert';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      drizzleState: null,
      account: null,
      key: null,
      inGame: 0,
      oppJoin: false,
      number: 0,
      cur: ""
    }
    this.updateGameID = this.updateGameID.bind(this);
  }

  componentDidMount() {
    const { drizzle } = this.props;
    // console.log(drizzle);
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState: drizzleState });
        this.setState({ account: drizzleState.accounts[0] });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  updateGameID(val) {
    console.log(val);
    this.setState({ inGame: val });

  }

  showBoardClick() {
    const { drizzle } = this.props;
    const key = drizzle.contracts.TicTacToe.methods.inGame.cacheCall({ from: this.state.account });
    const contract = this.state.drizzleState.contracts.TicTacToe
    const ok = contract.inGame[key];

    let vat = ok && ok.value;

    if (vat > 0) {
      const both = drizzle.contracts.TicTacToe.methods.bothJoined.cacheCall(vat);
      const kek = contract.bothJoined[both];
      let pich = kek && kek.value;
      if (pich) {
        this.setState({ oppJoin: pich });
      }
      this.setState({ inGame: vat });

      const num = drizzle.contracts.TicTacToe.methods.myNum.cacheCall(vat);
      const puk = contract.myNum[num];
      let go = puk && puk.value
      if (go) {
        this.setState({ number: go });
      }

      const turn = drizzle.contracts.TicTacToe.methods.getCurPlayer.cacheCall(vat);
      const dlp = contract.getCurPlayer[turn];
      let bread = dlp && dlp.value;

      console.log(bread);
      if (bread) {
        this.setState({ cur: bread });
      }
    }

  }


  render() {
    if (this.state.loading) return "Loading Drizzle...";
    let games_disp;
    let create_game;
    let show_board;
    const { drizzle } = this.props;
    let display_cur;
    const contract = drizzle.contracts.TicTacToe;

    // const game_id =  



    create_game = <CreateGame drizzle={this.props.drizzle} account={this.state.account} drizzleState={this.state.drizzleState} />


    let state = this.state.drizzleState;

    return (

      <div className="App" style={{ margin: "20px" }}>
        <p >Accout information: </p>
        <p>Public Key: {this.state.account}</p>
        <p>Balance left: {state.accountBalances[this.state.account] / 10 ** 18} ETH</p>
        {create_game}

        <NoGames drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} account={this.state.account} your={this.state.number} />
        <button style={{ float: "right" }} onClick={() => {
          this.showBoardClick();
        }}>Show Board</button>
        {display_cur}

      </div>);
  }
}


export default App;
