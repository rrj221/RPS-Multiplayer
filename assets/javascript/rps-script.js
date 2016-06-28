// console.log('hello');

// $('h1').on('click', function () {
// 	alert('jquery!');
// });

var choicesArray = ['Rock', 'Paper', 'Scissors'];
//SET THIS TO ONE FOR DEBUGGING - SET TO 0 LATER!!!!!!!!!!!///////////////////////////////////////
//*************************
var currentPlayer = 0;
//*************************
var canUpdateBox = true;
  
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
		dbRef.child('players').update({
			2: {
				losses: 0,
				name: name,
				wins: 0,
			},
			turn: 1
		});
		currentPlayer = 2;
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
	displayWinsLosses(2, p1Wins, p1Losses);
	var player2Name = Snapshot.val().players[2].name;
	displayName(2, player2Name);

	//turn one
	if (Snapshot.val().players.turn === 1) {
		if (currentPlayer === 1) {
			showChoices(1, choicesArray);
		}
	}

	//turn two
	if (Snapshot.val().players.turn === 2) {
		if (currentPlayer === 2 && canUpdateBox) {
			showChoices(2, choicesArray);
			canUpdateBox = false;
		}
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
	var choiceClicked = $(this).data('choice'); //ie 'rock', 'paper'
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





	incrementTurn();
	addChoiceToFirebase(1, choiceClicked);


	// if (currentTurn === 1) {

	// }


});

function incrementTurn() {
	dbRef.once('value', function (snapshot) {
		var currentTurn = snapshot.val().players.turn;
		dbRef.child('players').update({
			turn: currentTurn + 1
		});
	});
};

function getTurn() {
	var currentTurn;
	dbRef.once('value', function (snapshot) {
		currentTurn = snapshot.val().players.turn;
		// return 1;
	});
	return currentTurn;
};

function addChoiceToFirebase(playerNumber, choice) {
	dbRef.child('players').child(1).update({
		choice: choice
	});
};
