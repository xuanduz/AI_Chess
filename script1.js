var board,
  game = new Chess();


var onDragStart = function (source, piece, position, orientation) {
  if (
    game.in_checkmate() === true ||
    game.in_draw() === true ||
    piece.search(/^b/) !== -1
  ) {
    return true;
  }
};


var renderMoveHistory = function (moves) {
  var historyElement = $("#move-history").empty();
  historyElement.empty();
  for (var i = 0; i < moves.length; i = i + 2) {
    historyElement.append(
      "<span>" +
        moves[i] +
        " " +
        (moves[i + 1] ? moves[i + 1] : " ") +
        "</span><br>"
    );
  }
  historyElement.scrollTop(historyElement[0].scrollHeight);
};

var onDrop = function (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: "q",
  });

  removeGreySquares();
  if (move === null) {
    return "snapback";
  }

  renderMoveHistory(game.history());

  if (game.game_over()) {
    alert("Game over");
  }
};


var move = new Audio('./move.wav');

var onSnapEnd = function () {
  move.play();
  board.position(game.fen());
};

var onMouseoverSquare = function (square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  if (moves.length === 0) return;
  if ($("#startBtn").is(":disabled")) {
    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  }
  
};

var onMouseoutSquare = function (square, piece) {
  removeGreySquares();
};

var removeGreySquares = function () {
  $("#board .square-55d63").css("background", "");
};

var greySquare = function (square) {
  var squareEl = $("#board .square-" + square);

  var background = "#a9a9a9";
  if (squareEl.hasClass("black-3c85d") === true) {
    background = "#696969";
  }

  squareEl.css("background", background);
};

var cfg = {
  draggable: true,
  position: "clear",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  dropOffBoard: "trash",
  sparePieces: true,
};
board = ChessBoard("board", cfg);

$("#startBtn").click(function () {
  board.start();

  $("#startBtn").prop("disabled", true);
  $("#clearBtn").prop("disabled", false);
});

$("#clearBtn").click(function () {
  var ans = window.confirm('Clear ?')
  if (ans) {
    board.clear();
    game = new Chess();
    $("#position-count").text("");
    $("#time").text("");
    $("#positions-per-s").text("");
    $("#move-history").empty();
  
    $("#startBtn").prop("disabled", false);
    $("#search-depth").prop("disabled", false);
  }
});
