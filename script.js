// GLOBAL VARIABLES


// Data for memories - I've added dictionaries inside the list
let memoriesList = [
    { text: "Used the subway for the first time in August 2023", img: "subway.gif" },
    { text: "A squirrel stole my popcorn :(", img: "squirrel.gif" },
    { text: "I was shocked to see so many pigeons in NYC!!!", img: "pigeons.gif" }
];

// Memory markers that appear where each memory is unlocked
let GreenBlobs = [];
// Whether a memory banner is open
let showMemoryBanner = false;
// The text shown on the memory banner
let memoryBannerText = "";
// The image shown on the memory banner
let memoryBannerImage = null;
// Indicates if the game is finished (for the upcoming conditional statement)
let gameHasEnded = false;
// Whether the final (game-over) banner is displayed (to print final banner)
let showFinalBanner = false;
// Final end-of-game message
let finalMessageText = "";

// Player and Squirrel
let mainPlayer, roamingSquirrel;
// Array of thrown acorns
let thrownAcorns = [];
// Times we've caught the squirrel
let squirrelCatchCount = 0; 
// Which memory index we are on
let memoryIndex = 0;

// Arrays for decorative elements
let movingClouds = [];
let flowerPositions = [];
let shrubPositions = [];

// PRELOAD
function preload() {
    // Preload each memory's image
    for (let eachMemory of memoriesList) {
        eachMemory.imgObj = loadImage(eachMemory.img);
    }
}

// SETUP
function setup() {
    createCanvas(windowWidth, windowHeight);
//I'm calling functions here
    createClouds(); 
    createFlowersAndShrubs();

    initDayMode(); // Start the game
}

// DRAW (MAIN LOOP)
function draw() {
    drawEnvironment(3);

    // Banners or game-over logic - if true, draw/print it
    if (showMemoryBanner) {
        drawMemoryBanner();
        return;
    }
    if (gameHasEnded && showFinalBanner) {
        drawGameOverBanner();
        return;
    }
    if (gameHasEnded && !showFinalBanner) {
        drawGreenBlobs();
        return;
    }

    // Normal game logic - repeatedly calling main game functions - for smoothness in game
    drawDayGame();
    drawGreenBlobs();
}

// INITIALIZE GAME - definitions of the functions
function initDayMode() {
    // Reset all game-related variables
    gameHasEnded = false;
    showFinalBanner = false;
    GreenBlobs = [];
    thrownAcorns = [];
    memoryIndex = 0;
    squirrelCatchCount = 0;
    finalMessageText = "";

    // Player restricted to bottom half
    mainPlayer = {x: width / 2, y: (3 * height) / 4, size: 40};

    // Squirrel also bottom half
    roamingSquirrel = {x: random(100, width - 100), y: random(height / 2 + 30, height - 50), size: 30, speedX: 3, speedY: 3};
}

// ENVIRONMENT (SKY + GRASS + DECOR)
function drawEnvironment() {
    // Sky
    background(135, 206, 235);

    // Sun
    fill(255, 255, 0);
    noStroke();
    ellipse(80, 80, 60, 60);

    // Clouds
    moveAndDrawClouds();

    // Simple trees in top half
    drawTrees();

    // Grass on bottom half (location of where i start vs dimensions of the grass)
    fill(34, 139, 34);
    rect(0, height / 2, width, height / 2);

    // Flowers & shrubs on grass
    drawFlowersAndShrubs();
}

// Create initial clouds data - location (temporary variable i; as long as i is within 7, clous get pushed out one by one - beyond 7, there's a reset)
function createClouds() {
    for (let i = 0; i < 7; i++) {
        movingClouds.push({
            x: random(width),
            y: random(30, height / 3),
            speed: random(1, 2)
        });
    }
}

