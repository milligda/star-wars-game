$(document).ready(function() {

    var userSide = "empire"; // assigned when the user selects a side at the beginning
    var computerSide = "";
    var userCharacter = "";
    var characterName = "";
    var characterAttack = 0;
    var characterCounterAttack = 0;
    var characterStrength = 0;
    var characterSide = "";
    var opponent;
    var empireCharacters = ["kylo_ren", "kylo_ren", "kylo_ren"];
    var rebelCharacters = ["luke", "luke", "luke"];
    var characterTile;

    if (userSide === "empire") {
        computerSide = "rebels";
    } else {
        computerSide = "empire";
    }

    var kylo_ren = {
        slug: "kylo_ren",
        name: "Kylo Ren",
        attack: 12,
        counterAttack: 25,
        strength: 150,
        side: "empire",
        playable: true,
        display: true,
        image: "assets/images/kylo_ren.png",
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
        image: "assets/images/luke.png",
    };

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

    }

    function storeUserCharacter(userCharacter) {

        characterName = userCharacter.name;
        characterAttack = userCharacter.attack;
        characterCounterAttack = userCharacter.counterAttack;
        characterStrength = userCharacter.strength;

    }

    function chooseEnemy() {

        if (computerSide === "empire") {

            $(".opponent-names").text("Empire");

            for (var i = 0; i < empireCharacters.length; i++) {
                createTile("#your-opponents", empireCharacters[i]);
                characterTile.addClass("computer-team");
            }
        } else {

            $(".opponent-names").text("Rebels");

            for (var i = 0; i < rebelCharacters.length; i++) {
                createTile("#your-opponents", rebelCharacters[i]);
                characterTile.addClass("computer-team");
            }
        }

        battleEnemy();

    }

    function battleEnemy() {

        $(".computer-team").on("click", function(event) {


        });

    }
    
    function startGame() {

        // displays the character options for the user to select
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

            var characterSelected = $(this).attr("character-value");
            userCharacter = eval(`${characterSelected}`);

            storeUserCharacter(userCharacter);

            $("#your-side").empty();

            $(".character-names").text("Your Character:");

            createTile("#your-side", characterSelected);

            chooseEnemy();

        });




    }

    startGame();

    /* 
    - User picks a side - either empire or rebels - start the music!
    - User selects an opponent and we store that characters stats for the opponent stats
    - Opponent is removed from the playable list
    - User clicks "strike", we calculate the new health and attack points.  These are displayed on the page
    - User continues to click "strike" until they either win or lose the battle
    - At the end of the battle, the user can either choose another opponent, start the game over because they either won or lost

    functions:
    
    display the playable characters


    Could we use a display css rule that is based on a display property?  If the display is true, then display the tile.  if the display is false, then the tile would be hidden?

    Could we use a rule to so that characters are only playable when we determine?  We want to make sure that when a user selects an opponent, they have to play that opponent all the way through and can't just click on another opponent.  
    

    */



});