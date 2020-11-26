import React,{Component} from 'react';
import GameBoard from './Gameboard';

class NoGames extends Component{
    constructor(){
        super();
        this.state = {
            key: null,
            gameID : 0,
            gameKey: null,
            show_board : false
        }
    }

    componentDidMount(){
        const {drizzle, drizzleState, account} = this.props;
        // console.log(drizzle.drizzle);
        const contract = drizzle.contracts.TicTacToe;
        const key = contract.methods.nrOfGames.cacheCall();
        const macha = contract.methods.inGame.cacheCall({from:this.props.account});
        
        this.setState({gameKey:macha, key});
    }

    joinClick(val, choice) {
        const drizzle = this.props.drizzle;
        const account = this.props.account;
        const stackID = drizzle.contracts.TicTacToe.methods.joinGame.cacheSend(val, choice, { from: account, value: 200000 });
        this.setState({ show_board:true, stackID });
        
    }

    getTxstatus = () => {
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackID];
        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    };


    createShow = (cnt,chk) => {
        
        let final = [];
        if(chk > 0) return final;
        
        for(let i = 1; i <= cnt; i++){
            final.push(<div style={{ display: "inline" }}>
            <p>Game ID : {this.props.val}</p>
            <button onClick={() => {
                this.joinClick(i, 0)
            }}>Join with Comp</button>
            <button onClick={() => {
                this.joinClick(i, 1)
            }}>Join with Player</button>

            <p>{this.getTxstatus()}</p>
        </div>);
        }

        return final;
    }

    render(){
        const {TicTacToe} = this.props.drizzleState.contracts;
        const ok = TicTacToe.nrOfGames[this.state.key]
        let cnt = (ok&&ok.value);

        const bhee = TicTacToe.inGame[this.state.gameKey];
        let chk = (bhee && bhee.value);
        return(
            <div style={{maxWidth:"200px"}}>
            <p>No. Of Games : {cnt}</p>
            <div style={{alignContent:""}}>
            
            {this.createShow(cnt,chk)} 
            </div>
            {
                chk > 0 ? <GameBoard drizzle={this.props.drizzle} drizzleState = {this.props.drizzleState} gameID = {chk} account={this.props.account} />:
                 null
            }
            </div>
        );
    }
}


export default NoGames;