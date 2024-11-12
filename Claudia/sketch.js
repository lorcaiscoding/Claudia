let skyImage;
let cloudcover;
let clickedCircles = [];
let lines = [];
let hoverX = -1;
let hoverY = -1;
let pixelSize = 1; 
let enlargedPixelSize = 20; 
let poem = [];

function preload() {
  skyImage = loadImage('sky.jpg'); 
}

function setup() {
  createCanvas(1200, 600); 
  apiRequest(); 
}

function draw() {
  image(skyImage, 0, 0, 600, 600); 

  
  stroke(0);
  strokeWeight(1.5);
  for (let ln of lines) {
    line(ln.x1, ln.y1, ln.x2, ln.y2);
  }

  noStroke();
  fill(255, 0, 0);
  textSize(16);
  for (let i = 0; i < clickedCircles.length; i++) {
    let circle = clickedCircles[i];
    text(i + 1, circle.x, circle.y - 5);
  }

 if (cloudcover !== undefined) {
  for (let i = 0; i < cloudcover.length; i++) {
    let h = map(cloudcover[i], 0, 100, 550, 50); 
    let x = map(i, 0, cloudcover.length - 1, 50, 550); 
    fill(0);
    ellipse(x, h, 5, 5);
  }
}


  
  push();
  translate(600, 0); 
  fill(255); 
  rect(0, 0, 600, 600); 
  fill(0);
  textSize(14);
  textFont('Courier');
for (let i = 0; i < clickedCircles.length; i++) {
  if (poem[i] !== undefined) {
    let word = poem[i];
    let circle = clickedCircles[i];
    let wordWidth = textWidth(word); 
    let x = circle.x + 25;
    let y = circle.y;

    text(word, x, y); 
  }
}

  pop();



  if (hoverX >= 0 && hoverY >= 0) {
    let imgSection = skyImage.get(hoverX, hoverY, pixelSize, pixelSize);

    image(imgSection, hoverX, hoverY, enlargedPixelSize, enlargedPixelSize);

    stroke(255); 
    strokeWeight(2); 
    noFill(); 
    rect(hoverX, hoverY, enlargedPixelSize, enlargedPixelSize);
  }
}


function mousePressed() {
  if (mouseX > 600 || cloudcover === undefined) {
    return; 
  }

  for (let i = 0; i < cloudcover.length; i++) {
    let x = map(i, 0, cloudcover.length - 1, 50, 550); 
    let y = map(cloudcover[i], 0, 100, 550, 50); 

    let d = dist(mouseX, mouseY, x, y);
    if (d < 5) {
      clickedCircles.push({ x: x, y: y });

      if (clickedCircles.length > 1) {
        let lastCircle = clickedCircles[clickedCircles.length - 2];
        lines.push({x1: lastCircle.x, y1: lastCircle.y, x2: x, y2: y});
      }
      break;
    }
  }
}


function mouseMoved() {
  if (mouseX < 600 && mouseY < 600) { 
    let xIndex = int(mouseX / pixelSize) * pixelSize;
    let yIndex = int(mouseY / pixelSize) * pixelSize;

    if (xIndex !== hoverX || yIndex !== hoverY) {
      hoverX = xIndex;
      hoverY = yIndex;
      redraw();
    }
  } else {
    hoverX = -1; 
    hoverY = -1;
  }
}


function keyPressed() {
  if (key === 'p') {
    saveCanvas('Claudia', 'png');
  }
}



async function apiRequest() {
  try {
    let cloudRequest = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.6501&longitude=-73.9496&hourly=cloudcover");
    let cloudData = await cloudRequest.json();
    cloudcover = cloudData.hourly.cloudcover;

    let poemRequest = await fetch("https://random-word-api.vercel.app/api?words=168");
    let poemData = await poemRequest.json();
    poem = poemData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}