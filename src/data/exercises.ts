export interface Course {
  id: string;
  title: string;
  exerciseIds: string[];
  completedIds: string[];
}

export interface Exercise {
  id: string;
  courseId: string;
  title: string;
  description: string;
  previewImage?: string;
  initialCode: string;
  tokens: string[];
}

export const courses: Course[] = [
  {
    id: "intro",
    title: "Introduction",
    exerciseIds: ["geometric-abstraction"],
    completedIds: [],
  },
];

const initialCode = `function setup() {
  createCanvas(400, 400);
  background(255);
  noLoop();
}

function draw() {
  stroke(0, 50);
  noFill();
  
  for(let i = 0; i < 100; i++) {
    push();
    translate(width / 2, height / 2);
    rotate(random(TWO_PI));
    line(0, 0, random(100, 200), 0);
    pop();
  }
}`;

const exercises: Record<string, Exercise> = {
  "geometric-abstraction": {
    id: "geometric-abstraction",
    courseId: "intro",
    title: "Geometric Abstraction",
    description:
      "Create a dynamic composition using nested loops. Experiment with blending modes and stroke weights to achieve an intricate, layered aesthetic reminiscent of technical sketches.",
    previewImage:
      "https://lh3.googleusercontent.com/aida/AP1WRLsMY_8QnbJ1sSM6BNNuVQjx_-Ot3VCamgcAi9wQGvmuy2Vmbg8eDEx4mh4dkYiYURzGf9shDtVZErghuP0ANo2cWGdAxkA5ugwOjwhHVaB-VHjtUzjAsPEo1Vyhsu9JDVtoVkc6nbfE525Plj2ytoL3A8AcA1s-Fwn2j48ixBGYuPFFPG1aAWjyphxVC0_xHC5BQNqgBPnvy1W-2LJ8o_QkFUFNRgeD-KZ1N57R9qzbgusXenSzXlrJQ1s",
    initialCode,
    tokens: ["function", "for", "push()", "pop()", "translate()"],
  },
};

export function getCourses(): Course[] {
  return courses;
}

export function getExercise(
  courseId: string,
  exerciseId: string
): Exercise | undefined {
  const exercise = exercises[exerciseId];
  if (exercise && exercise.courseId === courseId) {
    return exercise;
  }
  return undefined;
}

export function getExercisesByCourse(courseId: string): Exercise[] {
  const course = courses.find((c) => c.id === courseId);
  if (!course) return [];
  return course.exerciseIds
    .map((id) => exercises[id])
    .filter((e): e is Exercise => e !== undefined);
}
