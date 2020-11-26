import React,{Component} from 'react';
import styled from 'styled-components';
import { parse } from 'path';

const Container = styled.div`
  width: 30%;
  height: 150px;
  font-size: 60px;
  background: transparent;
  outline:  6px solid #e4751b;
  boder-left: ${props => props.left ? 'none' : '8px'};
  display: table;
  float: left;
  line-height: 150px;
  text-align: center;
`;

const Value = styled.p`
  display: table-cell;
  vertical-align: middle;
  
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 90px ;
  font-weight: 700;
  color: #e4751b;
  
`;
class Tile extends Component {
    constructor(){
        super();
        this.state = {
            tileState: "None",
            keyCell : null
        }
    }

    componentDidMount(){
        const drizzle = this.props.drizzle;
        const gameID = this.props.gameID;
        const account = this.props.account;
        const ind = this.props.index;
        const contract = drizzle.contracts.TicTacToe;
        const key = contract.methods.getCellVal.cacheCall(gameID,parseInt(ind/3), parseInt(ind%3), {from: account});
        this.setState({keyCell:key});
        // const macha = contract.methods.inGame.cacheCall({from:this.props.account});
    }


    clickTile(ind){
        const drizzle = this.props.drizzle;
        const account = this.props.account;
        const gameID = this.props.gameID;
        const stackID = drizzle.contracts.TicTacToe.methods.makeMove.cacheSend(gameID,parseInt(ind/3), parseInt(ind%3));
    }

    render() {
        const { TicTacToe } = this.props.drizzleState.contracts;
        const val = TicTacToe.getCellVal[this.state.keyCell];
        
        const ans = val && val.value;
        
        return(
            <Container onClick = {()=>{
                this.clickTile(this.props.index);
            }}>
                <Value>
                    {ans}
                </Value>
            </Container>
        );
    }
}

export default Tile;