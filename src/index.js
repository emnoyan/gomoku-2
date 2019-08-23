import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function component since it doesn not require a state
function Node(props) {
  const outline = props.value ? '1px solid black' : 'None';
  return (
    <button 
      className="node" 
      onClick={props.onClick} 
      style={{background: props.value, border: outline}}>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <div className="square" key={i}></div>
    );
  }

  renderNode(i) {
    return (
      <Node
        value={this.props.nodes[i]} 
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  // each of the physical squares on the board
  boardRender() {
    const sideLen = Math.sqrt(this.props.nodes.length) - 1;
    let board = [];
    for(let i = 0; i < sideLen; i++){
      // need to create individual nodes (children) first
      let children = [];
      for(let j = 0; j < sideLen; j++) {
        children.push(this.renderSquare(i * sideLen + j));
      }
      board.push(<div className="board-row" key={i}>{children}</div>)
    }
    return board;
  }

  // each of the buttons
  nodeRender() {
    const numNodes = this.props.nodes.length;
    const sideLen = Math.sqrt(numNodes);
    let nodeBoard = [];
    for(let i = 0; i < sideLen; i++){
      // need to create individual nodes (children) first
      let children = [];
      for(let j = 0; j < sideLen; j++) {
        children.push(this.renderNode(i * sideLen + j));
      }
      nodeBoard.push(<div className="node-row" key={i}>{children}</div>)
    }
    return nodeBoard;
  }

  render() {
    return (
      <div className="wrapper"> 
        <div className="squares">{this.boardRender()}</div>
        <div className="nodes">{this.nodeRender()}</div> 

      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        nodes: Array(this.props.size**2).fill(null),
      }],
      stepNumber: 0,
      blackIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const nodes = current.nodes.slice(); // creates copy of array
    // check if click is valid
    if (calculateWinner(nodes) || nodes[i]) {
      return;
    }
    nodes[i] = this.state.blackIsNext ? 'black' : 'white';
    this.setState({
      history: history.concat([{
        nodes: nodes,
      }]),  
      stepNumber: history.length,
      blackIsNext: !this.state.blackIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      blackIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.nodes);

    let status;
    if (winner) {
      status = winner + " has won!";
    } else {
      status = 'Next player: ' + (this.state.blackIsNext ? 'black' : 'white');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            nodes={current.nodes}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(nodes) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (nodes[a] && nodes[a] === nodes[b] && nodes[a] === nodes[c]) {
      return nodes[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game size={13}/>,
  document.getElementById('root')
);
