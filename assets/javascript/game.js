$(document).ready(function() {

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
    var empireCharacters = ["kylo_ren", "vader", "sidious"];
    var rebelCharacters = ["rey", "luke", "yoda"];
    var characterTile;
    var strikeMessage = "";
    var fightsWon = 0;

    // displays the sides before the game begins.  The user can select which side to play as.  
    function displaySides() {

        $("#battle-message").text("Choose Your Destiny");

        // displays the Jedi and Empire buttons
        $(".rebel-button").toggle();
        $(".empire-button").toggle();

        $(".choice-button").on("click", function(event){

            // user selects their side by clicking on the button
            userSide = $(this).attr("side");
       
            // depending on which side the user selects, the computer is assigned the other side.
            // the your-side and opponent divs are assigned the correct classes
            if (userSide === "empire") {

                computerSide = "rebels";
                $("#your-side").addClass("dark-side");
                $("#your-opponents").addClass("rebels");

            } else {

                computerSide = "empire";
                $("#your-side").addClass("rebels");
                $("#your-opponents").addClass("dark-side");
            }

            // after the side has been selected - hide the buttons and update messages on the page
            $(".rebel-button").toggle();
            $(".empire-button").toggle();
            $("#battle-message").text("");
            $(".character-names").text("Choose Your Character:");

            // start the gamePlay function
            gamePlay();
        
        });
    }

    function gamePlay() {

        // displays the character options for the user to select based on which side they chose
        // character tiles are created using the createTile function
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

        
        $(".your-team").on("click", function(event) {

            // stores the character the user clicks
            var characterSelected = $(this).attr("character-value");

            // converts the attribute to an object and stores that object as the userCharacter
            userCharacter = eval(`${characterSelected}`);
            storeUserCharacter(userCharacter);
            userCharacter.playAs = true;

            // empties the character tiles and displays the userCharacter tile as the selected character
            $("#your-side").empty();
            $(".character-names").text("Your Character:");
            createTile("#your-side", characterSelected);

            // disables the user's character tile for the remainder of the game
            $("#your-side .character-tile").prop('disabled', true);

            // display the enemies after these steps have been completed
            displayEnemies();
        });
    }

    function displayEnemies() {

        // displays the character options for the opponent side based on which side the user chose
        // changes the header text to the correct side and enemy character tiles are created using the createTile function

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

        // after displaying the tiles, call the battleEnemy function to register which opponent the user selects to fight
        chooseEnemy();
    }

    function chooseEnemy() {

        $(".computer-team").on("click", function(event) {

            // stores the opponent that the user selects
            var characterSelected = $(this).attr("character-value");

            // sets the opponentCharacter to the character object
            opponentCharacter = eval(`${characterSelected}`);

            // hides the tile from being displayed in the opponents div
            $(this).css("display", "none");

            // disables the remaining opponent tiles so that they cannot be clicked during the battle
            $(".computer-team").prop('disabled', true);

            // sets the opponent variables based on the properties in the object
            storeOpponentCharacter(opponentCharacter);

            // populates the battle container and displays the opponent in the container
            createBattleDisplay();
        });
    }

    function createBattleDisplay() {

        // display the strike-button and assign it a class to change the styling based on the user's side
        $(".strike-button").toggle();
        if(userSide === "empire") {
            $(".strike-button").addClass("empire-button");
        } else {
            $(".strike-button").addClass("rebel-button");
        }

        // display the fight message based on the user's side
        if (userSide === "empire") {
            $("#battle-message").text("Destroy the Rebel Scum!");
        } else {
            $("#battle-message").text("Defeat the Empire!");
        }

        // create an <img> element and populate it with the opponent's image
        var opponentImage = $("<img>");
        opponentImage.addClass("fight-image");
        opponentImage.attr('src', opponentCharacter.image);
        opponentImage.appendTo(".battle");

        // create a <p> element and populate it with the opponent's name
        var opponentName = $("<p>");
        opponentName.addClass("fight-name");
        opponentName.text(opponentCharacter.name);
        opponentName.appendTo(".battle");

        // create a <p> element and populate it with the opponent's strength
        var opponentStrength = $("<p>");
        opponentStrength.addClass("fight-strength");
        opponentStrength.text(opponentCharacter.strength);
        opponentStrength.appendTo(".battle");

        // create a <p> element that will be filled with the fight update messages
        var messageContainer = $("<p>");
        messageContainer.addClass("fight-message");
        messageContainer.text("");
        messageContainer.appendTo(".battle");
    }

    // after the battle display has been populated, the user can click on the strike button which will run the strike function
    function strike() {

        // change the characterStrength so that it is decreased by the opponents counter attack value
        characterStrength = characterStrength - opponentCounterAttack;

        // change the opponentStrength so that it is decreased by the character's attack value
        opponentStrength = opponentStrength - characterAttack;

        // update the strength values for the character and opponent
        $(".your-strength").text(characterStrength);
        $(".fight-strength").text(opponentStrength);

        // display the fight message stating the damage to the character and opponent
        $(".fight-message").text(`You struck ${opponentName} for ${characterAttack} damage. ${opponentName} struck you back for ${opponentCounterAttack} damage.`);
        
        // increase the characterAttack value for the next strike
        characterAttack = characterAttack * 2;

        // after each strike look to see if the opponent was defeated, if the user died or if they both died

        // opponent was defeated and character is still alive.  Increase number of fights won, update the message, empty the battle div and hide the strike-button
        if (opponentStrength <= 0 && characterStrength >= 0) {
            fightsWon++;
            $("#battle-message").text(`You defeated ${opponentName}. Choose another opponent.`);
            $(".battle").empty();
            $(".strike-button").toggle();
            $(".computer-team").prop('disabled', false);
        }

        // user was killed.  Update the message, empty the battle div, hide the strike-button, display the reset-button
        if (characterStrength <= 0 && opponentStrength >= 0) {
            $("#battle-message").text(`You were no match for ${opponentName}. Try again?`);
            $(".battle").empty();
            $(".strike-button").toggle();
            $(".reset-button").toggle();
        }

        // both user and opponent were killed.  Update the message, empty the battle div, hide the strike-button, display the reset-button
        if (characterStrength <= 0 && opponentStrength <= 0) {
            $("#battle-message").text(`You and ${opponentName} killed each other in glorious battle. Try again?`);
            $(".battle").empty();
            $(".strike-button").toggle();
            $(".reset-button").toggle();
        }

        // if the user wins all 3 fights, display the you won message, empty the battle div and display the reset-button
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

    // function to create character tiles
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

        console.log(empireCharacters);
        console.log(rebelCharacters);
    }

    // sets the variable values based on the character the user selected
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

    function reset() {

        location.reload();
    }

    // calls the first function 
    displaySides();

    // sets up the strike-button event listener and runs the strike function
    $(".strike-button").on("click", strike);

    // sets up the reset-button event listener and runs the reset function
    $(".reset-button").on("click", reset);

});