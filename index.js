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
  $('#modal-color').modal({backdrop: 'static', keyboard: false});


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
    // Find the first empty row
    var row = 0;
    while (data[col][row]) row++;
    if (row >= ROWS) return;

    // Add the color to the game board
    data[col][row] = color;
    $('.circle').filter(function() {
      return $(this).data('col') == col && $(this).data('row') == row;
    }).first().addClass(color);
  }

  // Return true if the game is over
  function checkGameOver() {
    if (isGameOver) return true;

    // Check for vertical sequence
    for (var col = 0; col < COLS; col++) {
      for (var row = 0; row < ROWS - 3; row++) {
        var color = data[col][row];
        if (!color) break; // Can quit early if we reach the end of a column
        if (color === data[col][row + 1] &&
            color === data[col][row + 2] &&
            color === data[col][row + 3])
          return setGameOver(col, 0, row, 1);
      }
    }

    // Check for horizontal sequence
    for (var col = 0; col < COLS - 3; col++) {
      for (var row = 0; row < ROWS; row++) {
        var color = data[col][row];
        if (!color) continue;
        if (color === data[col + 1][row] &&
            color === data[col + 2][row] &&
            color === data[col + 3][row])
          return setGameOver(col, 1, row, 0);
      }
    }

    // Check for diagonal sequence
    for (var col = 0; col < COLS - 3; col++) {
      for (var row = 0; row < ROWS - 3; row++) {
        var color = data[col][row];
        if (!color) continue;
        if (color === data[col + 1][row + 1] &&
            color === data[col + 2][row + 2] &&
            color === data[col + 3][row + 3])
          return setGameOver(col, 1, row, 1);
      }
    }

    // Check for reverse diagonal sequence
    for (var col = 0; col < COLS - 3; col++) {
      for (var row = 3; row < ROWS; row++) {
        var color = data[col][row];
        if (!color) continue;
        if (color === data[col + 1][row - 1] &&
            color === data[col + 2][row - 2] &&
            color === data[col + 3][row - 3])
          return setGameOver(col, 1, row, -1);
      }
    }

    if (checkBoardFull()) return setGameTie();

    return false;
  }

  // Set the game as a tie. Returns true
  function setGameTie() {
    isGameTie = true;
    return setGameOver();
  }

  // Set the game as over. Returns true
  function setGameOver(col, colDelta, row, rowDelta) {
    // Mark the winning circles
    if (col >= 0 && row >= 0) {
      for (var i = 0; i < 4; i++) {
        $('.circle').filter(function() {
          return $(this).data('col') == col + i * colDelta && $(this).data('row') == row + i * rowDelta;
        }).first().addClass('win');
      }
    }
    isGameOver = true;
    return true;
  }

  // Set the player message
  function setMessagePlayer() {
    $('#message-player').text(capitalize(getColor()) + ' player - Take turn.');
  }

  // Set the winner message and display the win modal
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