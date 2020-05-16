var sel = document.getElementById("difficulty");

var arr = [[], [], [], [], [], [], [], [], []];
var temp = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
  }
}

function initializeTemp(temp) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      temp[i][j] = false;
    }
  }
}

function setTemp(board, temp) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        temp[i][j] = true;
      }
    }
  }
}

function setColor(temp) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (temp[i][j] == true) {
        arr[i][j].style.color = "#DC3545";
      }
    }
  }
}

function resetColor() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      arr[i][j].style.color = "green";
    }
  }
}

var board = [[], [], [], [], [], [], [], [], []];

let button = document.getElementById("generate-sudoku");
let solve = document.getElementById("solve");

console.log(arr);
function changeBoard(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        arr[i][j].innerText = board[i][j];
      } else arr[i][j].innerText = "";
    }
  }
}

button.onclick = function () {
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    var response = JSON.parse(xhrRequest.response);
    console.log(response);
    initializeTemp(temp);
    resetColor();

    board = response.board;
    setTemp(board, temp);
    setColor(temp);
    changeBoard(board);
  };
  xhrRequest.open(
    "get",
    `https://sugoku.herokuapp.com/board?difficulty=${sel.value}`
  );
  //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
  xhrRequest.send();
};

//Check is the placed value safe
function isSafe(board, r, c, n) {
  for (var i = 0; i < 9; i++) {
    if (board[i][c] == n || board[r][i] == n) return false;
  }

  //Sub Gride
  var startX = r - (r % 3);
  var startY = c - (c % 3);

  for (var x = startX; x < startX + 3; x++) {
    for (var y = startY; y < startY + 3; y++) {
      if (board[x][y] == n) return false;
    }
  }
  return true;
}

// you can make a call to changeboard(board) function to update the state on the screen
function solveSudokuHelper(board, r, c) {
  //base case
  if (r == 9) {
    changeBoard(board);
    return true;
  }
  //other cases - write your code here

  //Reach last column of each row
  if (c == 9) return solveSudokuHelper(board, r + 1, 0);

  //Pre Field box
  if (board[r][c] != 0) {
    return solveSudokuHelper(board, r, c + 1);
  }

  // Job of our algo
  for (var i = 0; i <= 9; i++) {
    if (isSafe(board, r, c, i)) {
      board[r][c] = i;
      var success = solveSudokuHelper(board, r, c + 1);
      if (success) {
        return true;
      }
      board[r][c] = 0;
    }
  }
  return;
}

function solveSudoku(board) {
  solveSudokuHelper(board, 0, 0);
}

solve.onclick = function () {
  solveSudoku(board);
};
