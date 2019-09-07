import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function component since it doesn not require a state
function Stone(props) {
  const outline = props.value ? '1px solid black' : 'None';
  return (
    <button 
      className="stone" 
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

  renderStone(i, j) {
    return (
      <Stone
        value={this.props.nodes[i][j].stone} 
        onClick={() => this.props.onClick(i, j)}
        key={i * this.props.nodes.length + j}
      />
    );
  }

  // each of the physical squares on the board
  boardRender() {
    const sideLen = this.props.nodes.length - 1;
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
  stoneRender() {
    const sideLen = this.props.nodes.length;
    let stoneBoard = [];
    for(let i = 0; i < sideLen; i++){
      // need to create individual nodes (children) first
      let children = [];
      for(let j = 0; j < sideLen; j++) {
        children.push(this.renderStone(i, j));
      }
      stoneBoard.push(<div className="stone-row" key={i}>{children}</div>)
    }
    return stoneBoard;
  }

  render() {
    return (
      <div className="wrapper"> 
        <div className="squares">{this.boardRender()}</div>
        <div className="stones">{this.stoneRender()}</div> 
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    // each node should be contain a stone and neighbors array
    // we must declare this way because of unexpected behavior when declaring
    // 2D arrays with fill()
    const board = [];
    for(let i = 0; i < this.props.size; i++) {
      board[i] = Array(this.props.size).fill().map((x, j) => ({
        stone: null,
        // define each stones set of neighbors based on position
        neighbors: Array(8).fill().map((neighbor, k) => {
          if (i === 0) {
            if (k < 3) {
              return null;
            }
          } else if (i === this.props.size - 1) {
            if (k > 4) {
              return null;
            }
          } 
          if (j === 0) {
            if (k === 0 || k === 3 || k === 5) {
              return null;
            }
          } else if (j === this.props.size - 1) {
            if (k === 2 || k === 4 || k === 7) {
              return null;
            }
          }
          // if the above conditions are not satisfied, the neighbor exists
          return 0;
        }),
      }))
    }
    this.state = {
      history: [{
        nodes: board,
      }],
      stepNumber: 0,
      blackIsNext: true,
    };
  }

  // function to update a node's neighors upon click
  updateNeighbors(i) {
    // neighbors are of the form
    // [0, 1, 2
    //  3,  , 4
    //  5, 6, 7]
    i.neighbors.forEach((d, i) => {
      console.log(i);
    })

  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // create a DEEP copy of the array (.slice does not copy internal objects)
    const nodes = JSON.parse(JSON.stringify(current.nodes))
    // check if click is valid
    if (nodes[i][j].stone) {
      return;
    }
    nodes[i][j].stone = this.state.blackIsNext ? 'black' : 'white';
    // update the neighbors nodes
    // this.updateNeighbors(nodes[i]);
    // set the new state
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
    console.log(current.nodes)
    // const winner = calculateWinner(current.nodes);

    let status;
    status = "placeholder";
    // if (winner) {
    //   status = winner + " has won!";
    // } else {
    //   status = 'Next player: ' + (this.state.blackIsNext ? 'black' : 'white');
    // }

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
            onClick={(i, j)=>this.handleClick(i, j)}
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
  // const numNodes = nodes.length;
  // const sideLen = Math.sqrt(numNodes);
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
