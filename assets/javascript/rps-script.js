// console.log('hello');

// $('h1').on('click', function () {
// 	alert('jquery!');
// });



var choicesArray = ['Rock', 'Paper', 'Scissors'];

var currentPlayer = 0;

var canUpdateBoxP1 = true;
// var canUpdateP1Choice = false;
var canUpdateBoxP2 = true;
  
var config = {
    apiKey: "AIzaSyAUfn3q5rPIf_V9-dSRu30GntbrF_LzPWE",
    authDomain: "rps-project-ffb5a.firebaseapp.com",
    databaseURL: "https://rps-project-ffb5a.firebaseio.com",
    storageBucket: "rps-project-ffb5a.appspot.com",
	};
	firebase.initializeApp(config);

// Create a variable to reference the database.
var dbRef = firebase.database().ref()




//initialize players object in firebase
// dbRef.set({
// 	players: {
// 		1: {
// 			losses: 0,
// 			name: '',
// 			wins: 0,
// 		},
// 		2: {
// 			losses: 0,
// 			name: '',
// 			wins: 0,
// 		},
// 	}	
// });

//this is important if i use the method above
// console.log(dbRef.child('players').child('1'));

// function playerUpdateFirebase(playerNumber, playerName) {
// 	dbRef.child('players').child(playerNumber).update({
// 		name: playerName
// 	});
// };

// function displayNameInBox(playerNumber, playerName) {
// 	var ID = "#p"+playerNumber+"Header";
// 	$(ID).text(playerName);
// };

function displayWinsLosses(playerNumber, Wins, Losses) {
	var ID = "#p"+playerNumber+"WinsLosses";
	$(ID).text("Wins: "+Wins+", Losses: "+Losses);
};

// function showWinsLosses(playerNumber) {
// 	var ID = "#p"+playerNumber+"WinsLosses";
// 	$(ID).show();
// };

// function hideWaitingText (playerNumber) {
// 	var ID = "#p"+playerNumber+"Waiting";
// 	$(ID).hide();
// };

function displayName (playerNumber, playerName) {
	var ID = "#p"+playerNumber+"Name";
	$(ID).text(playerName);
};

//hide wins/losses before login
// $("#p1WinsLosses").hide();
// $("#p2WinsLosses").hide();

function login(name, playerNumber) {
	$('.usernameForm').hide();
	var playerMessageDiv = $('<div>', {
		class: 'userMessage1',
		text: "Hi "+name+"! You are Player "+playerNumber
	});
	playerMessageDiv.appendTo($('.topPart'));

	// playerUpdateFirebase(playerNumber, name);
	// hideWaitingText(playerNumber);
	// showWinsLosses(playerNumber);

	if (playerNumber === 1) {
		// alert('okay');
		//initialize players object in firebase
		dbRef.set({
			players: {
				1: {
					losses: 0,
					name: name,
					wins: 0,
				}
			}		
		});
		currentPlayer = 1;
	} 
	else if (playerNumber === 2) {
		// alert('yay');
		currentPlayer = 2;
		dbRef.child('players').update({
			2: {
				losses: 0,
				name: name,
				wins: 0,
			},
			turn: 1
		});
		// currentPlayer = 2;
	}	
};

// function loginPlayerTwo(name, playerNumber) {
// 	$('.usernameForm').hide();
// 	var playerMessageDiv = $('<div>', {
// 		text: "Hi "+name+"! You are Player "+playerNumber
// 	});
// 	playerMessageDiv.appendTo($('.topPart'));

// 	playerUpdateFirebase(playerNumber, name);
// 	hideWaitingText(playerNumber);
// 	showWinsLosses(playerNumber);
// }




$('.usernameForm').on('submit', function () {
	var name = $('#nameInput').val();
	var player1NameFirebase = '';
	var player2NameFirebase = '';
	dbRef.once('value', function (Snapshot) {
		player1NameFirebase = Snapshot.val().players[1].name
		player2NameFirebase = Snapshot.val().players[2].name
	})
	if (!player1NameFirebase) {
		login(name, 1);
	} else if (!player2NameFirebase) {
		login(name, 2);
		// hideWaitingText(1);
		// showWinsLosses(1);
	}

	//turn one
	// if (currentPlayer === 1) {
	// 	showChoices(1, choicesArray);
	// }

	return false;
});

dbRef.on('value', function (Snapshot) {
	console.log(Snapshot.val());
	console.log(Snapshot.val().players);
	console.log(Snapshot.val().players[1].name);

	//updates wins and losses and name for player1 
	console.log(Snapshot.val().players[1].wins);
	var p1Wins = Snapshot.val().players[1].wins;
	var p1Losses = Snapshot.val().players[1].losses;
	displayWinsLosses(1, p1Wins, p1Losses);
	var player1name = Snapshot.val().players[1].name;
	console.log(player1name);
	displayName(1, player1name);

	//updates name when it changes
	var p2Wins = Snapshot.val().players[2].wins;
	var p2Losses = Snapshot.val().players[2].losses;
	displayWinsLosses(2, p2Wins, p2Losses);
	var player2Name = Snapshot.val().players[2].name;
	displayName(2, player2Name);

	//turn one
	if (currentPlayer === 2) {
		// alert('wtfssss');
		displayWaitingFor(1);
	}

	if (Snapshot.val().players.turn === 1) {
		if (currentPlayer === 1 && canUpdateBoxP1) {
			showChoices(1, choicesArray);
			canUpdateBoxP1 = false;

			displayItsYourTurn();
		}


	}

	//turn two
	else if (Snapshot.val().players.turn === 2) {
		$(".userMessage2").remove();
		if (currentPlayer === 2 && canUpdateBoxP2) {
			showChoices(2, choicesArray);
			canUpdateBoxP2 = false;

			displayItsYourTurn();
		}

		if (currentPlayer === 1) {
			displayWaitingFor(2);
		}
	}

	//turn three
	else if (Snapshot.val().players.turn === 3) {
		if (currentPlayer === 2) {
			displayChoice(1);
			displayChoice(2);
		} else if (currentPlayer === 1) {
			displayChoice(2);
		}
		gamePlay(getChoice(1), getChoice(2));
		$('.userMessage2').remove();
		
		setTimeout(function () {
			canUpdateBoxP1 = true;
			$('#winnerDiv').empty();
			$('.choiceClickedDiv').remove();
			canUpdateBoxP2 = true;
			if (currentPlayer === 1) {
				incrementTurn();
			}

			// if (turn === 0) {
			// 	alert('yayaya');
			// 	// incrementTurn();
			// 	canUpdateBoxP1 = true;
			// }
		}, 5 * 1000);
	}
});