// Move and draw clouds drifting left(3 ellipses to make one cloud) 
function moveAndDrawClouds() {
    fill(255);
    noStroke();
    for (let c of movingClouds) {
        ellipse(c.x, c.y, 60, 35);
        ellipse(c.x + 25, c.y + 10, 50, 30);
        ellipse(c.x - 25, c.y + 10, 50, 30);

        c.x -= c.speed;
        if (c.x < -80) { //if the could goes beyond the screen on the left, re-assign the c.x value to re-create the clouds to move from right to left),
            c.x = width + 80;
            c.y = random(30, height / 3);
            c.speed = random(1, 2);
        }
    }
}

// Create initial flowers & shrubs
function createFlowersAndShrubs() {
    for (let i = 0; i < 10; i++) {
        flowerPositions.push({
            x: random(width),
            y: random(height / 2 + 20, height - 20)
        });
    }
    for (let i = 0; i < 6; i++) {
        shrubPositions.push({
            x: random(width),
            y: random(height / 2 + 30, height - 40)
        });
    }
}

// Draw flowers & shrubs
function drawFlowersAndShrubs() {
    // Flowers
    for (let f of flowerPositions) { //f extracts the flower positions from the above randomized location and repeats until the flower positions variable is empty
        stroke(0, 128, 0);
        strokeWeight(2);
        line(f.x, f.y, f.x, f.y - 10);
        noStroke();
        fill(255, 0, 255);
        ellipse(f.x, f.y - 15, 10, 10);
    }
    // Shrubs
    for (let s of shrubPositions) {
        fill(0, 100, 0);
        noStroke();
        ellipse(s.x, s.y, 30, 20);
    }
}

// Drawing 2 basic trees in top half (tree#1 and tree#2 - locations+dimensions)
function drawTrees() {
    fill(139, 69, 19);
    rect(100, height / 2 - 120, 30, 120);
    fill(34, 139, 34);
    ellipse(115, height / 2 - 120, 100, 80);

    fill(139, 69, 19);
    rect(width - 150, height / 2 - 100, 25, 100);
    fill(34, 139, 34);
    ellipse(width - 137, height / 2 - 110, 70, 60);
}

// MAIN GAME LOGIC

function drawDayGame() {
    // Constrain mainPlayer to bottom half - restricting y and x axis
    mainPlayer.y = constrain(mainPlayer.y, height / 2, height);
    mainPlayer.x = constrain(mainPlayer.x, 0, width);

    // Constrain squirrel to bottom half
    roamingSquirrel.y = constrain(roamingSquirrel.y, height / 2, height);
    roamingSquirrel.x = constrain(roamingSquirrel.x, 0, width);

    // Draw them - giving input after taking constraints
    drawStickMan(mainPlayer.x, mainPlayer.y);
    drawSquirrel(roamingSquirrel.x, roamingSquirrel.y);

    // Check distance for catches
    let distanceBetween = dist(mainPlayer.x, mainPlayer.y, roamingSquirrel.x, roamingSquirrel.y);
    if (distanceBetween < 50) {
        squirrelCatchCount++;
        if (squirrelCatchCount >= 5) {
            showMemoryBanner = true;
            memoryBannerText = memoriesList[memoryIndex].text;
            memoryBannerImage = memoriesList[memoryIndex].imgObj;
            GreenBlobs.push({ //push location to greenblob
                x: roamingSquirrel.x,
                y: roamingSquirrel.y,
                desc: memoriesList[memoryIndex]
            });
            squirrelCatchCount = 0;
            if (memoryIndex < memoriesList.length - 1) {
                memoryIndex++;
                roamingSquirrel.x = random(0, width);
                roamingSquirrel.y = random(height / 2, height - 50);
            } else {
                gameHasEnded = true;
                showFinalBanner = true;}
        }
    }

    // Squirrel throws acorns 
    if (random() < 0.01) {
        thrownAcorns.push({
            x: roamingSquirrel.x,
            y: roamingSquirrel.y,
            speed: 3,
            angle: atan2(mainPlayer.y - roamingSquirrel.y, mainPlayer.x - roamingSquirrel.x)
        });
    }

    // Move & draw acorns
    fill(139, 69, 19); 
    for (let i = thrownAcorns.length - 1; i >= 0; i--) { //to show how many acrons have been thrown at the human
        let oneAcorn = thrownAcorns[i]; //take one acron and throw in one location
        oneAcorn.x += cos(oneAcorn.angle) * oneAcorn.speed; //add angles to the throw + speed
        oneAcorn.y += sin(oneAcorn.angle) * oneAcorn.speed;
        ellipse(oneAcorn.x, oneAcorn.y, 10);
        if (dist(oneAcorn.x, oneAcorn.y, mainPlayer.x, mainPlayer.y) < 20) {
            thrownAcorns.splice(i, 1);
        }
    }

    // Move squirrel - OR add speed to a roaming squirrel
    roamingSquirrel.x += roamingSquirrel.speedX;
    roamingSquirrel.y += roamingSquirrel.speedY;
    if (roamingSquirrel.x < 0 || roamingSquirrel.x > width) roamingSquirrel.speedX *= -1;
    if (roamingSquirrel.y < height / 2 || roamingSquirrel.y > height) roamingSquirrel.speedY *= -1;

    // Player follows mouse - I've usef to calculate a number b/w 2 at a specific increment - point2
    mainPlayer.x = lerp(mainPlayer.x, mouseX, 0.2);
    mainPlayer.y = lerp(mainPlayer.y, mouseY, 0.2);
}

