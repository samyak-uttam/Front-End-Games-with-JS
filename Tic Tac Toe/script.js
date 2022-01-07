let turn = 0, tot = 0;
let grid = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];
let hasPlayerWon = 0, player1 = 0, tie = 0, player2 = 0;

function checkWinner() {
  let row = -1, col = -1, diag = -1;
  for (let i = 0; i < 3; i++) {
    if ((grid[i][0] == 'X' && grid[i][1] == 'X' && grid[i][2] == 'X') || (grid[i][0] == 'O' && grid[i][1] == 'O' && grid[i][2] == 'O')) {
      playerWon(grid[i][0] == 'X' ? 1 : 2);
      row = i;
    }
    if ((grid[0][i] == 'X' && grid[1][i] == 'X' && grid[2][i] == 'X') || (grid[0][i] == 'O' && grid[1][i] == 'O' && grid[2][i] == 'O')) {
      playerWon(grid[0][i] == 'X' ? 1 : 2);
      col = i;
    }
  }

  if ((grid[0][0] == 'X' && grid[1][1] == 'X' && grid[2][2] == 'X') || (grid[0][0] == 'O' && grid[1][1] == 'O' && grid[2][2] == 'O')) {
    playerWon(grid[0][0] == 'X' ? 1 : 2);
    diag = 0;
  }
  if ((grid[0][2] == 'X' && grid[1][1] == 'X' && grid[2][0] == 'X') || (grid[0][2] == 'O' && grid[1][1] == 'O' && grid[2][0] == 'O')) {
    playerWon(grid[1][1] == 'X' ? 1 : 2);
    diag = 1;
  }
  if (tot === 8) {
    playerWon(-1);
  }
  if (hasPlayerWon) {
    changeColors(row, col, diag);
  }
  return hasPlayerWon;
}

function playerWon(player) {
  hasPlayerWon = 1;
  if (player === 1) {
    $(".message").text("Player 1 won!");
    $(".player1-score").text(++player1);
  } else if (player === 2) {
    $(".message").text("Player 2 won!");
    $(".player2-score").text(++player2);
  } else {
    $(".message").text("Tie");
    $(".ties").text(++tie);
  }
}

function changeColors(row, col, diag) {
  if (row != -1 || col != -1 || diag == -1) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i != row && j != col)
          $("." + String.fromCharCode(i * 3 + j + 97)).css("color", "gray");
      }
    }
  } else {
    if (diag == 0) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i != j)
            $("." + String.fromCharCode(i * 3 + j + 97)).css("color", "gray");
        }
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i + j != 2)
            $("." + String.fromCharCode(i * 3 + j + 97)).css("color", "gray");
        }
      }
    }
  }
}


function reset() {
  grid = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];
  for (let i = 0; i < 9; i++) {
    $("." + String.fromCharCode(i + 97)).text("");
  }
  $("button").css({
    "color": "white",
    "fontSize": 0
  });
  $(".message").text("Player 1's turn");
  hasPlayerWon = 0;
  turn = 0;
  tot = 0;
}

$(".grid-item").click(function() {
  let pos = $(this).attr("class")[0].charCodeAt(0) - 97;
  if (hasPlayerWon === 1 || grid[Math.floor(pos / 3)][pos % 3] != ' ') {
    return;
  }
  $(this).animate({
    fontSize: "144px"
  }, 200);
  $(this).text(turn ? "O" : "X");
  grid[Math.floor(pos / 3)][pos % 3] = turn ? "O" : "X";
  if (checkWinner() === 0) {
    turn = !turn;
    tot++;
    $(".message").text("Player " + (turn + 1) + "'s turn");
  }
});

$("#reset").click(function() {
  reset();
});
