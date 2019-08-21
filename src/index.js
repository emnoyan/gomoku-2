import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function component since it doesn not require a state
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  boardRender() {
    const numSquares = this.props.squares.length;
    const sideLen = Math.sqrt(numSquares);
    let board = [];
    for(let i = 0; i < sideLen; i++){
      // need to create individual squares (children) first
      let children = [];
      for(let j = 0; j < sideLen; j++) {
        children.push(this.renderSquare(i * sideLen + j));
      }
      board.push(<div class="board-row">{children}</div>)
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.boardRender()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(this.props.size**2).fill(null),
      }],
      stepNumber: 0,
      XIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // creates copy of array
    // check if click is valid
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.XIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),  
      stepNumber: history.length,
      XIsNext: !this.state.XIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      XIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = winner + " has won!";
    } else {
      status = 'Next player: ' + (this.state.XIsNext ? 'X' : 'O');
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
            squares={current.squares}
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

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game size={9}/>,
  document.getElementById('root')
);