// DRAW SQUIRREL
function drawSquirrel(x, y) {
    push();
    translate(x, y);
    fill(255, 165, 0);
    ellipse(0, 0, 30, 20);
    fill(255, 140, 0);
    ellipse(-15, -10, 15, 30);
    fill(255, 165, 0);
    ellipse(10, -5, 15, 15);
    fill(255, 140, 0);
    ellipse(7, -15, 5, 8);
    fill(0);
    ellipse(12, -5, 3, 3);
    pop();
}

// BANNERS & MEMORIES
function drawMemoryBanner() {
    fill(0, 200);
    rect(150, height / 6, width - 300, height / 1.5);

    // Bright text color
    fill(255, 200, 0);
    textSize(30);
    textAlign(CENTER);

    // Display memory image - retrive memorybannerimage and text location+dimensions
    image(memoryBannerImage, 150, height / 6, width - 300, height / 1.5);
    text(memoryBannerText, width / 2, height / 3);

    textSize(16);
    fill(0);
    text("Click anywhere to close!", width / 2, height / 1.8 + 80);
}

function drawGameOverBanner() {
    fill(0, 200);
    rect(50, height / 2 - 50, width - 100, 100);

    fill(255);
    textSize(24);
    textAlign(CENTER);
    text("Yayyy, all memories have been collected!", width / 2, height / 2);

    textSize(16);
    text("Click to close", width / 2, height / 2 + 30);
    cursor();
}

// Draw the memory markers
function drawGreenBlobs() {
    for (let marker of GreenBlobs) {
        fill(0, 255, 0);
        ellipse(marker.x, marker.y, 20);
    }
}

// STICKMAN

function drawStickMan(x, y) {
    stroke(255);
    strokeWeight(3);
    line(x, y, x, y + 30);
    line(x, y + 30, x - 10, y + 50);
    line(x, y + 30, x + 10, y + 50);
    line(x, y + 10, x - 10, y + 20);
    line(x, y + 10, x + 10, y + 20);
    fill(255);
    ellipse(x, y - 10, 15);
}

// INPUT & WINDOW - finction definition

function mousePressed() {
    if (showMemoryBanner==true) {
        showMemoryBanner = false;
        return;
    }
    if (gameHasEnded && showFinalBanner) {
        showFinalBanner = false;
        return;
    }
    // Check memory markers
    for (let marker of GreenBlobs) {
        if (dist(mouseX, mouseY, marker.x, marker.y) < 20) {
            showMemoryBanner = true;
            memoryBannerText = marker.desc.text;
            memoryBannerImage = marker.desc.imgObj;
        }
    }
}
