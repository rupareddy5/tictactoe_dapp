import React, { Component } from "react";
class CreateGame extends Component {
    constructor() {
        super();
        this.state = {
            stackID: null
        }
    }

    componentDidMount() {

    }

    CreateGameClick() {
        const drizzle = this.props.drizzle;
        const account = this.props.account;
        const drizzleState = this.props.drizzleState;
        const stackID = drizzle.contracts.TicTacToe.methods.newGame.cacheSend({ from: account });
        
        this.setState({ stackID });
    }

    getTxstatus = () => {
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackID];
        if (!txHash) return null;
        
        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    };


    render() {
        return (
            <div style={{paddingTop: "30px"}}>
                <button onClick={() => {
                    this.CreateGameClick()
                }}> Create Game </button>
            
                <p>{this.getTxstatus()}</p>
            </div>
        );
    }
}

export default CreateGame;