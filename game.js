'use strict';

angular.module('myApp', ['ngDraggable', 'ngTouch'])
  .controller('Ctrl',['$window', '$rootScope','$scope', '$log', '$timeout',
      'gameService', 'gameLogic','resizeGameAreaService',
       function (
      $window, $rootScope,$scope, $log, $timeout,
      gameService, gameLogic,resizeGameAreaService) {
     'use strict';
	var moveAudio = new Audio('audio/move.wav');  
	moveAudio.load();
	resizeGameAreaService.setWidthToHeight(1);

   var gameArea = document.getElementById("gameArea");
    var rowsNum = 8;
    var colsNum = 8;
    var draggingStartedRowCol = null; // The {row: YY, col: XX} where dragging started.
    var draggingPiece = null;
    var draggingPieceAvailableMoves = null;
    var nextZIndex = 61;
    
	function sendComputerMove() {
		
		$scope.style = [[{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
	 			[{},{},{},{},{},{},{},{}]];
		//add animate;
		var move = gameLogic.createComputerMove($scope.board, $scope.turnIndex);
		var brow = move[2].set.value.brow;
		var bcol = move[2].set.value.bcol;
		var arow = move[2].set.value.arow;
		var acol = move[2].set.value.acol;
		$scope.style[brow][bcol] = getStyle(brow, bcol, arow, acol);
		$timeout(function(){
			gameService.makeMove(move);
		}, 500);
	    //gameService.makeMove(move);
	}
	     window.handleDragEvent = handleDragEvent;
      function handleDragEvent(type, clientX, clientY) {
        // Center point in gameArea
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        var row, col;
        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
          draggingLines.style.display = "none";
          if (draggingPiece) {
            // Drag the piece where the touch is (without snapping to a square).
            var size = getSquareWidthHeight();
            setDraggingPieceTopLeft({top: y - size.height / 2, left: x - size.width / 2});
          } else {
            return;
          }
        } else {
          // Inside gameArea. Let's find the containing square's row and col
          var col = Math.floor(colsNum * x / gameArea.clientWidth);
          var row = Math.floor(rowsNum * y / gameArea.clientHeight);
          if (type === "touchstart" && !draggingStartedRowCol) {
            // drag started
            if ($scope.board[row][col]) {
              $scope.onStartCallback(row,col);
              draggingStartedRowCol = {row: row, col: col};
              draggingPiece = document.getElementById("MyPiece" + draggingStartedRowCol.row + "x" + draggingStartedRowCol.col);
              draggingPiece.style['z-index'] = ++nextZIndex;
            }
          }
          if (!draggingPiece) {
            return;
          }
          if (type === "touchend") {
            var from = draggingStartedRowCol;
            var to = {row: row, col: col};
            dragDone(from, to);
          } else {
            // Drag continue
            setDraggingPieceTopLeft(getSquareTopLeft(row, col));
            draggingLines.style.display = "inline";
            var centerXY = getSquareCenterXY(row, col);
            verticalDraggingLine.setAttribute("x1", centerXY.x);
            verticalDraggingLine.setAttribute("x2", centerXY.x);
            horizontalDraggingLine.setAttribute("y1", centerXY.y);
            horizontalDraggingLine.setAttribute("y2", centerXY.y);
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
      function setDraggingPieceTopLeft(topLeft) {
        var originalSize = getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col);
        draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
      }
      function getSquareWidthHeight() {
        return {
          width: gameArea.clientWidth / colsNum,
          height: gameArea.clientHeight / rowsNum
        };
      }
      function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return {top: row * size.height, left: col * size.width}
      }
      function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
          x: col * size.width + size.width / 2,
          y: row * size.height + size.height / 2
        };
      }
      
      function dragDone(from, to) {
        $rootScope.$apply(function () {
          var msg = "Dragged piece " + from.row + "x" + from.col + " to square " + to.row + "x" + to.col;
          $log.info(msg);
          $scope.msg = msg;
          // Update piece in board
          $scope.onDropCallback(to.row, to.col)
        });
      }
      function isWhiteSquare(row, col) {
        return ((row+col)%2)==0;
      }
      function getIntegersTill(number) {
        var res = [];
        for (var i = 0; i < number; i++) {
          res.push(i);
        }
        return res;
      }
      function getInitialBoard() {
        var board = [];
        for (var row = 0; row < rowsNum; row++) {
          board[row] = [];
          for (var col = 0; col < colsNum; col++) {
            board[row][col] = (row == 0 || row == 13) && !isWhiteSquare(row,col) ? "O" : null;
          }
        }
        return board;
      }
    function updateUI(params) {
      //alert("hello");
      //$scope.params = params;
      $scope.board = params.stateAfterMove.board;
      $scope.delta = params.stateAfterMove.delta;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
        $scope.style = [[{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
		                [{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
				[{},{},{},{},{},{},{},{}],
	 			[{},{},{},{},{},{},{},{}]];
      }
      else{
    	  moveAudio.play();
      }
      
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;
      
      // Is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        $timeout(sendComputerMove, 750);
      }
    }
    /*
    function updateDroppable(row, col) {
    	$scope.droppable = [[true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true],
                            [true,true,true,true,true,true,true,true]
                            ];
    	var possibleMoves = gameLogic.getPossibleMoves($scope.board, row, col, $scope.turnIndex);
    	for (var i=0; i<possibleMoves.length; i++){
    		var r = possibleMoves[i][0];
    		var c = possibleMoves[i][1];
    		$scope.droppable[r][c] = true;
    	}
    }*/
              
              
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    
    /*
    $scope.droppable = [[false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false],
                        [false,false,false,false,false,false,false,false]
                        ];
    
    $scope.firstClicked = false;
    $scope.brow = -1;
    $scope.bcol = -1;
    $scope.isDragging = false;
    $scope.cellClicked = function (row, col) {
        $log.info(["Clicked on cell:", row, col]);
        if (!$scope.isYourTurn) {
          return;
        }
        if($scope.board[row][col] !== ''){
        	$scope.firstClicked = true;
        	$scope.brow = row;
        	$scope.bcol = col;
        	//update droppable;
        	updateDroppable(row, col);
        	return;
        }
        
        try { 
          var move = gameLogic.createMove($scope.board, $scope.brow, $scope.bcol, row, col, $scope.turnIndex);
          //test if the move is OK.
          var test = gameLogic.isMoveOk({turnIndexBeforeMove: $scope.turnIndex,
	                                stateBeforeMove: {board: $scope.board,
   	                                                  delta: {brow: $scope.brow, bcol: $scope.bcol, arow: row, acol: col}},
                                    move: move});
          if(!test){
        	  $scope.firstClicked = false;
        	  //updateUI($scope.params);
        	  return;
          }
          
          $scope.isYourTurn = false; // to prevent making another move
          $scope.firstClicked = false;
          // TODO: show animations and only then send makeMove.
          //$log.info("before makeMove()");
          if($scope.isDragging === false){
        	  $scope.style = [[{},{},{},{},{},{},{},{}],
            	                [{},{},{},{},{},{},{},{}],
            	                [{},{},{},{},{},{},{},{}],
            	                [{},{},{},{},{},{},{},{}],
            	                [{},{},{},{},{},{},{},{}],
            					[{},{},{},{},{},{},{},{}],
            					[{},{},{},{},{},{},{},{}],
            		 			[{},{},{},{},{},{},{},{}]];
        		  var brow = move[2].set.value.brow;
        		  var bcol = move[2].set.value.bcol;
        		  var arow = move[2].set.value.arow;
        		  var acol = move[2].set.value.acol;
        		  var style = getStyle(brow, bcol, arow, acol);
        		  $scope.style[brow][bcol] = style;
        		  //$log.info("style: ", style);
        		  $timeout(function(){
      			  gameService.makeMove(move);
      		  }, 500);
          }
          else gameService.makeMove(move);
          $scope.isDragging = false;
        } catch (e) {
          $log.info(["Cell is already full in position:", row, col]);
          return;
        }
    };
    */
     
    $scope.onStartCallback = function(r, c){
    	//var r = arguments[2];
    	//var c = arguments[3];
    	$log.info("drag start on cell: ", r,c);
    	//$scope.cellClicked(r,c);
        $scope.brow = r;
	    $scope.bcol = c;
    	return;
    };
    
     
    $scope.onDropCallback = function(row, col){
    	//var r = arguments[2];
    	//var c = arguments[3];
    	$log.info("drop on cell: ", row, col);
        $log.info("brow, bcol: ", $scope.brow, $scope.bcol);
    	$scope.isDragging = true;
    	//$scope.cellClicked(r, c);
    	try { 
            var move = gameLogic.createMove($scope.board, $scope.brow, $scope.bcol, row, col, $scope.turnIndex);
            //test if the move is OK.
            var test = gameLogic.isMoveOk({turnIndexBeforeMove: $scope.turnIndex,
  	                                stateBeforeMove: {board: $scope.board,
     	                                                  delta: {brow: $scope.brow, bcol: $scope.bcol, arow: row, acol: col}},
                                      move: move});
            if(!test){
          	  //$scope.firstClicked = false;
          	  //updateUI($scope.params);
          	  return;
            }
            
            $scope.isYourTurn = false; // to prevent making another move
            //$scope.firstClicked = false;
            // TODO: show animations and only then send makeMove.
            //$log.info("before makeMove()");
            if($scope.isDragging === false){
          	  $scope.style = [[{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              	                [{},{},{},{},{},{},{},{}],
              					[{},{},{},{},{},{},{},{}],
              					[{},{},{},{},{},{},{},{}],
              		 			[{},{},{},{},{},{},{},{}]];
          		  var brow = move[2].set.value.brow;
          		  var bcol = move[2].set.value.bcol;
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
            $scope.isDragging = false;
          } catch (e) {
            $log.info(["Cell is already full in position:", row, col]);
            return;
          }      
              
              
              
    	return;
    };
    
    $scope.isEven = function(row, col){
    	var t = row + col;
    	return t%2 === 0;
    }
    $scope.isOdd = function(row, col){
    	var t = row + col;
    	return t%2 === 1;
    }
    
    $scope.isSelected = function(row, col){
    	return $scope.brow === row && $scope.bcol === col;
    }
    
    $scope.isRed = function(row, col){
    	return $board[row][col] === 'R';
    }
    
    $scope.isWhite = function(row, col){
    	return $board[row][col] === 'W';
    }
    
    function getStyle (brow, bcol, arow, acol) {
        var left = (acol - bcol) * 100 + "px";
        var top = (arow - brow) * 100 + "px";
        return {top: top, left: left, position: "relative",
                "-webkit-animation": "moveAnimation 0.5s",
                "animation": "moveAnimation 0.5s"};
    }
    
    gameService.setGame({
        gameDeveloperEmail: "xuxiaoyu89@gmail.com",
        minNumberOfPlayers: 2,
        maxNumberOfPlayers: 2,
        exampleGame: gameLogic.getExampleGame(),
        riddles: gameLogic.getRiddles(),
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
      });
  }]);
