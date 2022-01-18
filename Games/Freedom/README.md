# Freedom-Game
This is an HTML and JavaScript implementation of the Freedom board game made by
Veljko Cirovic and Bebojsa Sankovic. You will play as the white stone and go against
an optimized AI playing as the black stone.

<a href="https://boardgamegeek.com/boardgame/100480/freedom"> Original Game </a>

## Dependencies
A browser such as Google Chrome, Firefox, or Microsoft Edge with JavaScript enabled.

Make sure that if your content is contained in a zip file, that you extract all the content,
or the game may not run or display correctly.

## Rules
The white stone player will have the first move. A stone can be placed on any spot
on the board in the first move. After this, each player takes turns and can place 
a stone on any spot that is adjacent to the opponent's previously placed stone. The
last player can opt out of placing a stone on the last turn.

## Objective
The objective of the game is to get the most lives by the end of the game. Lives
are a set of exactly four stones of the same color in a row either, horizontally, vertically,
or diagonally. If a set of four stones in a row increases to five or more stones, the life is removed.
The game is over when all spots on the board are completely filled with
stones or if the last player opts to not place a stone on the board.

## How to Play
Open up index.html, and click on an empty spot on the board. The score is shown to the top left
under the game title, while the reset button is shown on the top right under the game title.
The left score is the number of white stone lives, while the number on the right is the 
number of black stone lives. The reset button will refresh the page so that you can play
a new game.
