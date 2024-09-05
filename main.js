let canvas;
let sketch;
let randomNumber;
let timerCounter = 0;
let timerCheck = "";
let drawSketch = "";
let answerHolder = "";
let score = 0;
let classifier;

// Conjunto de esboços
const quickDrawDataset = ['cat', 'house', 'tree', 'dragon'];

// Função preload() para carregar o modelo DoodleNet
function preload() {
  classifier = ml5.imageClassifier('DoodleNet');
}

// Função para limpar a tela e atualizar o esboço a ser desenhado
function updateCanvas() {
  randomNumber = Math.floor(Math.random() * quickDrawDataset.length);
  sketch = quickDrawDataset[randomNumber];
  document.getElementById('esboco_a_ser_desenhado').innerHTML = "Esboço a Ser Desenhado: " + sketch;
  background(255);
}

// Função setup() para configurar o ambiente de desenho
function setup() {
  canvas = createCanvas(280, 280);
  canvas.parent('canvas-container');
  background(255);
  updateCanvas();
}

// Função draw() para desenhar na tela e verificar o esboço
function draw() {
  strokeWeight(8);
  stroke(0);

  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

  checkSketch();
  
  if (drawSketch === sketch) {
    answerHolder = "set";
    score++;
    document.getElementById('pontuacao').innerHTML = "Pontuação: " + score;
    updateCanvas();
  }
}

// Função para verificar o esboço desenhado e o tempo
function checkSketch() {
  timerCounter++;
  document.getElementById('cronometro').innerHTML = "Tempo: " + timerCounter;

  if (timerCounter > 400) {
    timerCounter = 0;
    timerCheck = "completed";
  }

  if (timerCheck === "completed" || answerHolder === "set") {
    timerCheck = "";
    answerHolder = "";
    updateCanvas();
  }

  // Classificar o esboço desenhado
  classifyCanvas();
}

// Função classifyCanvas() para classificar o desenho no canvas
function classifyCanvas() {
  classifier.classify(canvas, gotResult);
}

// Função para obter o resultado da classificação
function gotResult(error, results) {
  if (error) {
    console.error(error);
  } else {
    drawSketch = results[0].label;
    document.getElementById('seu_esboco').innerHTML = 'Seu Esboço: ' + drawSketch;
    document.getElementById('precisao').innerHTML = 'Precisão: ' + Math.round(results[0].confidence * 100) + '%';
  }
}
