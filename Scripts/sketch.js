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
    for (let i = birds.length - 1; i >= 0; i--) {
      birds[i].think(pipes);
      birds[i].update();
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

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

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

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
    bestBirdVisual.update();
    bestBirdVisual.show();
    } else {
    for (let bird of birds) {
        bird.show();
    }
    }

}
