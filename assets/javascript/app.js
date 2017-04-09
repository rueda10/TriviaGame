// Game variables
var timeLimit = 30;
const questionsURL = "https://opentdb.com/api.php?amount=1&category=22&difficulty=medium&type=multiple";
var timer = undefined;
var correctAnswers = 0;
var incorrectAnswers = 0;
var unanswered = 0;

/**
 * Initializes counters
 */
function init() {
  correctAnswers = 0;
  incorrectAnswers = 0;
  unanswered = 0;
}

/**
 * Initial div is created
 */
function startGame() {
  $("#content").empty();
  var button = $("<button>");
  button.attr("type","button");
  button.addClass("btn btn-success my-button");
  button.html("Start Game!")
  button.appendTo("#content");

  button.on("click", function() {
    displayQuestions();
  });
}

/**
 * Questions are displayed, countdown is started
 * and answer click handlers are added
 */
function displayQuestions() {
  // Checks if game is over
  if (isGameOver()) {
    // If game is over, display game over window and return
    displayGameOver();
    return false;
  }

  // Make ajax call to get trivia questions
  $.ajax({
    url: questionsURL,
    method: "GET"
  }).done(function(response) {
    // Get API call data
    var result = response.results[0];

    // Clear out contents div
    $("#content").empty();

    // Create question elements
    var contentDiv = $('<div class="row question">');
    var questionDiv = $('<div class="col-xs-12">');
    questionDiv.html(result.question);
    questionDiv.appendTo(contentDiv);
    var placeholderDiv = $('<div class="row">');
    var placeholderCol = $('<div class="col-xs-12">');
    placeholderCol.html('<span style="opacity: 0">a</span>');
    placeholderDiv.append(placeholderCol);
    placeholderDiv.appendTo(contentDiv);

    // put all answers in array and shuffle array
    var options = [];
    options.push(result.correct_answer);
    options = options.concat(result.incorrect_answers);
    options = shuffle(options);

    // Iterate through answers, display them and add button handler
    for(var i = 0; i < options.length; i++) {
      var rowDiv = $('<div class="row answer">');
      var answerDiv = $('<div class="col-xs-12">');

      answerDiv.html(options[i]);
      rowDiv.append(answerDiv);
      rowDiv.appendTo(contentDiv);

      rowDiv.on("click", function() {
        clearTimeout(timer);
        if ($(this).find("div.col-xs-12").html() === result.correct_answer) {
          // correct answer was chosen. Increment correct answer var and display answer div
          correctAnswers++;
          displayCorrectAnswer(result.correct_answer, "Correct!");
        } else {
          // Incorrect answer was chosen. Increment incorrect answer var and display answer div
          incorrectAnswers++;
          displayCorrectAnswer(result.correct_answer, "Nope!");
        }
      });
    }

    // append contents to content div
    $("#content").append(contentDiv);

    // create 30 second countdown
    timeLimit = 30;
    $("#banner").html("Time Remaining: " + timeLimit + " seconds");
    timer = setInterval(function() {
      timeLimit--;
      if (timeLimit === 0) {
        // if 30 seconds are over, increment unanswered var and display answer div
        clearInterval(timer);
        unanswered++;
        displayCorrectAnswer(result.correct_answer, "Out of Time!");
      }
      $("#banner").html("Time Remaining: " + timeLimit + " seconds");
    }, 1000);
  });
}

/**
 * Displays relevant message, waits 3 seconds and moves to next question
 */
function displayCorrectAnswer(answer, message) {
  $("#content").empty();

  var row = $('<div class="row question">');
  var column = $('<div class="col-xs-12">');
  column.html(message + " The answer was " + answer);
  column.appendTo(row);
  var placeholderDiv = $('<div class="row">');
  var placeholderCol = $('<div class="col-xs-12">');
  placeholderCol.html('<span style="opacity: 0">a</span>');
  placeholderDiv.append(placeholderCol);
  placeholderDiv.appendTo(row);

  $("#content").append(row);

  setTimeout(displayQuestions, 3000);
}

/**
 * Displays game over contents in div
 */
function displayGameOver() {
  $("#content").empty();

  var row = $('<div class="row question">');
  var column = $('<div class="col-xs-12">');
  column.html("All done! Here's how you did:");
  column.appendTo(row);

  var placeholderDiv = $('<div class="row">');
  var placeholderCol = $('<div class="col-xs-12">');
  placeholderCol.html('<span style="opacity: 0">a</span>');
  placeholderDiv.append(placeholderCol);
  placeholderDiv.appendTo(row);

  $("#content").append(row);

  var correctRow = $('<div class="row">');
  var correctColumn = $('<div class"col-xs-12">');
  correctColumn.html("Correct Answers: " + correctAnswers);
  correctColumn.appendTo(correctRow);

  $("#content").append(correctRow);

  var incorrectRow = $('<div class="row">');
  var incorrectColumn = $('<div class"col-xs-12">');
  incorrectColumn.html("Incorrect Answers: " + incorrectAnswers);
  incorrectColumn.appendTo(incorrectRow);

  $("#content").append(incorrectRow);

  var unansweredRow = $('<div class="row">');
  var unansweredColumn = $('<div class"col-xs-12">');
  unansweredColumn.html("Unanswered: " + unanswered);
  unansweredColumn.appendTo(unansweredRow);

  var placeholderDiv2 = $('<div class="row">');
  var placeholderCol2 = $('<div class="col-xs-12">');
  placeholderCol2.html('<span style="opacity: 0">a</span>');
  placeholderDiv2.append(placeholderCol2);
  placeholderDiv2.appendTo(unansweredRow);

  $("#content").append(unansweredRow);

  var buttonRow = $('<div class="row">');
  var buttonColumn = $('<div class"col-xs-12">');
  var buttonElement = $('<button>');
  buttonElement.attr("type","button");
  buttonElement.addClass("btn btn-success my-button");
  buttonElement.html("Start Game!");
  buttonElement.appendTo(buttonRow);

  $("#content").append(buttonRow);

  buttonElement.on("click", function() {
    init();
    displayQuestions();
  });
}

/**
 * Shuffles array
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Checks if game is over
 */
function isGameOver() {
  if (correctAnswers + incorrectAnswers + unanswered === 10) {
    return true;
  }
  return false;
}

startGame();
