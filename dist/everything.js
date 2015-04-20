'use strict';

angular.module('myApp').service('gameLogic', function() {
	
	function isEqual(object1, object2){
		return angular.equals(object1, object2);
    }
    function copyObject(object){
    	return angular.copy(object);
    }
    function isWinner(r, c, board){
    	var visited = new Array(8);
    	for(var i=0; i<8; i++){
    		visited[i] = new Array(false, false, false, false, false, false, false, false);
    	}
    	var id = board[r][c];
    	visited[r][c] = true;
    	//console.log(id);
    	var count = 1;
    	var stack = new Array();
    	stack.push([r,c]);
    	while(stack.length !== 0){
    		var curr = stack.pop();
    		//console.log(curr);
    		var row = curr[0];
    		var col = curr[1];
    		
    		if(row+1<8 && col+1<8){
    			if(visited[row+1][col+1] === false){
    				if(board[row+1][col+1] === id){
    					//console.log(1);
        				stack.push([row+1, col+1]);
        				count++;
        				visited[row+1][col+1] = true;
        			}	
    			}
    		}
    		
    		if(row-1>=0 && col-1>=0){
    			if(visited[row-1][col-1] === false){
    				if(board[row-1][col-1] === id){
    					//console.log(1);
        				stack.push([row-1, col-1]);
        				count++;
        				visited[row-1][col-1] = true;
        			}	
    			}
    		}
    		
    		if(row+1<8 && col-1>=0){
    			if(visited[row+1][col-1] === false){
    				if(board[row+1][col-1] === id){
    					//console.log(3);
        				stack.push([row+1, col-1]);
        				count++;
        				visited[row+1][col-1] = true;
        			}	
    			}
    		}
    		if(row-1>=0 && col+1<8){
    			if(visited[row-1][col+1] === false){
    				if(board[row-1][col+1] === id){
    					//console.log(4);
        				stack.push([row-1, col+1]);
        				count++;
        				visited[row-1][col+1] = true;
        			}	
    			}
    		}
    		if(row+1<8){
    			if(visited[row+1][col] === false){
    				if(board[row+1][col] === id){
    					//console.log(5);
        				stack.push([row+1, col]);
        				count++;
        				visited[row+1][col] = true;
        			}	
    			}
    		}
    		if(row-1>=0){
    			if(visited[row-1][col] === false){
    				if(board[row-1][col] === id){
    					//console.log(6);
        				stack.push([row-1, col]);
        				count++;
        				visited[row-1][col] = true;
        			}	
    			}
    		}
    		if(col+1<8){
    			if(visited[row][col+1] === false){
    				if(board[row][col+1] === id){
    					//console.log(7);
        				stack.push([row, col+1]);
        				count++;
        				visited[row][col+1] = true;
        			}	
    			}
    		}
    		if(col-1>=0){
    			if(visited[row][col-1] === false){
    				if(board[row][col-1] === id){
    					//console.log(8);
        				stack.push([row, col-1]);
        				count++;
        				visited[row][col-1] = true;
        			}	
    			}
    		}
    	}
    	//console.log("count: " + count);
    	if(count === 12) return true;
    	else return false;
    }
    
    function getWinner(board){
    	var wrow = -1, wcol = -1;
    	var rrow = -1, rcol = -1;
        for(var i=0; i<8; i++){
        	for(var j=0; j<8; j++){
        		if(wrow>=0 && wcol>=0 && rrow>=0 && rcol>=0){
        			break;
        		}
        		if(board[i][j] === 'W'){
        			wrow = i;
        			wcol = j;
        		}
        		else if(board[i][j] === 'R'){
        			rrow = i;
        			rcol = j;
        		}
        	}
        }
        if(isWinner(wrow, wcol, board)) return 'W';
        if(isWinner(rrow, rcol, board)) return 'R';
        return '';   
    }
    
    function getStartRC(row, col, slope){
    	if(slope == 0){
    		return [row, 0];
    	}
    	if(slope  == 2){
    		return [0, col];
    	}
    	if(slope == 1){
    		if(row >= col){
    			return [row-col, 0];
    		}
    		else{
    			return [0, col-row];
    		}
    	}
    	if(slope == -1){
    		if((row+col)>=7){
                return [7, row+col-7];
            }
            else{
                return [row+col, 0];
            }
    	}
    }
    
    function createComputerMove(board, turnIndexBeforeMove){
    	var possibleMoves = [];
    	var i, j;
    	var slope;
    	var startRC;
    	var checkNum;
    	var move;
    	var friend = turnIndexBeforeMove === 0 ? 'W' : 'R';
    	for(i=0; i<8; i++){
    		for(j=0; j<8; j++){
    			if(board[i][j] === friend){
    	            //slope == 1;			
    				startRC = getStartRC(i, j, 1);
    				checkNum = getCheckNum(board, startRC[0], startRC[1], 1);
    				if(isMoveLegal(board, i, j, i+checkNum, j+checkNum, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i+checkNum, j+checkNum, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				if(isMoveLegal(board, i, j, i-checkNum, j-checkNum, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i-checkNum, j-checkNum, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				//slope == -1;
    				startRC = getStartRC(i, j, -1);
    				checkNum = getCheckNum(board, startRC[0], startRC[1], -1);
    				if(isMoveLegal(board, i, j, i+checkNum, j-checkNum, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i+checkNum, j-checkNum, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				if(isMoveLegal(board, i, j, i-checkNum, j+checkNum, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i-checkNum, j+checkNum, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				//slope == 0;
    				startRC = getStartRC(i, j, 0);
    				checkNum = getCheckNum(board, startRC[0], startRC[1], 0);
    				if(isMoveLegal(board, i, j, i, j-checkNum, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i, j-checkNum, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				if(isMoveLegal(board, i, j, i, j+checkNum, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i, j+checkNum, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				//slope == 2;
    				startRC = getStartRC(i, j, 2);
    				checkNum = getCheckNum(board, startRC[0], startRC[1], 2);
    				if(isMoveLegal(board, i, j, i-checkNum, j, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i-checkNum, j, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    				if(isMoveLegal(board, i, j, i+checkNum, j, turnIndexBeforeMove)){
    					move = createMove(board, i, j, i+checkNum, j, turnIndexBeforeMove);
    					possibleMoves.push(move);
    				}
    			}
    		}
    	}
    	var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return randomMove;	
    }
     
    function getPossibleMoves(board, row, col, turnIndexBeforeMove){
        var possibleMoves = [];
        //slope == 1;			
		var startRC = getStartRC(row, col, 1);
		var checkNum = getCheckNum(board, startRC[0], startRC[1], 1);
		if(isMoveLegal(board, row, col, row+checkNum, col+checkNum, turnIndexBeforeMove)){
			possibleMoves.push([row+checkNum, col+checkNum]);
		}
		if(isMoveLegal(board, row, col, row-checkNum, col-checkNum, turnIndexBeforeMove)){
			possibleMoves.push([row-checkNum, col-checkNum]);
		}
		//slope == -1;
		startRC = getStartRC(row, col, -1);
		checkNum = getCheckNum(board, startRC[0], startRC[1], -1);
		if(isMoveLegal(board, row, col, row-checkNum, col+checkNum, turnIndexBeforeMove)){
			possibleMoves.push([row-checkNum, col+checkNum]);
		}
		if(isMoveLegal(board, row, col, row+checkNum, col-checkNum, turnIndexBeforeMove)){
			possibleMoves.push([row+checkNum, col-checkNum]);
		}
		//slope == 0;
		startRC = getStartRC(row, col, 0);
		checkNum = getCheckNum(board, startRC[0], startRC[1], 0);
		if(isMoveLegal(board, row, col, row, col+checkNum, turnIndexBeforeMove)){
			possibleMoves.push([row, col+checkNum]);
		}
		if(isMoveLegal(board, row, col, row, col-checkNum, turnIndexBeforeMove)){
			possibleMoves.push([row, col-checkNum]);
		}
		//slope == 2;
		startRC = getStartRC(row, col, 2);
		checkNum = getCheckNum(board, startRC[0], startRC[1], 2);
		if(isMoveLegal(board, row, col, row+checkNum, col, turnIndexBeforeMove)){
			possibleMoves.push([row+checkNum, col]);
		}
		if(isMoveLegal(board, row, col, row-checkNum, col, turnIndexBeforeMove)){
			possibleMoves.push([row-checkNum, col]);
		}
		return possibleMoves;
    }

    function createMove(board, brow, bcol, arow, acol, turnIndexBeforeMove){
    	var boardAfterMove = copyObject(board);
        boardAfterMove[arow][acol] = turnIndexBeforeMove === 0 ? 'W' : 'R';
        boardAfterMove[brow][bcol] = '';
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '') {
          // Game over.
          firstOperation = {endMatch: {endMatchScores: 
            (winner === 'W' ? [1, 0] : [0, 1])}};
        } else {
          // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
          firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
        }
        return [firstOperation,
                {set: {key: 'board', value: boardAfterMove}},
                {set: {key: 'delta', value: {brow: brow, bcol: bcol, arow: arow, acol: acol}}}
               ];
    }

    //get check num in that line;
    function getCheckNum(board, startR, startC, slope){
        var checkNum = 0;
        if(slope === 0){
            for(var i=0; i<8; i++){
                if(board[startR][startC+i] !== '') {checkNum++;}
            }
        }
        else if(slope === 2){
            for(var i=0; i<8; i++){
                if(board[startR+i][startC] !== '') {checkNum++;}
            }
        }
        else if(slope === 1){
            while(startR !== 8 && startC !== 8){
            	if(board[startR][startC] !== '') {checkNum++;}
            	startR++;
            	startC++;
            }
        }
        else{
        	while(startR !== -1 && startC !== 8){
        		if(board[startR][startC] !== '') {checkNum++;}
            	startR--;
            	startC++;
        	}
        }
        return checkNum;
    }
    
    
    function isMoveLegal(board, brow, bcol, arow, acol, turnIndexBeforeMove) {
    	if(arow > 7 || arow < 0 || acol > 7 || acol < 0){
    		return false;
    	}
    	
        if (board[arow][acol] !== '') {
            return false;
        }
        var enemy = turnIndexBeforeMove === 0 ? 'R' : 'W';
        if(board[brow][bcol] === enemy) {return false;}
        if(Math.abs(brow-arow) !== Math.abs(bcol-acol) && brow !== arow && bcol !== acol) {return false;}
        var distance;
        var startR;
        var startC;
        var slope;
        if ((brow-arow) === 0) {
            distance = Math.abs(bcol-acol);
            startR = brow;
            startC = 0;
            slope = 0;
        }
        else if ((bcol-acol) === 0) {
            distance = Math.abs(brow-arow);
            startR = 0;
            startC = bcol;
            slope = 2;    //infinity;
        }
        else {
            distance = Math.abs(brow-arow);
            slope = (brow-arow)/(bcol-acol);
            if(slope>0){
                if(brow >= bcol){
                    startR = brow-bcol;
                    startC = 0;
                }
                else{
                    startR = 0;
                    startC = bcol-brow;
                }
            }
            else {
                if((brow+bcol)>=7){
                    startR = 7;
                    startC = brow+bcol-7;
                }
                else{
                    startR = brow+bcol;
                    startC = 0;
                }
            }
        }
        //console.log("startR: " + startR + "startC: " + startC);
        var num = getCheckNum(board, startR, startC, slope);
        //console.log("checkNum: " + num);
        if(distance !== num){
            return false;
        }   
        //check if there are enemies in the way;     
        var moveR = (arow-brow)/distance;
        var moveC = (acol-bcol)/distance;
        var cursorR = brow;
        var cursorC = bcol;
        while(cursorR!==arow || cursorC!==acol){
            cursorR += moveR;
            cursorC += moveC;
            if(board[cursorR][cursorC] === enemy){
                return false;
            }
        }   
        return true;
    }
    
    function getExampleMoves(initialTurnIndex, initialState, arrayOfRowColComment) {
        var exampleMoves = [];
        var state = initialState;
        var turnIndex = initialTurnIndex;
        for (var i = 0; i < arrayOfRowColComment.length; i++) {
          var rowColComment = arrayOfRowColComment[i];
          if(state.board == undefined){
        	  state.board = [['', 'R', 'R', 'R', 'R', 'R', 'R', ''],
            	             ['W', '', '', '', '', '', '', 'W'],
            	             ['W', '', '', '', '', '', '', 'W'],
            	             ['W', '', '', '', '', '', '', 'W'], 
            	             ['W', '', '', '', '', '', '', 'W'],
            	             ['W', '', '', '', '', '', '', 'W'], 
            	             ['W', '', '', '', '', '', '', 'W'], 
            	             ['', 'R', 'R', 'R', 'R', 'R', 'R', '']];
          }
          var move = createMove(state.board, rowColComment.brow, rowColComment.bcol, rowColComment.arow, rowColComment.acol, turnIndex);
          var stateAfterMove = {board : move[1].set.value, delta: move[2].set.value};
          
          exampleMoves.push({
            stateBeforeMove: state,
            stateAfterMove: stateAfterMove,
            turnIndexBeforeMove: turnIndex,
            turnIndexAfterMove: 1 - turnIndex,
            move: move,
            comment: {en: rowColComment.comment}});
            
          state = stateAfterMove;
          turnIndex = 1 - turnIndex;
        }
        return exampleMoves;
    }
    
    function getInitialBoard(){
    	return [['', 'R', 'R', 'R', 'R', 'R', 'R', ''],
  	             ['W', '', '', '', '', '', '', 'W'],
	             ['W', '', '', '', '', '', '', 'W'],
	             ['W', '', '', '', '', '', '', 'W'], 
	             ['W', '', '', '', '', '', '', 'W'],
	             ['W', '', '', '', '', '', '', 'W'], 
	             ['W', '', '', '', '', '', '', 'W'], 
	             ['', 'R', 'R', 'R', 'R', 'R', 'R', '']];
    }
    
    function getRiddles() {
    	return [getExampleMoves(1, {board:
            [['W', '', '', '', 'R', '', '', ''],
             ['W', 'W', 'W', '', '', '', '', ''],
             ['W', 'R', 'W', 'R', '', '', '', ''],
             ['W', '', 'R', '', '', '', '', 'R'], 
             ['W', '', '', 'R', '', 'W', '', ''],
             ['W', '', 'W', '', '', '', '', ''], 
             ['', '', 'W', 'R', '', '', '', ''], 
             ['', 'R', 'R', 'R', 'R', 'R', '', '']], 
             delta: {brow: 0, bcol: 0, arow: 0, acol: 0}}, 
             [
          {brow: 0, bcol: 4, arow: 2, acol: 4, comment: "find the position for red where he could win the game"},
          {brow: 4, bcol: 5, arow: 2, acol: 5, comment: "white moves (4,5) to (2,5)"},
          {brow: 7, bcol: 5, arow: 5, acol: 3, comment: "red moves (7,5) to (5,3)"},
          {brow: 2, bcol: 5, arow: 1, acol: 4, comment: "white moves (2,5) to (1,4)"},
          {brow: 3, bcol: 7, arow: 3, acol: 4, comment: "red moves (3,7) to (3,4), red wins"}
        ])
    	]
      }
    

    function getExampleGame() {
        return getExampleMoves(0, {}, 
             [
          {brow: 1, bcol: 0, arow: 1, acol: 2, comment: "The classic opening: white moves (1,0) to (1,2)"},
          {brow: 0, bcol: 3, arow: 2, acol: 3, comment: "red moves (0,2) to (2,3)"},
          {brow: 1, bcol: 2, arow: 4, acol: 2, comment: "white moves (1,2) to (4,2)"},
          {brow: 0, bcol: 1, arow: 3, acol: 4, comment: "red moves (0,1) to (3,4)"},
          {brow: 6, bcol: 0, arow: 6, acol: 2, comment: "white moves (6,0) to (6,2)"},
          {brow: 0, bcol: 5, arow: 3, acol: 2, comment: "red moves (0,5) to (3,2)"},
          {brow: 5, bcol: 0, arow: 5, acol: 2, comment: "white moves (5,0) to (5,2)"},
          {brow: 0, bcol: 2, arow: 2, acol: 4, comment: "red moves (0,2) to (2,4)"},
          {brow: 6, bcol: 7, arow: 6, acol: 5, comment: "white moves (6,7) to (6,5)"},
          {brow: 0, bcol: 4, arow: 2, acol: 6, comment: "red moves (0,4) to (2,6)"},
          {brow: 5, bcol: 7, arow: 0, acol: 7, comment: "white moves (5,7) to (0,7)"},
          {brow: 0, bcol: 6, arow: 3, acol: 6, comment: "red moves (0,6) to (3,6)"},
          {brow: 0, bcol: 7, arow: 0, acol: 6, comment: "white moves (0,7) to (0,6)"},
          {brow: 3, bcol: 6, arow: 6, acol: 3, comment: "red moves (3,6) to (6,3)"},
          {brow: 6, bcol: 5, arow: 4, acol: 5, comment: "white moves (6,5) to (4,5)"},
          {brow: 2, bcol: 6, arow: 2, acol: 1, comment: "red moves (2,6) to (2,1)"},
          {brow: 4, bcol: 7, arow: 3, acol: 6, comment: "white moves (4,7) to (3,6)"},
          {brow: 7, bcol: 6, arow: 4, acol: 3, comment: "red moves (7,6) to (4,3)"},
          {brow: 2, bcol: 0, arow: 5, acol: 0, comment: "white moves (2,0) to (5,0)"},
          {brow: 7, bcol: 5, arow: 5, acol: 3, comment: "red moves (7,5) to (5,3), red wins!"}
        ]);
      }
  
    //params: {turnIndexBeforeMove: 0,
    //         stateBeforeMove: {},
    //         move: []
    function isMoveOk(params){
    	//alert("test");
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;        
        try{
            var brow = move[2].set.value.brow;
            var bcol = move[2].set.value.bcol;
            var arow = move[2].set.value.arow;
            var acol = move[2].set.value.acol;
            var board = stateBeforeMove.board;
            if(board === undefined){
            	board = [['', 'R', 'R', 'R', 'R', 'R', 'R', ''],
        	             ['W', '', '', '', '', '', '', 'W'],
        	             ['W', '', '', '', '', '', '', 'W'],
        	             ['W', '', '', '', '', '', '', 'W'], 
        	             ['W', '', '', '', '', '', '', 'W'],
        	             ['W', '', '', '', '', '', '', 'W'], 
        	             ['W', '', '', '', '', '', '', 'W'], 
        	             ['', 'R', 'R', 'R', 'R', 'R', 'R', '']];
            }
            
            //test if a player can make a move in this position;
            if(!isMoveLegal(board, brow, bcol, arow, acol, turnIndexBeforeMove)){
                return false;
            }
            var expectedMove = createMove(board, brow, bcol, arow, acol, turnIndexBeforeMove);
            if(!isEqual(move, expectedMove)){
                return false;
            } 
        }catch(e){
            return false; 
        }
        return true;
    }
    this.getPossibleMoves = getPossibleMoves;
    this.createComputerMove = createComputerMove;
    this.createMove = createMove;
    this.getInitialBoard = getInitialBoard;
    this.isMoveOk = isMoveOk;
    this.getExampleGame = getExampleGame;
    this.getRiddles = getRiddles;
});




;'use strict';

angular.module('myApp', ['ngDraggable', 'ngTouch'])
  .controller('Ctrl',['$window', '$rootScope','$scope', '$log', '$timeout',
      'gameService', 'gameLogic','resizeGameAreaService',
       function (
      $window, $rootScope,$scope, $log, $timeout,
      gameService, gameLogic,resizeGameAreaService) {
     'use strict';
	
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
      $scope.shouldSlowlyAppear = function (row, col) {
      return $scope.delta !== undefined &&
          $scope.delta.row === row && $scope.delta.col === col;
    };
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
