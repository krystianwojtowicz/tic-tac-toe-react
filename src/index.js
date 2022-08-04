import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "antd/dist/antd.min.css";
import { Switch } from "antd";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderBoard() {
    const items = []; //1
    for (
      let y = 0;
      y < this.props.squares.length;
      y = y + this.props.squares.length / 3
    ) {
      //2
      items.push(this.renderRow(y));
    }
    return items;
  }
  renderRow(i) {
    return <div className="board-row">{this.renderColumnsPerRow(i)}</div>;
  }
  renderColumnsPerRow(i) {
    const items = [];
    for (let y = 0; y < this.props.squares.length / 3; y++) {
      items.push(this.renderSquare(i + y));
    }
    return items;
  }
  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleClick(i) {
    const coords = [
      ["1,1"],
      ["1,2"],
      ["1,3"],
      ["2,1"],
      ["2,2"],
      ["2,3"],
      ["3,1"],
      ["3,2"],
      ["3,3"],
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: coords[i],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleToggle() {
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #` + move + ` : ` + step.location
        : "Go to game start";
      const changeClass = move === this.state.stepNumber ? "bold" : "";
      return (
        <li key={move}>
          <button className={changeClass} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    const reversedItems = moves.map((item) => item).reverse();
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <Switch onClick={this.handleToggle} />
          <div>{status}</div>
          <ol>{this.state.isToggleOn ? moves : reversedItems}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