function showChoices(playerNumber, choicesArray) { 
	var choicesDiv = $('<div>', {class: 'choicesDiv'});

	//create DOM elements and append to choicesDiv
	for (var i = 0; i < choicesArray.length; i++) {
		var choice = choicesArray[i];
		var choiceDiv = $('<div>', {
			class: 'choice',
			'data-choice': choice,
			text: choice
		});
		choicesDiv.append(choiceDiv);
	}
	//append choicesDiv to DOM
	var DivToAppendToID = "#player"+playerNumber+"Box";
	choicesDiv.appendTo(DivToAppendToID);
};

$('.box').on('click', '.choice', function () {
	console.log($(this).data('choice'));
	var choiceClicked = $(this).data('choice'); //ie 'Rock', 'Paper'
	var currentTurn = getTurn();



	//turn one
	// if (currentTurn === 1) {
	// 	if (currentPlayer === 1) {
	// 		showChoices(1, choicesArray);
	// 	}
	// }

	//turn two
	// if (currentPlayer === 2) {
	// 	showChoices(2, choicesArray);
	// }

	if (currentTurn === 1) {
		addChoiceToFirebase(1, choiceClicked);

		//display choice to DOM////////////////////////
		$('.choicesDiv').remove();  //removes player 1's choice
		displayChoice(1); // it's here because I only want to show to player one now
	}

	if (currentTurn === 2) {
		addChoiceToFirebase(2, choiceClicked);

		$('.choicesDiv').remove();  //removes player 2's choice
	}

	//I think I can take out this if statement but keep the increment
	//need to test to make sure if have time
	incrementTurn();


	// if (currentTurn === 1) {

	// }


});

function incrementTurn() {
	var currentTurn = getTurn();
	dbRef.child('players').update({
		turn: currentTurn + 1
	});
};

function resetTurn() {
	dbRef.child('players').update({
		turn: 0
	});
};

function getTurn() {
	var currentTurn;
	dbRef.once('value', function (snapshot) {
		currentTurn = snapshot.val().players.turn;
	});
	return currentTurn;
};

function addChoiceToFirebase(playerNumber, choice) {
	dbRef.child('players').child(playerNumber).update({
		choice: choice
	});
};

function getChoice(playerNumber) {
	var currentChoice;
	dbRef.once('value', function (snapshot) {
		currentChoice = snapshot.val().players[playerNumber].choice
	});
	return currentChoice;
};

//might need this later
function displayChoice(playerNumber) {
	var choice = getChoice(playerNumber);
	var BoxID = "#player"+playerNumber+"Box";

	$('<div>', {
		class: 'choiceClickedDiv',
		text: choice
	}).appendTo($(BoxID));
};


function gamePlay(p1Choice, p2Choice) {
	if ((p1Choice === "Rock" && p2Choice === "Scissors") ||
		(p1Choice === "Paper" && p2Choice === "Rock") ||
		(p1Choice === "Scissors" && p2Choice === "Paper")) {
			displayWinner(1);
			resetTurn();
			updateWins(1);
			updateLosses(2);
	} 
	else if ((p2Choice === "Rock" && p1Choice === "Scissors") ||
		    (p2Choice === "Paper" && p1Choice === "Rock") ||
		    (p2Choice === "Scissors" && p1Choice === "Paper")) {
				displayWinner(2);
				resetTurn();
				updateWins(2);
				updateLosses(1);
	}
	else if (p1Choice === p2Choice) {
		displayTie();
		resetTurn();
	}
};

function updateWins(winner) {
	dbRef.once('value', function (snapshot) {
		var currentWins = snapshot.val().players[winner].wins;
		dbRef.child('players').child(winner).update({
			wins: currentWins + 1
		});
	});
};

function updateLosses(loser) {
	dbRef.once('value', function (snapshot) {
		var currentLosses = snapshot.val().players[loser].losses;
		dbRef.child('players').child(loser).update({
			losses: currentLosses + 1
		});
	});
};

function getName(playerNumber) {
	var name;
	dbRef.once('value', function (snapshot) {
		name = snapshot.val().players[playerNumber].name;
	})
	return name;
};

function displayWinner(playerNumber) {
	var name = getName(playerNumber);
	$('<div>', {
		class: 'winner',
		text: name+" is the Winner!"
	}).appendTo($("#winnerDiv"));
};

function displayTie() {
	$('<div>', {
		class: 'winner',
		text: "Tie Game!"
	}).appendTo($("#winnerDiv"));
};

function displayItsYourTurn() {
	$('<div>', {
		class: 'userMessage2', 
		text: "It's your turn!" 
	}).appendTo($(".topPart"));
};

function displayWaitingFor(otherPlayerNumber) {
	$('<div>', {
		class: 'userMessage2', 
		text: "Waiting for "+getName(otherPlayerNumber)+" to choose" 
	}).appendTo($(".topPart"));
};
