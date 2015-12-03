/*angular.module('myApp',['ngTouch', 'ui.bootstrap','gameServices'])
  .controller('Ctrl',
  ['$window', '$rootScope','$scope', '$log', '$timeout',
       'gameLogic',
       function (
      $window:any, $rootScope:any,$scope:any, $log:any, $timeout:any,
       gameLogic:any) {*/
       module game {
     //'use strict';





   //export var gameArea = document.getElementById("gameArea");
      export var gameArea:HTMLElement;
    export var rowsNum = 8;
    export var colsNum = 8;
    export var draggingStartedRowCol:any = null; // The {row: YY, col: XX} where dragging started.
    export var draggingPiece:any = null;
    export var draggingPieceAvailableMoves:any = null;
    export var nextZIndex = 61;
    //extra
    //export var draggingLines = document.getElementById("draggingLines");
     //export var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
     //export var verticalDraggingLine = document.getElementById("verticalDraggingLine");
     export var draggingLines:HTMLElement ;
      export var horizontalDraggingLine:HTMLElement;
      export var verticalDraggingLine:HTMLElement ;
     export var style:any;
     export var board:any = undefined;
     export let turnIndex:any;
     export var delta:any;
     export let isYourTurn:any;
     export let brow:any;
     export let bcol:any;
     export let isDragging:any;


     export function init(){
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
	export function sendComputerMove() {

		style = [[{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
	 			[{},{},{},{},{},{},{},{}]];
		//add animate;
		var move = gameLogic.createComputerMove(board, turnIndex);
		var brow1 = move[2].set.value.brow;
		var bcol1 = move[2].set.value.bcol;
		var arow = move[2].set.value.arow;
		var acol = move[2].set.value.acol;
		style[brow1][bcol1] = getStyle(brow1, bcol1, arow, acol);
		$timeout(function(){
			gameService.makeMove(move);
		}, 500);
	    //gameService.makeMove(move);
	}
	     //window.handleDragEvent = handleDragEvent;
      //dragAndDropService.addDragListener("gameArea", handleDragEvent);
      export function handleDragEvent(type:any, clientX:any, clientY:any) {
        // Center point in gameArea
        gameArea =  document.getElementById("gameArea");
        draggingLines= document.getElementById("draggingLines");
         horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
         verticalDraggingLine = document.getElementById("verticalDraggingLine");
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        var row:any, col:any;

        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
          draggingLines.style.display = "none";
          if (draggingPiece) {
            // Drag the piece where the touch is (without snapping to a square).
            var size = getSquareWidthHeight();
           // setDraggingPieceTopLeft({top: y - size.height / 2, left: x - size.width / 2});
          } else {
            return;
          }
        } else {
          // Inside gameArea. Let's find the containing square's row and col
          var col:any = Math.floor(colsNum * x / gameArea.clientWidth);
          var row:any = Math.floor(rowsNum * y / gameArea.clientHeight);
          if (type === "touchstart" && !draggingStartedRowCol) {
            // drag started
            if (board[row][col]) {
              onStartCallback(row,col);
              draggingStartedRowCol = {row: row, col: col};
              if(isRed(row,col)){
              draggingPiece = document.getElementById("RedPiece" + draggingStartedRowCol.row + "x" + draggingStartedRowCol.col);
            }
              if(isWhite(row,col)){
              draggingPiece = document.getElementById("WhitePiece" + draggingStartedRowCol.row + "x" + draggingStartedRowCol.col);
            }

              draggingPiece.style['z-index'] = ++nextZIndex;
              console.log("dragging piece=",draggingPiece);
            }
          }
          if (!draggingPiece) {
            return;
          }
          if (type === "touchend") {
            //console.log("mpika sto touchend");
            var from1 = draggingStartedRowCol;
            var to = {row: row, col: col};
            dragDone(from1, to);

          } else {
            // Drag continue
            setDraggingPieceTopLeft(getSquareTopLeft(row, col));
            draggingLines.style.display = "inline";
            var centerXY = getSquareCenterXY(row, col);
            verticalDraggingLine.setAttribute("x1", ""+centerXY.x);
            verticalDraggingLine.setAttribute("x2", ""+centerXY.x);
            horizontalDraggingLine.setAttribute("y1", ""+centerXY.y);
            horizontalDraggingLine.setAttribute("y2", ""+centerXY.y);
          }
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
          // drag ended
          // return the piece to it's original style (then angular will take care to hide it).
          setDraggingPieceTopLeft(getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col));
          draggingLines.style.display = "none";
          draggingStartedRowCol = null;
          draggingPiece = null;
        }
      }
      export function setDraggingPieceTopLeft(topLeft:any) {
        var originalSize = getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col);
        draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
      }
      export function getSquareWidthHeight() {
        return {
          width: gameArea.clientWidth / colsNum,
          height: gameArea.clientHeight / rowsNum
        };
      }
      export function getSquareTopLeft(row:any, col:any) {
        var size = getSquareWidthHeight();
        return {top: row * size.height, left: col * size.width}
      }
      export function getSquareCenterXY(row:any, col:any) {
        var size = getSquareWidthHeight();
        return {
          x: col * size.width + size.width / 2,
          y: row * size.height + size.height / 2
        };
      }

      export function dragDone(from1:any, to:any) {
        //$rootScope.$apply(function () {
        console.log("mpika sto dragdone");
          var msg = "Dragged piece " + from1.row + "x" + from1.col + " to square " + to.row + "x" + to.col;
          console.log("brow kai bcol apo dragdone "+brow+" "+bcol);
          //$log.info(msg);
          //$scope.msg = msg;
          // Update piece in board
          onDropCallback(to.row, to.col)
      //  });
      }
      export function isWhiteSquare(row:any, col:any) {
        return ((row+col)%2)==0;
      }
      export function getIntegersTill(number:any) {
        var res:any = [];
        for (var i = 0; i < number; i++) {
          res.push(i);
        }
        return res;
      }
      export function getInitialBoard() {
        var board:any = [];
        for (var row = 0; row < rowsNum; row++) {
          board[row] = [];
          for (var col = 0; col < colsNum; col++) {
            board[row][col] = (row == 0 || row == 13) && !isWhiteSquare(row,col) ? "O" : null;
          }
        }
        return board;
      }
    export function updateUI(params:any) {
      //alert("hello");
      //$scope.params = params;
      board = params.stateAfterMove.board;
      delta = params.stateAfterMove.delta;
      if (board === undefined) {
        board = gameLogic.getInitialBoard();
        style = [[{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
	 			[{},{},{},{},{},{},{},{}]];
      }


      isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      turnIndex = params.turnIndexAfterMove;

      // Is it the computer's turn?
      if (isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        $timeout(sendComputerMove, 750);
      }
    }



    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});



    export let onStartCallback = function(r:any, c:any){
    	//var r = arguments[2];
    	//var c = arguments[3];
    	//$log.info("drag start on cell: ", r,c);
    	//$scope.cellClicked(r,c);
        brow = r;
	    bcol = c;
      console.log("onstartcallback called");
    	return;
    };


    export function onDropCallback(row:any, col:any){
    	//var r = arguments[2];
    	//var c = arguments[3];
    	//$log.info("drop on cell: ", row, col);
        //$log.info("brow, bcol: ", $scope.brow, $scope.bcol);
        console.log("mpika sto dropcallback");
    	isDragging = true;
    	//$scope.cellClicked(r, c);
    	try {
        console.log("mpika sto try");
        //console.log("board is "+board);
        console.log("brow kai bcol "+brow+" "+bcol);
        console.log("row kai col "+row+" "+col);


            var move:any = gameLogic.createMove(board, brow, bcol, row, col, turnIndex);

            //console.log(move);
            //test if the move is OK.
            var test = gameLogic.isMoveOk({turnIndexBeforeMove: turnIndex,
  	                                stateBeforeMove: {board: board,
     	                                                  delta: {brow: brow, bcol: bcol, arow: row, acol: col}},
                                      move: move});
                  console.log("i kinisi einai entaksei "+test);
            if(!test){
          	  //$scope.firstClicked = false;
          	  //updateUI($scope.params);
          	  return;
            }

            isYourTurn = false; // to prevent making another move
            //$scope.firstClicked = false;
            // TODO: show animations and only then send makeMove.
            //$log.info("before makeMove()");
            if(isDragging === false){
          	  style = [[{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              					[{},{},{},{},{},{},{},{}],
              					[{},{},{},{},{},{},{},{}],
              		 			[{},{},{},{},{},{},{},{}]];
          		  var brow3 = move[2].set.value.brow;
          		  var bcol3 = move[2].set.value.bcol;
          		  var arow = move[2].set.value.arow;
          		  var acol = move[2].set.value.acol;
          		  //var style = getStyle(brow, bcol, arow, acol);
          		  //$scope.style[brow][bcol] = style;
          		  //$log.info("style: ", style);
          		  $timeout(function(){
        			  gameService.makeMove(move);
        		  }, 500);
            }
            else gameService.makeMove(move);
            isDragging = false;
          } catch (e) {
            //$log.info(["Cell is already full in position:", row, col]);
            return;
          }



    	return;
    };

    export let isEven = function(row:any, col:any){
    	var t = row + col;
    	return t%2 === 0;
    }
    export let isOdd = function(row:any, col:any){
    	var t = row + col;
    	return t%2 === 1;
    }

    export let isSelected = function(row:any, col:any){
    	return brow === row && bcol === col;
    }

    export let isRed = function(row:any, col:any){
    	return board[row][col] === 'R';
    }

    export let isWhite = function(row:any, col:any){
    	return board[row][col] === 'W';
    }

    export function getStyle (brow:any, bcol:any, arow:any, acol:any) {

        var left = (acol - bcol) * 100 + "px";
        var top = (arow - brow) * 100 + "px";
        return {top: top, left: left, position: "relative",
                "-webkit-animation": "moveAnimation 0.5s",
                "animation": "moveAnimation 0.5s"};
    }
      export let shouldSlowlyAppear = function (row:any, col:any) {
      return delta !== undefined &&
          delta.row === row && delta.col === col;
    };


}
      angular.module('myApp')
   .run(function() {
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
       translate.setLanguage('en',{
       "RULES_OF_LINESOFACTIONS":"Rules of Lines of Actions",
       "RULES_SLIDE1":"Lines of Action is played on a standard chessboard, with the same algebraic notation for ranks and files. Each player controls twelve checkers, which are initially arrayed as follows:",
       "RULES_SLIDE2":"A checker moves exactly as many spaces as there are checkers (both friendly and enemy) on the line in which it is moving",
       "RULES_SLIDE3":"A checker may jump over friendly checkers",
       "RULES_SLIDE4":"A checker may not jump over an enemy checker",
       "RULES_SLIDE5":"The object of the game is to bring all of one's checkers together into a contiguous body so that they are connected vertically, horizontally or diagonally",
       "RULES_SLIDE6":"A player who is reduced to a single checker wins the game, because his pieces are by definition united.",
       "CLOSE":"Close"
 });
 game.init();
});
