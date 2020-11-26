import Web3 from "web3";
import TicTacToe from "./contracts/TicTacToe.json";

const options = {
  web3: {
    fallback: {
        type : "ws",
        url:"ws://127.0.0.1:8545",
    }
  },
  contracts: [TicTacToe],
  polls:{
    accounts : 3000
  }
  
};

export default options;