let grid = [], prev = [];

let colors = {
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
  4096: "#fc746f",
  8192: "#fb5c58"
};

let score = 0, prevScore = 0;

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateNew() {
  let check = 1;
  while (check == 1) {
    let rand = randomInRange(0, 16);
    if (grid[Math.floor(rand / 4)][rand % 4] == -1) {
      let value = randomInRange(1, 3) * 2;
      $("." + String.fromCharCode(rand + 97)).text(value).css("background-color", colors[value]);
      grid[Math.floor(rand / 4)][rand % 4] = value;
      check = 0;
    }
  }
}

function solve(arr) {
  let pre = -1;
  for (let i = 3; i >= 0; i--) {
    if (arr[i] != -1) {
      if (pre == -1 || arr[i] != arr[pre])
        pre = i;
      else if (arr[i] == arr[pre]) {
        arr[pre] *= 2;
        score += arr[pre];
        arr[i] = -1;
        pre = -1;
      }
    }
  }
}

function updateHTML() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      $("." + String.fromCharCode(r * 4 + c + 97)).text(grid[r][c] == -1 ? "" : grid[r][c]);
      $("." + String.fromCharCode(r * 4 + c + 97)).css("background-color", grid[r][c] == -1 ? "#cdc1b4" : colors[grid[r][c]]);
      $("." + String.fromCharCode(r * 4 + c + 97)).css("color", grid[r][c] > 4 ? "#faf8ef" : "#776e65");
    }
  }
  $(".score").text(score);
}

function upArrow() {
  for (let c = 0; c < 4; c++) {
    let col = [];
    for (let r = 3; r >= 0; r--)
      col.push(grid[r][c]);
    solve(col);
    for (let r = 0, i = 3; r < 4; i--) {
      if (i >= 0 && col[i] != -1)
        grid[r++][c] = col[i];
      else if (i < 0)
        grid[r++][c] = -1;
    }
  }
  updateHTML();
}

function downArrow() {
  for (let c = 0; c < 4; c++) {
    let col = [];
    for (let r = 0; r < 4; r++)
      col.push(grid[r][c]);
    solve(col);
    for (let r = 3, i = 3; r >= 0; i--) {
      if (i >= 0 && col[i] != -1)
        grid[r--][c] = col[i];
      else if (i < 0)
        grid[r--][c] = -1;
    }
  }
  updateHTML();
}

function rightArrow() {
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++)
      row.push(grid[r][c]);
    solve(row);
    for (let c = 3, i = 3; c >= 0; i--) {
      if (i >= 0 && row[i] != -1)
        grid[r][c--] = row[i];
      else if (i < 0)
        grid[r][c--] = -1;
    }
  }
  updateHTML();
}

function leftArrow() {
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 3; c >= 0; c--)
      row.push(grid[r][c]);
    solve(row);
    for (let c = 0, i = 3; c < 4; i--) {
      if (i >= 0 && row[i] != -1)
        grid[r][c++] = row[i];
      else if (i < 0)
        grid[r][c++] = -1;
    }
  }
  updateHTML();
}

function reset() {
  grid = [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ];
  for (let i = 0; i < 4; i++)
    prev[i] = grid[i].slice();
  score = 0, prevScore = 0;
  updateHTML();
  generateNew();
  generateNew();
}

$(window).on("load", function() {
  reset();
});

$(document).keydown(function(event) {
  let key = event.which;
  if (key == 38 || key == 40 || key == 39 || key == 37) {
    prevScore = score;
    for (let i = 0; i < 4; i++)
      prev[i] = grid[i].slice();
    if (key == 38) {
      upArrow();
    } else if (key == 40) {
      downArrow();
    } else if (key == 39) {
      rightArrow();
    } else if (key == 37) {
      leftArrow();
    }
    if (JSON.stringify(prev) != JSON.stringify(grid))
      generateNew();
    else {
      for(let r = 0; r < 4; r++) {
        if(grid[r].includes(-1))
          return;
      }
      alert("Game over");
    }
  }
});

$("#undo").click(function() {
  for (let i = 0; i < 4; i++)
    grid[i] = prev[i].slice();
    score = prevScore;
    updateHTML();
});

$("#restart").click(function() {
  reset();
});
