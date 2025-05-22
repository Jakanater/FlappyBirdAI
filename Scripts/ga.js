let highscore = 0;
let showOnlyBest = false;
let bestBirdEver = null;
let bestBirdBrain = null;
let bestBirdVisual = null;

function nextGeneration() {
  console.log('next generation');
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = pickOne();
  }
  savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;
  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  let bestBirdThisGen = savedBirds[0]; // start with first bird

  for (let bird of savedBirds) {
    sum += bird.score;

    // Update global highscore and bestBirdEver
    if (bird.score > highscore) {
      highscore = bird.score;
      bestBirdEver = bird;
      bestBirdBrain = bird.brain.copy();
      highScoreText.html('High Score: ' + highscore);

      // Update the bestBirdVisual each time we get a new high score
      createBestBirdVisual();
    }

    if (bird.score > bestBirdThisGen.score) {
      bestBirdThisGen = bird;
    }
  }

  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}

function createBestBirdVisual() {
  if (bestBirdBrain) {
    bestBirdVisual = new Bird(bestBirdBrain);
  }
}

function showBestBird() {
  if (bestBirdVisual) {
    bestBirdVisual.show();
  }
}

function downloadBestBrain() {
  if (bestBirdBrain) {
    let json = bestBirdBrain.serialize();
    saveJSON(JSON.parse(json), 'best-bird-brain.json');
  } else {
    console.log('No best brain to save yet!');
  }
}

function handleBrainUpload(file) {
  let data;
  if (typeof file.data === 'string') {
    data = JSON.parse(file.data);
  } else {
    data = file.data; // already parsed object
  }

  if (data) {
    bestBirdBrain = NeuralNetwork.deserialize(data);
    createBestBirdVisual();
    console.log('Brain loaded successfully!');
  } else {
    console.log('Invalid brain data');
  }
}
