$(function() {

  /* -----------
      CONSTANTS
     ----------- */

  const COLS = 7;
  const ROWS = 6;


  /* ---------
      GLOBALS
     --------- */

  var isGameOver = false;
  var isGameTie = false;
  var playerOneTurn = true;
  var playerOneColor;
  var playerTwoColor;

  // Setup the game board array
  // data[col][row] = 'red'|'black'|undefined
  var data = new Array(COLS);
  for (var col = 0; col < COLS; col++) {
    data[col] = new Array(ROWS);
  }


  /* ------------
      GAME SETUP
     ------------ */

  // Add COLS x ROWS circles to the game board
  var divRow = $('<div>').addClass('row justify-content-md-center');
  for (var col = 0; col < COLS; col++) {
    var divCol = $('<div>').addClass('col col-md-auto').data({col: col});
    for (var row = ROWS - 1; row >=0 ; row--) {
      var divCircle = $('<div>').addClass('circle').data({col: col, row: row});
      $(divCol).append(divCircle);
    }
    $(divRow).append(divCol);
  }
  $('#game').append(divRow);

  // Show the color selection modal to kick off the game
  $('#modal-color').modal();


  /* ----------------
      EVENT HANDLERS
     ---------------- */

  // Color choice click event
  $('.choose-color').click(function(e) {
    playerOneColor = $(e.target).data('color');
    playerTwoColor = playerOneColor === 'red' ? 'black' : 'red';
    setMessagePlayer();
  });

  // Column click event
  $('.col').click(function(e) {
    if (checkGameOver()) return;

    var col = $(e.target).data('col');
    if (checkColFull(col)) return;

    placeInCol(col, getColor());
    
    if (checkGameOver()) {
      setMessageWinner();
    }
    else {
      playerOneTurn = !playerOneTurn;
      setMessagePlayer();
    }
  });


  /* ------------------
      HELPER FUNCTIONS
     ------------------ */

  // Return the current player's color
  function getColor() {
    return playerOneTurn ? playerOneColor : playerTwoColor;
  }

  // Return true if the given column is full
  function checkColFull(col) {
    for (var row = 0; row < ROWS; row++) {
      if (!data[col][row]) return false;
    }
    return true;
  }

  // Return true if the board is full
  function checkBoardFull() {
    for (var col = 0; col < COLS; col++) {
      if (!checkColFull(col)) return false;
    }

    return true;
  }

  // Place a color in a column
  function placeInCol(col, color) {
    var row = 0;
    while (data[col][row]) row++;
    if (row >= ROWS) return;
    data[col][row] = color;
    $('.circle').filter(function() {
      return $(this).data('col') == col && $(this).data('row') == row;
    }).first().addClass(color);
  }

  // Return true if the game is over
  function checkGameOver() {
    if (isGameOver) return true;

    var currColor = getColor();
    
    // Check for vertical sequence
    for (var col = 0; col < COLS; col++) {
      var currCount = 0;
      for (var row = 0; row < ROWS; row++) {
        var color = data[col][row];
        if (!color) break;
        if (color === currColor) currCount++;
        else currCount = 0;

        if (currCount >= 4) return setGameOver();
      }
    }

    // Check for horizontal sequence
    for (var row = 0; row < ROWS; row++) {
      var currCount = 0;
      for (var col = 0; col < COLS; col++) {
        var color = data[col][row];
        if (color === currColor) currCount++;
        else currCount = 0;

        if (currCount >= 4) return setGameOver();
      }
    }

    // Check for diagonal sequence
    for (var col = 0; col < COLS; col++) {
      var currCount = 0;
      for (var i = 0; col + i < COLS && i < ROWS; i++) {
        var checkCol = col + i;
        var checkRow = i;
        var color = data[checkCol][checkRow];
        if (!color) break;
        if (color === currColor) currCount++;
        else currCount = 0;

        if (currCount >= 4) return setGameOver();
      }
    }

    for (var col = COLS - 1; col >= 0; col--) {
      var currCount = 0;
      for (var i = 0; col - i >= 0 && i < ROWS; i++) {
        var checkCol = col - i;
        var checkRow = i;
        var color = data[checkCol][checkRow];
        if (!color) break;
        if (color === currColor) currCount++;
        else currCount = 0;

        if (currCount >= 4) return setGameOver();
      }
    }

    for (var row = 0; row < ROWS; row++) {
      var currCount = 0;
      for (var i = 0; i < COLS && row + i < ROWS; i++) {
        var checkCol = i;
        var checkRow = row + i;
        var color = data [checkCol][checkRow];
        if (!color) break;
        if (color === currColor) currCount++;
        else currCount = 0;

        if (currCount >= 4) return setGameOver();
      }
    }

    for (var row = 0; row < ROWS; row++) {
      var currCount = 0;
      for (var i = 0; COLS - 1 - i >= 0 && row + i < ROWS; i++) {
        var checkCol = COLS - 1 - i;
        var checkRow = row + i;
        var color = data [checkCol][checkRow];
        if (!color) break;
        if (color === currColor) currCount++;
        else currCount = 0;

        if (currCount >= 4) return setGameOver();
      }
    }

    if (checkBoardFull()) return setGameTie();

    return false;
  }

  // Mark the game as a tie. Returns true
  function setGameTie() {
    isGameTie = true;
    return setGameOver();
  }

  // Mark the game as over. Returns true
  function setGameOver() {
    isGameOver = true;
    return true;
  }

  // Sets the player message
  function setMessagePlayer() {
    $('#message-player').text(capitalize(getColor()) + ' player - Take turn.');
  }

  // Sets the winner message and displays the win modal
  function setMessageWinner() {
    var message = isGameTie ? 'Tie game!' : capitalize(getColor()) + ' player wins!';
    $('#message-player').text(message);
    $('#message-win').text(message);
    $('#modal-win').modal();
  }

  // Capitalize a string
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
});