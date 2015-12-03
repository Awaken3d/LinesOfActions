/*angular.module('myApp',['ngTouch', 'ui.bootstrap','gameServices'])
  .controller('Ctrl',
  ['$window', '$rootScope','$scope', '$log', '$timeout',
       'gameLogic',
       function (
      $window:any, $rootScope:any,$scope:any, $log:any, $timeout:any,
       gameLogic:any) {*/
var game;
(function (game) {
    game.rowsNum = 8;
    game.colsNum = 8;
    game.draggingStartedRowCol = null; // The {row: YY, col: XX} where dragging started.
    game.draggingPiece = null;
    game.draggingPieceAvailableMoves = null;
    game.nextZIndex = 61;
    game.board = undefined;
    function init() {
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            gameDeveloperEmail: "sm5119@nyu.edu",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            exampleGame: gameLogic.getExampleGame(),
            riddles: gameLogic.getRiddles(),
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
    }
    game.init = init;
    function sendComputerMove() {
        game.style = [[{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}]];
        //add animate;
        var move = gameLogic.createComputerMove(game.board, game.turnIndex);
        var brow1 = move[2].set.value.brow;
        var bcol1 = move[2].set.value.bcol;
        var arow = move[2].set.value.arow;
        var acol = move[2].set.value.acol;
        game.style[brow1][bcol1] = getStyle(brow1, bcol1, arow, acol);
        $timeout(function () {
            gameService.makeMove(move);
        }, 500);
        //gameService.makeMove(move);
    }
    game.sendComputerMove = sendComputerMove;
    //window.handleDragEvent = handleDragEvent;
    //dragAndDropService.addDragListener("gameArea", handleDragEvent);
    function handleDragEvent(type, clientX, clientY) {
        // Center point in gameArea
        game.gameArea = document.getElementById("gameArea");
        game.draggingLines = document.getElementById("draggingLines");
        game.horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
        game.verticalDraggingLine = document.getElementById("verticalDraggingLine");
        var x = clientX - game.gameArea.offsetLeft;
        var y = clientY - game.gameArea.offsetTop;
        var row, col;
        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= game.gameArea.clientWidth || y >= game.gameArea.clientHeight) {
            game.draggingLines.style.display = "none";
            if (game.draggingPiece) {
                // Drag the piece where the touch is (without snapping to a square).
                var size = getSquareWidthHeight();
            }
            else {
                return;
            }
        }
        else {
            // Inside gameArea. Let's find the containing square's row and col
            var col = Math.floor(game.colsNum * x / game.gameArea.clientWidth);
            var row = Math.floor(game.rowsNum * y / game.gameArea.clientHeight);
            if (type === "touchstart" && !game.draggingStartedRowCol) {
                // drag started
                if (game.board[row][col]) {
                    game.onStartCallback(row, col);
                    game.draggingStartedRowCol = { row: row, col: col };
                    if (game.isRed(row, col)) {
                        game.draggingPiece = document.getElementById("RedPiece" + game.draggingStartedRowCol.row + "x" + game.draggingStartedRowCol.col);
                    }
                    if (game.isWhite(row, col)) {
                        game.draggingPiece = document.getElementById("WhitePiece" + game.draggingStartedRowCol.row + "x" + game.draggingStartedRowCol.col);
                    }
                    game.draggingPiece.style['z-index'] = ++game.nextZIndex;
                    console.log("dragging piece=", game.draggingPiece);
                }
            }
            if (!game.draggingPiece) {
                return;
            }
            if (type === "touchend") {
                //console.log("mpika sto touchend");
                var from1 = game.draggingStartedRowCol;
                var to = { row: row, col: col };
                dragDone(from1, to);
            }
            else {
                // Drag continue
                setDraggingPieceTopLeft(getSquareTopLeft(row, col));
                game.draggingLines.style.display = "inline";
                var centerXY = getSquareCenterXY(row, col);
                game.verticalDraggingLine.setAttribute("x1", "" + centerXY.x);
                game.verticalDraggingLine.setAttribute("x2", "" + centerXY.x);
                game.horizontalDraggingLine.setAttribute("y1", "" + centerXY.y);
                game.horizontalDraggingLine.setAttribute("y2", "" + centerXY.y);
            }
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
            // drag ended
            // return the piece to it's original style (then angular will take care to hide it).
            setDraggingPieceTopLeft(getSquareTopLeft(game.draggingStartedRowCol.row, game.draggingStartedRowCol.col));
            game.draggingLines.style.display = "none";
            game.draggingStartedRowCol = null;
            game.draggingPiece = null;
        }
    }
    game.handleDragEvent = handleDragEvent;
    function setDraggingPieceTopLeft(topLeft) {
        var originalSize = getSquareTopLeft(game.draggingStartedRowCol.row, game.draggingStartedRowCol.col);
        game.draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        game.draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
    }
    game.setDraggingPieceTopLeft = setDraggingPieceTopLeft;
    function getSquareWidthHeight() {
        return {
            width: game.gameArea.clientWidth / game.colsNum,
            height: game.gameArea.clientHeight / game.rowsNum
        };
    }
    game.getSquareWidthHeight = getSquareWidthHeight;
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return { top: row * size.height, left: col * size.width };
    }
    game.getSquareTopLeft = getSquareTopLeft;
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col * size.width + size.width / 2,
            y: row * size.height + size.height / 2
        };
    }
    game.getSquareCenterXY = getSquareCenterXY;
    function dragDone(from1, to) {
        //$rootScope.$apply(function () {
        console.log("mpika sto dragdone");
        var msg = "Dragged piece " + from1.row + "x" + from1.col + " to square " + to.row + "x" + to.col;
        console.log("brow kai bcol apo dragdone " + game.brow + " " + game.bcol);
        //$log.info(msg);
        //$scope.msg = msg;
        // Update piece in board
        onDropCallback(to.row, to.col);
        //  });
    }
    game.dragDone = dragDone;
    function isWhiteSquare(row, col) {
        return ((row + col) % 2) == 0;
    }
    game.isWhiteSquare = isWhiteSquare;
    function getIntegersTill(number) {
        var res = [];
        for (var i = 0; i < number; i++) {
            res.push(i);
        }
        return res;
    }
    game.getIntegersTill = getIntegersTill;
    function getInitialBoard() {
        var board = [];
        for (var row = 0; row < game.rowsNum; row++) {
            board[row] = [];
            for (var col = 0; col < game.colsNum; col++) {
                board[row][col] = (row == 0 || row == 13) && !isWhiteSquare(row, col) ? "O" : null;
            }
        }
        return board;
    }
    game.getInitialBoard = getInitialBoard;
    function updateUI(params) {
        //alert("hello");
        //$scope.params = params;
        game.board = params.stateAfterMove.board;
        game.delta = params.stateAfterMove.delta;
        if (game.board === undefined) {
            game.board = gameLogic.getInitialBoard();
            game.style = [[{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}],
                [{}, {}, {}, {}, {}, {}, {}, {}]];
        }
        game.isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        game.turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if (game.isYourTurn
            && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            // Wait 500 milliseconds until animation ends.
            $timeout(sendComputerMove, 750);
        }
    }
    game.updateUI = updateUI;
    updateUI({ stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2 });
    game.onStartCallback = function (r, c) {
        //var r = arguments[2];
        //var c = arguments[3];
        //$log.info("drag start on cell: ", r,c);
        //$scope.cellClicked(r,c);
        game.brow = r;
        game.bcol = c;
        console.log("onstartcallback called");
        return;
    };
    function onDropCallback(row, col) {
        //var r = arguments[2];
        //var c = arguments[3];
        //$log.info("drop on cell: ", row, col);
        //$log.info("brow, bcol: ", $scope.brow, $scope.bcol);
        console.log("mpika sto dropcallback");
        game.isDragging = true;
        //$scope.cellClicked(r, c);
        try {
            console.log("mpika sto try");
            //console.log("board is "+board);
            console.log("brow kai bcol " + game.brow + " " + game.bcol);
            console.log("row kai col " + row + " " + col);
            var move = gameLogic.createMove(game.board, game.brow, game.bcol, row, col, game.turnIndex);
            //console.log(move);
            //test if the move is OK.
            var test = gameLogic.isMoveOk({ turnIndexBeforeMove: game.turnIndex,
                stateBeforeMove: { board: game.board,
                    delta: { brow: game.brow, bcol: game.bcol, arow: row, acol: col } },
                move: move });
            console.log("i kinisi einai entaksei " + test);
            if (!test) {
                //$scope.firstClicked = false;
                //updateUI($scope.params);
                return;
            }
            game.isYourTurn = false; // to prevent making another move
            //$scope.firstClicked = false;
            // TODO: show animations and only then send makeMove.
            //$log.info("before makeMove()");
            if (game.isDragging === false) {
                game.style = [[{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}, {}, {}, {}]];
                var brow3 = move[2].set.value.brow;
                var bcol3 = move[2].set.value.bcol;
                var arow = move[2].set.value.arow;
                var acol = move[2].set.value.acol;
                //var style = getStyle(brow, bcol, arow, acol);
                //$scope.style[brow][bcol] = style;
                //$log.info("style: ", style);
                $timeout(function () {
                    gameService.makeMove(move);
                }, 500);
            }
            else
                gameService.makeMove(move);
            game.isDragging = false;
        }
        catch (e) {
            //$log.info(["Cell is already full in position:", row, col]);
            return;
        }
        return;
    }
    game.onDropCallback = onDropCallback;
    ;
    game.isEven = function (row, col) {
        var t = row + col;
        return t % 2 === 0;
    };
    game.isOdd = function (row, col) {
        var t = row + col;
        return t % 2 === 1;
    };
    game.isSelected = function (row, col) {
        return game.brow === row && game.bcol === col;
    };
    game.isRed = function (row, col) {
        return game.board[row][col] === 'R';
    };
    game.isWhite = function (row, col) {
        return game.board[row][col] === 'W';
    };
    function getStyle(brow, bcol, arow, acol) {
        var left = (acol - bcol) * 100 + "px";
        var top = (arow - brow) * 100 + "px";
        return { top: top, left: left, position: "relative",
            "-webkit-animation": "moveAnimation 0.5s",
            "animation": "moveAnimation 0.5s" };
    }
    game.getStyle = getStyle;
    game.shouldSlowlyAppear = function (row, col) {
        return game.delta !== undefined &&
            game.delta.row === row && game.delta.col === col;
    };
})(game || (game = {}));
angular.module('myApp')
    .run(function () {
    $rootScope['game'] = game;
    /*gameService.setGame({
      gameDeveloperEmail: "purnima.p01@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
    //  exampleGame: gameLogic.exampleGame(),
      //riddles: gameLogic.riddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });*/
    translate.setLanguage('en', {
        "RULES_OF_LINESOFACTIONS": "Rules of Lines of Actions",
        "RULES_SLIDE1": "Lines of Action is played on a standard chessboard, with the same algebraic notation for ranks and files. Each player controls twelve checkers, which are initially arrayed as follows:",
        "RULES_SLIDE2": "A checker moves exactly as many spaces as there are checkers (both friendly and enemy) on the line in which it is moving",
        "RULES_SLIDE3": "A checker may jump over friendly checkers",
        "RULES_SLIDE4": "A checker may not jump over an enemy checker",
        "RULES_SLIDE5": "The object of the game is to bring all of one's checkers together into a contiguous body so that they are connected vertically, horizontally or diagonally",
        "RULES_SLIDE6": "A player who is reduced to a single checker wins the game, because his pieces are by definition united.",
        "CLOSE": "Close"
    });
    game.init();
});
