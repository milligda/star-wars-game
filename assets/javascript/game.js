$(document).ready(function() {

    var userSide = ""; // assigned when the user selects a side at the beginning
    var computerSide = "";
    var userCharacter = "";
    var characterName = "";
    var characterAttack = 0;
    var characterCounterAttack = 0;
    var characterStrength = 0;
    var characterSide = "";
    var opponentCharacter = "";
    var opponentName = "";
    var opponentAttack = 0;
    var opponentCounterAttack = 0;
    var opponentStrength = 0;
    var empireCharacters = ["kylo_ren", "vader", "sidious"];
    var rebelCharacters = ["rey", "luke", "yoda"];
    var characterTile;
    var strikeMessage = "";
    var fightsWon = 0;

    var kylo_ren = {
        slug: "kylo_ren",
        name: "Kylo Ren",
        attack: 12,
        counterAttack: 25,
        strength: 150,
        side: "empire",
        playable: true,
        display: true,
        playAs: false,
        image: "assets/images/kylo_ren.png",
    };

    var vader = {
        slug: "vader",
        name: "Darth Vader",
        attack: 20,
        counterAttack: 35,
        strength: 180,
        side: "empire",
        playable: true,
        display: true,
        playAs: false,
        image: "assets/images/vader.png",
    };

    var sidious = {
        slug: "sidious",
        name: "Darth Sidious",
        attack: 40,
        counterAttack: 60,
        strength: 120,
        side: "empire",
        playable: true,
        display: true,
        playAs: false,
        image: "assets/images/sidious.png",
    };

    var rey = {
        slug: "rey",
        name: "Rey",
        attack: 10,
        counterAttack: 20,
        strength: 150,
        side: "rebels",
        playable: true,
        display: true,
        playAs: false,
        image: "assets/images/rey.png",
    };

    var luke = {
        slug: "luke",
        name: "Luke Skywalker",
        attack: 15,
        counterAttack: 30,
        strength: 200,
        side: "rebels",
        playable: true,
        display: true,
        playAs: false,
        image: "assets/images/luke.png",
    };

    var yoda = {
        slug: "yoda",
        name: "Master Yoda",
        attack: 35,
        counterAttack: 50,
        strength: 140,
        side: "rebels",
        playable: true,
        display: true,
        playAs: false,
        image: "assets/images/yoda.png",
    };

    function displaySides() {

        $("#battle-message").text("Choose Your Destiny");

        $(".rebel-button").toggle();
        $(".empire-button").toggle();

        // user selects their side and the game is started
        $(".choice-button").on("click", function(event){
            userSide = $(this).attr("side");
       
            if (userSide === "empire") {
                computerSide = "rebels";
                $("#your-side").addClass("dark-side");
                $("#your-opponents").addClass("rebels");
            } else {
                computerSide = "empire";
                $("#your-side").addClass("rebels");
                $("#your-opponents").addClass("dark-side");
            }

            // hides the buttons and removes / changes the messages
            $(".rebel-button").toggle();
            $(".empire-button").toggle();
            $("#battle-message").text("");
            $(".character-names").text("Choose Your Character:");

            gamePlay();
        
        });

    }

    // creates the character tiles
    function createTile(side, characterSlug) {

        var characterObj = eval(`${characterSlug}`);

        characterTile = $("<button>");
        characterTile.addClass("character-tile");
        characterTile.attr("character-value", characterObj.slug);
        characterTile.appendTo(side);
        
        var characterImage = $("<img>");
        characterImage.addClass("character-image");
        characterImage.attr('src', characterObj.image);
        characterImage.appendTo(characterTile);

        var characterName = $("<p>");
        characterName.addClass("character-name");
        characterName.text(characterObj.name);
        characterName.appendTo(characterTile);

        var characterStrength = $("<p>");
        characterStrength.addClass("character-strength");
        characterStrength.text(characterObj.strength);
        characterStrength.appendTo(characterTile);

        if (characterObj.playAs) {
            characterStrength.addClass("your-strength");
        }
    }

    // creates the battle display when an opponent has been selected
    function createBattleDisplay() {

        opponentCharacter.display = false;

        $(".strike-button").toggle();
        if(userSide === "empire") {
            $(".strike-button").addClass("empire-button");
        } else {
            $(".strike-button").addClass("rebel-button");
        }


        if (userSide === "empire") {
            $("#battle-message").text("Destroy the Rebel Scum!");
        } else {
            $("#battle-message").text("Defeat the Empire!");
        }

        var opponentImage = $("<img>");
        opponentImage.addClass("fight-image");
        opponentImage.attr('src', opponentCharacter.image);
        opponentImage.appendTo(".battle");

        var opponentName = $("<p>");
        opponentName.addClass("fight-name");
        opponentName.text(opponentCharacter.name);
        opponentName.appendTo(".battle");

        var opponentStrength = $("<p>");
        opponentStrength.addClass("fight-strength");
        opponentStrength.text(opponentCharacter.strength);
        opponentStrength.appendTo(".battle");

        var messageContainer = $("<p>");
        messageContainer.addClass("fight-message");
        messageContainer.text("");
        messageContainer.appendTo(".battle");

    }

    // sets the variables based on the character the user selected
    function storeUserCharacter(userCharacter) {

        characterName = userCharacter.name;
        characterAttack = userCharacter.attack;
        characterCounterAttack = userCharacter.counterAttack;
        characterStrength = userCharacter.strength;
    }

    // sets the opponent variables based on the opponent the user selected to fight
    function storeOpponentCharacter(opponentCharacter) {

        opponentName = opponentCharacter.name;
        opponentAttack = opponentCharacter.attack;
        opponentCounterAttack = opponentCharacter.counterAttack;
        opponentStrength = opponentCharacter.strength;
    }


    function chooseEnemy() {

        if (computerSide === "empire") {

            $(".opponent-names").text("Empire Foes To Attack");

            for (var i = 0; i < empireCharacters.length; i++) {
                createTile("#your-opponents", empireCharacters[i]);
                characterTile.addClass("computer-team");
            }
        } else {

            $(".opponent-names").text("Rebel Foes To Attack");

            for (var i = 0; i < rebelCharacters.length; i++) {
                createTile("#your-opponents", rebelCharacters[i]);
                characterTile.addClass("computer-team");
            }
        }

        battleEnemy();
    }

    function strike() {

        console.log(characterStrength);
        console.log(fightsWon);

        // change the characterStrength and opponentStrength.

        characterStrength = characterStrength - opponentCounterAttack;
        opponentStrength = opponentStrength - characterAttack;

        // display the fight message, the new userStrength and the new opponentStrength

        $(".your-strength").text(characterStrength);
        $(".fight-strength").text(opponentStrength);

        $(".fight-message").text(`You struck ${opponentName} for ${characterAttack} damage. ${opponentName} struck you back for ${opponentCounterAttack} damage.`);
        
        // increase the characterAttack
        characterAttack = characterAttack * 2;

        if (opponentStrength <= 0 && characterStrength >= 0) {
            fightsWon++;
            $("#battle-message").text(`You defeated ${opponentName}. Choose another opponent.`);
            $(".battle").empty();
            $(".strike-button").toggle();
        }

        if (characterStrength <= 0 && opponentStrength >= 0) {
            $("#battle-message").text(`You were no match for ${opponentName}. Try again?`);
            $(".battle").empty();
            $(".strike-button").toggle();
            $(".reset-button").toggle();
        }

        if (characterStrength <= 0 && opponentStrength <= 0) {
            $("#battle-message").text(`You and ${opponentName} killed each other in glorious battle. Try again?`);
            $(".battle").empty();
            $(".strike-button").toggle();
            $(".reset-button").toggle();
        }

        if (fightsWon === 3) {
            if (userSide === "rebels") {
                $("#battle-message").text(`You have saved the galaxy, but the dark-side can always rise again!`);
            } else {
                $("#battle-message").text(`You have protected your empire from the rebel scum! But there will always be a sequel...`);
            }
            $(".battle").empty();
            $(".reset-button").toggle();
        }
    }

    function battleEnemy() {

        // stores the opponent that the user selects as the opponentCharacter and displays them in the battle div
        $(".computer-team").on("click", function(event) {
        
            var characterSelected = $(this).attr("character-value");
            opponentCharacter = eval(`${characterSelected}`);
            $(this).css("display", "none");

            storeOpponentCharacter(opponentCharacter);

            createBattleDisplay();
        });
    }
    
    function gamePlay() {

        // displays the character options for the user to select based on which side they chose

        if (userSide === "empire") {

            for (var i = 0; i < empireCharacters.length; i++) {
                createTile("#your-side", empireCharacters[i]);
                characterTile.addClass("your-team");
            }
        } else {
            for (var i = 0; i < rebelCharacters.length; i++) {
                createTile("#your-side", rebelCharacters[i]);
                characterTile.addClass("your-team");
            }
        }

        // stores the character the user clicks on as the userCharacter object then runs ChooseEnemy function as next step
        $(".your-team").on("click", function(event) {

            var characterSelected = $(this).attr("character-value");
            userCharacter = eval(`${characterSelected}`);
            storeUserCharacter(userCharacter);
            userCharacter.playAs = true;

            // empties the character tiles and displays the userCharacter tile
            $("#your-side").empty();
            $(".character-names").text("Your Character:");
            createTile("#your-side", characterSelected);

            // When done with this step, run the chooseEnemy function to display the enemies
            chooseEnemy();
        });
    }

    function reset() {

        var userSide = "";
        var computerSide = "";
        var userCharacter = "";
        var characterName = "";
        var characterAttack = 0;
        var characterCounterAttack = 0;
        var characterStrength = 0;
        var characterSide = "";
        var opponentCharacter = "";
        var opponentName = "";
        var opponentAttack = 0;
        var opponentCounterAttack = 0;
        var opponentStrength = 0;
        var fightsWon = 0;

        $("#your-side").empty();
        $(".reset-button").toggle();
        $(".strike-button").toggle();
        $(".character-names").text("");
        $(".opponent-names").text("");

        displaySides();

    }

    displaySides();

    $(".strike-button").on("click", strike);

    $(".reset-button").on("click", reset);

});