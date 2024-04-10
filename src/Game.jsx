import React from 'react'
import './Game.css'
import { sudoku } from './sudoku.js'
// Fare riferimento a http://norvig.com/sudoku.html

// var sudoku = {};
console.log(sudoku);

function Square(props) {
  let class_name = "square" + (props.selected == props.value ? " selected" : "") + (props.error ? " error" : "");;
  let value = props.value == '.'?'':props.value
  return (
    <button className={class_name} onClick={props.onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   squares: props.squares,
    //   selNum: props.selNum,
    // };
  }

  renderSquare(row, col) {
    return (<Square selected={this.props.selected} 
                    error={this.props.error}
                    value={this.props.squares[row * 9 + col]} 
                    onClick={() => this.props.squareClick(row, col)} />);
  }

  renderSubBox(num) {
    const baserow = parseInt(num / 3) * 3;
    const basecol = parseInt(num % 3) * 3;
    return (
      <div className="subsquare">
        <div className="board-row">
          {this.renderSquare(baserow, basecol + 0)}
          {this.renderSquare(baserow, basecol + 1)}
          {this.renderSquare(baserow, basecol + 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(baserow + 1, basecol + 0)}
          {this.renderSquare(baserow + 1, basecol + 1)}
          {this.renderSquare(baserow + 1, basecol + 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(baserow + 2, basecol + 0)}
          {this.renderSquare(baserow + 2, basecol + 1)}
          {this.renderSquare(baserow + 2, basecol + 2)}
        </div>      </div>
    );
  }

  renderBoxRow(num) {
    return (
      <tr>
        <td>{this.renderSubBox(num + 0)}</td>
        <td>{this.renderSubBox(num + 1)}</td>
        <td>{this.renderSubBox(num + 2)}</td>
      </tr>
    );
  }
  render() {
    const status = '{status}';
    //console.log(this.state.squares[0]);
    return (
      <div>
        <table>
          <tbody>
            {this.renderBoxRow(0)}
            {this.renderBoxRow(3)}
            {this.renderBoxRow(6)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // squares: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......",
      squares: sudoku.generate(45),
      selNum: 1,
    };
    // console.log("STATI:")
    // console.log(this.state.squares);
    this.handleSquareClick = this.handleSquareClick.bind(this);
  }
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board selected={this.state.selNum} squares={this.state.squares} squareClick={this.handleSquareClick} />
        </div>
        <div className="game-select-num">
          <GameSelectNum selected={this.state.selNum} squares={this.state.squares} onClick={(i) => this.handleNumSel(i)} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  handleSquareClick(i, j) {
    //console.log("handleSquareClick: " + i + "," + j);
    let pos = i * 9 + j;
    const chars = this.state.squares.split('');
    chars[pos] = this.state.selNum;
    let squares = chars.join('');
    let candidates= sudoku.get_candidates(this.state.squares)[i][j];
    //console.log(candidates);
    //console.log(candidates.indexOf(chars[pos]));
    if (//chars[pos] === sudoku.BLANK_CHAR 
         candidates.indexOf(chars[pos]) > -1
       ) {
      this.setState({ squares: squares });
    }
  }

  handleNumSel(i) {
    this.setState({ selNum: i });
    //console.log(this.state);
  }
}

function NumSel(props) {
  let classname = "numsel" + (props.selected ? " selected" : "") + (props.disabled ? " disabled" : "");
  return (
    <button class={classname} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function GameSelectNum(props) {
  const elems = [];
  for (let i = 1; i < 10; i++) {
    console.log("Squares.split(" + i+ "): - length:" + props.squares.split(i).length)
    let disabled = props.squares.split(i).length === 10;
    elems.push(
      <NumSel
        value={i}
        disabled = {disabled}
        selected={props.selected === i}
        onClick={() => props.onClick(i)} />
    );
  }
  return elems;
}


