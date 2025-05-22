// This is a simple p5.js sketch that sets up a canvas and draws a black background
// with a white rectangle in the center. It also includes a slider to control the number of simulation steps per frame.
// It uses a Bird class to represent the birds in the simulation and a Pipe class to represent the pipes.
// It also includes a NeuralNetwork class to handle the neural network logic for the birds.

// Global variables
const TOTAL = 1000;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let highScoreText;
let highScoreButton;
let saveBrainButton;
let loadInput;
let loadBrainButton;

function setup() {
  createCanvas(800, 600);
  slider = createSlider(1, 1000, 1);
  highScoreText = createDiv('High Score: ' + highscore);
  highScoreText.style('font-size', '32px');
  highScoreButton = createButton('High Score Bird');
  highScoreButton.mousePressed(() => {
    showOnlyBest = !showOnlyBest;
  });
  saveBrainButton = createButton('Download Best Brain');
  saveBrainButton.mousePressed(downloadBestBrain);
  loadInput = createFileInput(handleBrainUpload);
  loadInput.hide();
  loadBrainButton = createButton('Upload Brain');
  loadBrainButton.mousePressed(() => {
    loadInput.elt.click();
  });
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  // Run simulation steps slider.value() times per frame
  for (let n = 0; n < slider.value(); n++) {
    // runs logic for each bird
    for (let i = birds.length - 1; i >= 0; i--) {
      birds[i].think(pipes);
      birds[i].update();
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    // Resets screen when all birds are dead
    if (birds.length === 0) {
      counter = 0;
      pipes = [];
      pipes.push(new Pipe());
      nextGeneration();
    }

    // Add new pipe every 75 frames
    if (counter > 0 && counter % 75 === 0) {
      pipes.push(new Pipe());
    }
    counter++;

    // Update and check for collisions with pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
    
      // Check for collisions with birds
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      // Remove pipes that are offscreen
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
  }

  // Clear background before drawing
  background(0);

  // Draw pipes always
  for (let pipe of pipes) {
    pipe.show();
  }

  // Draw birds depending on showOnlyBest flag
  if (showOnlyBest && bestBirdVisual) {
    bestBirdVisual.think(pipes);  // run AI on best bird
    bestBirdVisual.update(); // update position
    bestBirdVisual.show(); // show best bird
    } else {
    for (let bird of birds) {
        bird.show();
    }
    }

}
