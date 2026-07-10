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
      instruction: "Use the point() function to draw a grid of dots across the canvas. Each point() takes (x, y) coordinates. Draw dots at every 50 pixels both horizontally and vertically to make a 8x8 grid covering the 400x400 canvas. Use strokeWeight(5) to make the dots visible.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  stroke(255, 100, 150);\n  strokeWeight(5);\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  stroke(255, 100, 150);\n  strokeWeight(5);\n  for (let x = 0; x <= 400; x += 50) {\n    for (let y = 0; y <= 400; y += 50) {\n      point(x, y);\n    }\n  }\n}"
    },
    {
      id: "exercise-2",
      title: "Stargazer",
      module: "Shapes",
      description: "Draw a constellation by connecting points with lines.",
      instruction: "Use line() to connect points and form a constellation pattern. The line() function takes (x1, y1, x2, y2). Connect the following points in order: (100, 50) to (200, 100) to (300, 50) to (250, 200) to (150, 200) back to (100, 50). Use a bright stroke color.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(10);\n  stroke(255, 220, 100);\n  strokeWeight(3);\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(10);\n  stroke(255, 220, 100);\n  strokeWeight(3);\n  line(100, 50, 200, 100);\n  line(200, 100, 300, 50);\n  line(300, 50, 250, 200);\n  line(250, 200, 150, 200);\n  line(150, 200, 100, 50);\n}"
    },
    {
      id: "exercise-3",
      title: "Bubble Wrap",
      module: "Shapes",
      description: "Draw overlapping circles using circle() to create a playful bubble pattern.",
      instruction: "Use circle() to draw a row of overlapping circles across the canvas. Each circle takes (x, y, diameter). Draw 5 circles with diameter 100, spaced 60px apart horizontally along y=200. Set their fill colors to semi-transparent by adding an alpha value (4th parameter) to fill() so the overlaps are visible.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(240);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(240);\n  noStroke();\n  fill(255, 100, 150, 150);\n  circle(80, 200, 100);\n  fill(100, 200, 255, 150);\n  circle(160, 200, 100);\n  fill(255, 220, 100, 150);\n  circle(240, 200, 100);\n  fill(100, 255, 150, 150);\n  circle(320, 200, 100);\n}"
    },
    {
      id: "exercise-4",
      title: "Watchful Eyes",
      module: "Shapes",
      description: "Use ellipse() to draw expressive eyes that follow the viewer.",
      instruction: "Draw a pair of eyes using ellipse() which takes (x, y, width, height). Create two eye whites as wide ellipses (width > height), then add pupils as circles inside them. Position the left eye at (150, 200) and right eye at (250, 200) with width 70 and height 50.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n  fill(255);\n  ellipse(150, 200, 70, 50);\n  ellipse(250, 200, 70, 50);\n  fill(60, 120, 200);\n  circle(150, 200, 25);\n  circle(250, 200, 25);\n  fill(0);\n  circle(150, 200, 12);\n  circle(250, 200, 12);\n}"
    },
    {
      id: "exercise-5",
      title: "Building Blocks",
      module: "Shapes",
      description: "Stack rectangles with rect() to build a simple house.",
      instruction: "Use rect() which takes (x, y, width, height) to draw a house. Start with the main body (a large rectangle at the bottom), then a smaller rectangle for the door, and two small rectangles for windows. Center the house on the 400x400 canvas.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(200, 230, 255);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(200, 230, 255);\n  noStroke();\n  fill(180, 120, 80);\n  rect(100, 200, 200, 180);\n  fill(100, 60, 30);\n  rect(175, 280, 50, 100);\n  fill(255);\n  rect(120, 230, 40, 40);\n  rect(240, 230, 40, 40);\n}"
    },
    {
      id: "exercise-6",
      title: "Checkerboard",
      module: "Shapes",
      description: "Use square() to create a classic checkerboard pattern.",
      instruction: "Use square() which takes (x, y, size) — a convenience over rect() when width equals height. Create a 4x4 checkerboard by drawing alternating colored squares. Each square should be 50x50 pixels. Use a nested loop to place them.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n  for (let row = 0; row < 4; row++) {\n    for (let col = 0; col < 4; col++) {\n      fill((row + col) % 2 === 0 ? 255 : 0);\n      square(col * 100 + 25, row * 100 + 25, 50);\n    }\n  }\n}"
    },
    {
      id: "exercise-7",
      title: "Kite Flying",
      module: "Shapes",
      description: "Draw a kite shape using quad() with four connecting points.",
      instruction: "Use quad() which takes 8 parameters — (x1, y1, x2, y2, x3, y3, x4, y4) — defining four corners of a quadrilateral. Draw a kite shape with a diamond-like body and a long tail: top point (200, 50), right point (300, 150), bottom point (200, 300), left point (100, 150). Add a tail using line().",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(180, 210, 255);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(180, 210, 255);\n  noStroke();\n  fill(255, 100, 150);\n  quad(200, 50, 300, 150, 200, 300, 100, 150);\n  fill(255, 200, 100);\n  quad(200, 150, 250, 200, 200, 300, 150, 200);\n  stroke(150, 80, 50);\n  strokeWeight(3);\n  line(200, 300, 200, 380);\n}"
    },
    {
      id: "exercise-8",
      title: "Mountain Range",
      module: "Shapes",
      description: "Build a mountain landscape by stacking triangles.",
      instruction: "Use triangle() which takes 6 parameters — (x1, y1, x2, y2, x3, y3). Draw three overlapping triangles of different sizes and colors to form a mountain range. Place the largest mountain at the center, a smaller one on the left, and another on the right. Each mountain should touch the bottom of the canvas.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(100, 150, 255);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(100, 150, 255);\n  noStroke();\n  fill(70, 130, 70);\n  triangle(0, 400, 100, 150, 200, 400);\n  fill(90, 160, 90);\n  triangle(100, 400, 250, 80, 350, 400);\n  fill(60, 120, 60);\n  triangle(250, 400, 320, 180, 400, 400);\n  fill(200, 200, 200);\n  triangle(100, 150, 130, 180, 80, 180);\n}"
    },
    {
      id: "exercise-9",
      title: "Pizza Slices",
      module: "Shapes",
      description: "Use arc() to draw pizza slices and learn about angles.",
      instruction: "Use arc() which takes (x, y, width, height, startAngle, stopAngle). Angles use radians where PI = 180 degrees. Draw a whole pizza as a circle, then slice it by drawing arcs. Use fill() with different colors for each slice. Draw three slices covering the whole circle: 0 to TWO_PI/3, TWO_PI/3 to 4*PI/3, and 4*PI/3 to TWO_PI.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(50);\n  noStroke();\n  fill(255, 200, 100);\n  arc(200, 200, 280, 280, 0, TWO_PI / 3);\n  fill(255, 100, 100);\n  arc(200, 200, 280, 280, TWO_PI / 3, (4 * PI) / 3);\n  fill(100, 200, 100);\n  arc(200, 200, 280, 280, (4 * PI) / 3, TWO_PI);\n}"
    },
    {
      id: "exercise-10",
      title: "Target Practice",
      module: "Shapes",
      description: "Use ellipseMode() to control how ellipses are positioned.",
      instruction: "The ellipseMode() function changes how ellipse() interprets its first two parameters. Draw three target rings — first set ellipseMode(CENTER) (default) and draw a ring centered at (200, 200), then switch to ellipseMode(CORNER) and draw another ring whose top-left corner starts at (200, 200). Observe how the position changes.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(40);\n  noStroke();\n  fill(255, 100, 100, 150);\n  ellipseMode(CENTER);\n  ellipse(200, 200, 120, 120);\n  fill(100, 200, 255, 150);\n  ellipseMode(CORNER);\n  ellipse(200, 200, 120, 120);\n  fill(255, 220, 100, 150);\n  ellipseMode(CENTER);\n  ellipse(200, 200, 40, 40);\n}"
    },
    {
      id: "exercise-11",
      title: "Alignment",
      module: "Shapes",
      description: "Compare rectMode(CENTER) vs rectMode(CORNER) to understand positioning.",
      instruction: "Use rectMode() to change how rect() is positioned. Draw two squares side by side at the same coordinate (200, 150). The first should use rectMode(CENTER) so the square is centered at that point. The second should use rectMode(CORNER) so its top-left corner starts there. Make them different colors with semi-transparency.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  noStroke();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(30);\n  noStroke();\n  fill(255, 100, 150, 180);\n  rectMode(CENTER);\n  rect(200, 150, 100, 100);\n  fill(100, 200, 255, 180);\n  rectMode(CORNER);\n  rect(200, 150, 100, 100);\n}"
    },
    {
      id: "exercise-12",
      title: "Line Weight",
      module: "Shapes",
      description: "Combine strokeWeight() with shapes to add depth and emphasis.",
      instruction: "Use strokeWeight() to control border thickness. Draw three concentric circles of different sizes with varying stroke weights: the outermost circle should have the thickest stroke and the innermost the thinnest. Use noFill() so only the outlines are visible. Set different stroke colors for each ring.",
      startingCode: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(20);\n  noFill();\n}",
      solution: "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(20);\n  noFill();\n  stroke(255, 100, 100);\n  strokeWeight(12);\n  circle(200, 200, 250);\n  stroke(100, 200, 255);\n  strokeWeight(8);\n  circle(200, 200, 170);\n  stroke(255, 220, 100);\n  strokeWeight(4);\n  circle(200, 200, 90);\n}"
    },
  ]
};

export type Course = typeof shapesCourse;
