$(function() {
  var gameOver = false;
  var playerOneTurn = true;
  var playerOneColor;
  var playerTwoColor;

  const COLS = 7;
  const ROWS = 6;

  // [COLS][ROWS]
  var data = new Array(COLS);

  var divRow = $('<div>').addClass('row justify-content-md-center');
  for (var col = 0; col < COLS; col++) {
    data[col] = new Array(ROWS);
    var divCol = $('<div>').addClass('col col-md-auto').data({col: col});
    for (var row = ROWS - 1; row >=0 ; row--) {
      var divCircle = $('<div>').addClass('circle').data({col: col, row: row});
      $(divCol).append(divCircle);
    }
    $(divRow).append(divCol);
  }
  $('#game').append(divRow);
  $('#modal-color').modal();

  $('.choose-color').click(function(e) {
    playerOneColor = $(e.target).data('color');
    playerTwoColor = playerOneColor === 'red' ? 'black' : 'red';
    setMessagePlayer();
  });

  $('.col').click(function(e) {
    if (isGameOver()) return;

    var col = $(e.target).data('col');
    if (isColFull(col)) return;

    var color = getColor();
    placeInCol(col, getColor());
    
    if (isGameOver()) {
      var message = capitalize(color) + ' player wins!';
      $('#message-player').text(message);
      $('#message-win').text(message);
      $('#modal-win').modal();
    }
    else {
      playerOneTurn = !playerOneTurn;
      setMessagePlayer();
    }
  });

  function getColor() {
    return playerOneTurn ? playerOneColor : playerTwoColor;
  }

  function isColFull(col) {
    for (var row = 0; row < ROWS; row++) {
      if (!data[col][row]) return false;
    }
    return true;
  }

  function placeInCol(col, color) {
    var row = 0;
    while (data[col][row]) row++;
    if (row >= ROWS) return;
    data[col][row] = color;
    $('.circle').filter(function() {
      return $(this).data('col') == col && $(this).data('row') == row;
    }).first().addClass(color);
  }

  function isGameOver() {
    if (gameOver) return true;

    // Check for vertical sequence
    var currCount = 1;
    var currColor;
    for (var col = 0; col < COLS; col++) {
      for (var row = 0; row < ROWS; row++) {
        var color = data[col][row];
        if (!color) break;
        if (color === currColor) currCount++;
        else currCount = 1;

        if (currCount >= 4) return setGameOver();
        else currColor = color;
      }
    }

    // Check for horizontal sequence
    currCount = 1;
    currColor = '';
    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        var color = data[col][row];
        if (color && color === currColor) currCount++;
        else currCount = 1;

        if (currCount >= 4) return setGameOver();
        else currColor = color;
      }
    }

    // Check for diagonal sequence
    currCount = 1;
    currColor = '';
    for (var col = 0; col < COLS; col++) {
      var color = data[col][row];
      for (var i = col + 1; i < COLS; i++) {

      }
    }

    return false;
  }

  function setGameOver() {
    gameOver = true;
    return true;
  }

  function setMessagePlayer() {
    $('#message-player').text(capitalize(getColor()) + ' player - Take turn.');
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
});