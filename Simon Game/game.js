var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

// start the game when a key is pressed at the beginning
$(document).keypress(function() {
  if (started == false) {
    nextSequence();
    started = true;
  }
});


// function to generate the next color in the sequence
function nextSequence() {
  userClickedPattern = [];

  $("#level-title").text("Level " + ++level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);
}


// when user presses a button
$(".btn").click(function() {
  var userChosenColor = this.id;
  userClickedPattern.push(userChosenColor);

  animatePress(userChosenColor);
  playSound(userChosenColor);

  checkAnswer(userClickedPattern.length - 1);
});

// function to check if user clicked the correct button
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    $("h1").text("Game Over, Press Any Key to Restart");
    startOver();
  }
}

// function to reset the values once game is over
function startOver() {
  level = 0;
  started = false;
  gamePattern = [];
}

// function to play sound corresding to the input color
function playSound(color) {
  var audio = new Audio("sounds/" + color + ".mp3");
  audio.play();
}

// function to show animation when user presses a button
function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed")
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
