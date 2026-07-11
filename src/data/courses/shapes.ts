export const shapesCourse = {
  slug: "shapes",
  title: "Shapes",
  moduleName: "Fundamentals",
  description: "Master the coordinate system and draw your first primitive shapes using code.",
  lessons: [
    {
      id: "exercise-1",
      title: "Dot Matrix",
      module: "Shapes",
      description: "Place individual pixels with point() to create a pattern.",
      instruction: "Draw a grid of dots using point(x, y).\n\nPlace dots every 50 pixels both horizontally and vertically across the 400x400 canvas. Use the provided stroke settings to make them visible.\n\nHint: Use nested for loops with x and y starting at 0 and incrementing by 50.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  stroke(255, 100, 150);\n  strokeWeight(5);\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  stroke(255, 100, 150);\n  strokeWeight(5);\n  for (let x = 0; x <= 400; x += 50) {\n    for (let y = 0; y <= 400; y += 50) {\n      point(x, y);\n    }\n  }\n}"
    },
    {
      id: "exercise-2",
      title: "Stargazer",
      module: "Shapes",
      description: "Draw a constellation by connecting points with lines.",
      instruction: "Connect points with line(x1, y1, x2, y2) to form a constellation.\n\nConnect these stars in order:\n(100, 50) → (200, 100) → (300, 50) → (250, 200) → (150, 200) → back to (100, 50)\n\nThe stroke color and weight are already set for you.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(10);\n  stroke(255, 220, 100);\n  strokeWeight(3);\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(10);\n  stroke(255, 220, 100);\n  strokeWeight(3);\n  line(100, 50, 200, 100);\n  line(200, 100, 300, 50);\n  line(300, 50, 250, 200);\n  line(250, 200, 150, 200);\n  line(150, 200, 100, 50);\n}"
    },
    {
      id: "exercise-3",
      title: "Bubble Wrap",
      module: "Shapes",
      description: "Draw overlapping circles using circle() to create a playful bubble pattern.",
      instruction: "Draw overlapping bubbles with circle(x, y, d).\n\nCreate 5 circles with diameter 100, spaced 60px apart along y=200 (starting at x=80).\n\nUse fill() with an alpha value (4th parameter, 0-255) to make the overlaps visible. The provided noStroke() removes outlines.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(240);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(240);\n  noStroke();\n  fill(255, 100, 150, 150);\n  circle(80, 200, 100);\n  fill(100, 200, 255, 150);\n  circle(160, 200, 100);\n  fill(255, 220, 100, 150);\n  circle(240, 200, 100);\n  fill(100, 255, 150, 150);\n  circle(320, 200, 100);\n}"
    },
    {
      id: "exercise-4",
      title: "Watchful Eyes",
      module: "Shapes",
      description: "Use ellipse() to draw expressive eyes that follow the viewer.",
      instruction: "Draw eyes using ellipse(x, y, w, h) — where width and height can differ.\n\nCreate:\n- Two eye whites at (150, 200) and (250, 200), width 70, height 50\n- A blue pupil circle inside each eye (diameter 25)\n- A black inner pupil circle inside each (diameter 12)\n\nThe noStroke() and dark background are already set.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n  fill(255);\n  ellipse(150, 200, 70, 50);\n  ellipse(250, 200, 70, 50);\n  fill(60, 120, 200);\n  circle(150, 200, 25);\n  circle(250, 200, 25);\n  fill(0);\n  circle(150, 200, 12);\n  circle(250, 200, 12);\n}"
    },
    {
      id: "exercise-5",
      title: "Building Blocks",
      module: "Shapes",
      description: "Stack rectangles with rect() to build a simple house.",
      instruction: "Stack rectangles with rect(x, y, w, h) to build a house.\n\nDraw:\n1. A large brown rectangle for the house body at (100, 200), 200×180\n2. A darker brown door at (175, 280), 50×100\n3. Two white windows at (120, 230) and (240, 230), 40×40 each\n\nThe sky blue background and noStroke() are already set.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(200, 230, 255);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(200, 230, 255);\n  noStroke();\n  fill(180, 120, 80);\n  rect(100, 200, 200, 180);\n  fill(100, 60, 30);\n  rect(175, 280, 50, 100);\n  fill(255);\n  rect(120, 230, 40, 40);\n  rect(240, 230, 40, 40);\n}"
    },
    {
      id: "exercise-6",
      title: "Checkerboard",
      module: "Shapes",
      description: "Use square() to create a classic checkerboard pattern.",
      instruction: "Create a checkerboard with square(x, y, s).\n\nUse a nested for loop to draw a 4×4 grid of 50×50 squares. Alternate fill colors (black/white) based on (row + col) % 2 === 0.\n\nEach square should be placed at (col × 100 + 25, row × 100 + 25).",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n  for (let row = 0; row < 4; row++) {\n    for (let col = 0; col < 4; col++) {\n      fill((row + col) % 2 === 0 ? 255 : 0);\n      square(col * 100 + 25, row * 100 + 25, 50);\n    }\n  }\n}"
    },
    {
      id: "exercise-7",
      title: "Kite Flying",
      module: "Shapes",
      description: "Draw a kite shape using quad() with four connecting points.",
      instruction: "Draw a diamond kite with quad(x1, y1, x2, y2, x3, y3, x4, y4).\n\nCreate a kite body using these four points:\n(200, 50) top, (300, 150) right, (200, 300) bottom, (100, 150) left\n\nThen add a tail with line(200, 300, 200, 380). Use different fill colors for the two halves to show the diamond shape.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(180, 210, 255);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(180, 210, 255);\n  noStroke();\n  fill(255, 100, 150);\n  quad(200, 50, 300, 150, 200, 300, 100, 150);\n  fill(255, 200, 100);\n  quad(200, 150, 250, 200, 200, 300, 150, 200);\n  stroke(150, 80, 50);\n  strokeWeight(3);\n  line(200, 300, 200, 380);\n}"
    },
    {
      id: "exercise-8",
      title: "Mountain Range",
      module: "Shapes",
      description: "Build a mountain landscape by stacking triangles.",
      instruction: "Stack triangles with triangle(x1, y1, x2, y2, x3, y3) to build mountains.\n\nDraw three overlapping green mountains of different sizes, each touching the bottom of the canvas (y=400):\n- Left mountain: (0,400) (100,150) (200,400)\n- Center mountain: (100,400) (250,80) (350,400)\n- Right mountain: (250,400) (320,180) (400,400)\n\nAdd a small white snow cap on the center mountain.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(100, 150, 255);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(100, 150, 255);\n  noStroke();\n  fill(70, 130, 70);\n  triangle(0, 400, 100, 150, 200, 400);\n  fill(90, 160, 90);\n  triangle(100, 400, 250, 80, 350, 400);\n  fill(60, 120, 60);\n  triangle(250, 400, 320, 180, 400, 400);\n  fill(200, 200, 200);\n  triangle(100, 150, 130, 180, 80, 180);\n}"
    },
    {
      id: "exercise-9",
      title: "Pizza Slices",
      module: "Shapes",
      description: "Use arc() to draw pizza slices and learn about angles.",
      instruction: "Slice a pizza with arc(x, y, w, h, start, stop).\n\nAngles use radians — PI = 180\u00B0, TWO_PI = 360\u00B0.\n\nDraw three colored slices making up a full pizza at (200, 200):\n1. 0 to TWO_PI/3 (yellow)\n2. TWO_PI/3 to 4*PI/3 (red)\n3. 4*PI/3 to TWO_PI (green)\n\nUse diameter 280 for all slices.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n  fill(255, 200, 100);\n  arc(200, 200, 280, 280, 0, TWO_PI / 3);\n  fill(255, 100, 100);\n  arc(200, 200, 280, 280, TWO_PI / 3, (4 * PI) / 3);\n  fill(100, 200, 100);\n  arc(200, 200, 280, 280, (4 * PI) / 3, TWO_PI);\n}"
    },
    {
      id: "exercise-10",
      title: "Target Practice",
      module: "Shapes",
      description: "Use ellipseMode() to control how ellipses are positioned.",
      instruction: "Compare ellipseMode(CENTER) vs ellipseMode(CORNER).\n\nDraw three overlapping rings at (200, 200):\n1. Red ring with ellipseMode(CENTER) — centered at (200, 200)\n2. Blue ring with ellipseMode(CORNER) — top-left at (200, 200)\n3. Small yellow ring at center with ellipseMode(CENTER)\n\nUse semi-transparent fill colors (alpha ~150) so overlaps are visible.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n  fill(255, 100, 100, 150);\n  ellipseMode(CENTER);\n  ellipse(200, 200, 120, 120);\n  fill(100, 200, 255, 150);\n  ellipseMode(CORNER);\n  ellipse(200, 200, 120, 120);\n  fill(255, 220, 100, 150);\n  ellipseMode(CENTER);\n  ellipse(200, 200, 40, 40);\n}"
    },
    {
      id: "exercise-11",
      title: "Alignment",
      module: "Shapes",
      description: "Compare rectMode(CENTER) vs rectMode(CORNER) to understand positioning.",
      instruction: "Compare rectMode(CENTER) vs rectMode(CORNER).\n\nDraw two squares at the same coordinate (200, 150):\n1. Red square with rectMode(CENTER) — centered at (200, 150)\n2. Blue square with rectMode(CORNER) — top-left at (200, 150)\n\nBoth squares are 100\u00D7100. Use semi-transparent fills so the overlap is visible.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  noStroke();\n  fill(255, 100, 150, 180);\n  rectMode(CENTER);\n  rect(200, 150, 100, 100);\n  fill(100, 200, 255, 180);\n  rectMode(CORNER);\n  rect(200, 150, 100, 100);\n}"
    },
    {
      id: "exercise-12",
      title: "Line Weight",
      module: "Shapes",
      description: "Combine strokeWeight() with shapes to add depth and emphasis.",
      instruction: "Vary strokeWeight() for emphasis. Draw three concentric circles with different stroke thicknesses:\n\n1. Outer circle (d=250) — thick stroke (weight 12), red\n2. Middle circle (d=170) — medium stroke (weight 8), blue\n3. Inner circle (d=90) — thin stroke (weight 4), yellow\n\nUse noFill() so only the outlines are visible.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(20);\n  noFill();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(20);\n  noFill();\n  stroke(255, 100, 100);\n  strokeWeight(12);\n  circle(200, 200, 250);\n  stroke(100, 200, 255);\n  strokeWeight(8);\n  circle(200, 200, 170);\n  stroke(255, 220, 100);\n  strokeWeight(4);\n  circle(200, 200, 90);\n}"
    },
  ]
};

export type Course = typeof shapesCourse;
