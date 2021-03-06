import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={ props.onClick }
    >
        { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={ this.props.squares[i] } 
        onClick={ () => this.props.onClick(i) }
      />
    ); 
  }

  createGrid() {
    let grid = [];

    for(let row = 0; row < 3; row++) {
      let cols = [];
      for(let col = 0; col < 3; col++) {
        let squareIndex = (row * 3) + col;
        cols.push(<span key={ squareIndex }>{ this.renderSquare(squareIndex) }</span>)
      }
      grid.push(<div className="board-row" key={ row }>{ cols }</div>)
    }
    
    return grid;
  }

  render() {
    return (
      <div>
        { this.createGrid() }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (squares[i] || getWinner(squares)) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: history.concat([{
        squares: squares,
        location: [Math.floor(i % 3), Math.floor(i / 3)]
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
     });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const activeStep = {
      backgroundColor: 'skyblue'
    }

    const inactiveStep = {
      backgroundColor: 'grey',
      color: 'white'
    }

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = getWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move # ${move} at cell ${step.location}` : `Restart game`;

      return (
        <li key={ move }>
          <button style={ this.state.stepNumber === move ?  activeStep : inactiveStep } onClick={ () => this.jumpTo(move)}>{ desc }</button>
        </li>
      );
    });

    let status;

    if (winner) status = `The winer is player ${winner}!`;
    else status = `The next player is ${ this.state.xIsNext ? 'X' : 'O' }`;

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={ current.squares }
            onClick={ i => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={ () => this.setState({ ascending: !ascending }) }>{ this.state.ascending ? `Show descending` : `Show ascending`}</button>
          <ol>{ ascending ? moves : moves.reverse() }</ol>
        </div>
      </div>
    );
  }
}

function getWinner(squares) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }

  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
