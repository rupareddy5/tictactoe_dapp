import React, { Component } from "react"


class Dat extends Component {
    constructor() {
        super();
        this.state = {
            stackID: null
        }
    }

    joinClick(val, choice) {
        const drizzle = this.props.drizzle;
        const account = this.props.account;
        const stackID = drizzle.contracts.TicTacToe.methods.joinGame.cacheSend(val, choice, { from: account, value: 200000 });
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
            <div style={{ display: "inline" }}>
                <p>Game ID : {this.props.val}</p>
                <button onClick={() => {
                    this.joinClick(this.props.val, 0)
                }}>Join with Comp</button>
                <button onClick={() => {
                    this.joinClick(this.props.val, 1)
                }}>Join with Player</button>

                <p>{this.getTxstatus()}</p>
            </div>
        )
    }
}

export default Dat;