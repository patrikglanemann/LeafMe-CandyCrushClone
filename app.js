const grid = document.querySelector(".gameGrid");
const scoreDisplay = document.getElementById("score");
const width = 8;
const squares = [];
let score = 0;

const leafColors = [
  "url(assets/LeafBlue.png)",
  "url(assets/LeafGreen.png)",
  "url(assets/LeafOrange.png)",
  "url(assets/LeafPurple.png)",
  "url(assets/LeafRed.png)",
  "url(assets/LeafYellow.png)",
];

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("draggable", true);
    square.setAttribute("id", i);
    let randomColour = Math.floor(Math.random() * leafColors.length);
    square.style.backgroundImage = leafColors[randomColour];
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;

squares.forEach((square) => square.addEventListener("dragstart", dragStart));
squares.forEach((square) => square.addEventListener("dragend", dragEnd));
squares.forEach((square) => square.addEventListener("dragover", dragOver));
squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
squares.forEach((square) => square.addEventListener("drop", dragDrop));

function dragStart() {
  colorBeingDragged = this.style.backgroundImage;
  squareIdBeingDragged = parseInt(this.id);
  console.log(colorBeingDragged);
  console.log(this.id, "dragstart");
}

function dragOver(e) {
  e.preventDefault();
  console.log(this.id, "dragover");
}

function dragEnter(e) {
  e.preventDefault();
  console.log(this.id, "dragenter");
}

function dragLeave() {
  console.log(this.id, "dragleave");
}

function dragEnd() {
  console.log(this.id, "dragend");
  let validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged + 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + width,
  ];

  let validMove = validMoves.includes(squareIdBeingReplaced);

  if (
    (squareIdBeingReplaced && validMove) ||
    (squareIdBeingReplaced === 0 && validMove)
  ) {
    squareIdBeingReplaced = null;
  } else if (
    (squareIdBeingReplaced && !validMove) ||
    (squareIdBeingReplaced === 0 && !validMove)
  ) {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
  } else {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  }
}

function dragDrop() {
  console.log(this.id, "dragdrop");
  colorBeingReplaced = this.style.backgroundImage;
  squareIdBeingReplaced = parseInt(this.id);
  this.style.backgroundImage = colorBeingDragged;
  squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
}

function checkRowForThree() {
  for (i = 0; i < width * width; i += width) {
    for (j = i; j < i + (width - 2); j++) {
      let rowOfThree = [j, j + 1, j + 2];
      let decidedColor = squares[j].style.backgroundImage;
      const isBlank = squares[j].style.backgroundImage === "";

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
}
checkRowForThree();

function checkColumnForThree() {
  for (i = 0; i < width * width - 2 * width; i++) {
    let columnOfThree = [i, i + width, i + width * 2];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === "";

    if (
      columnOfThree.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      columnOfThree.forEach((index) => {
        squares[index].style.backgroundImage = "";
      });
    }
  }
}
checkColumnForThree();

function moveDown() {
  for (i = 0; i < width * width - width; i++) {
    if (squares[i + width].style.backgroundImage === "") {
      squares[i + width].style.backgroundImage =
        squares[i].style.backgroundImage;
      squares[i].style.backgroundImage = "";
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && squares[i].style.backgroundImage === "") {
        let randomColour = Math.floor(Math.random() * leafColors.length);
        squares[i].style.backgroundImage = leafColors[randomColour];
      }
    }
  }
}
moveDown();

window.setInterval(function () {
  moveDown();
  checkRowForThree();
  checkColumnForThree();
}, 100);
