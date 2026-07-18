import yaml from 'yaml';
import fs from 'fs';
import path from 'path';

export class YamlCourseParser {
  constructor() {}

  parseYamlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.parse(content);
  }

  validateCourseSchema(course) {
    if (!course.slug) throw new Error('Course must have a slug');
    if (!course.title) throw new Error('Course must have a title');
    if (!course.exercises || !Array.isArray(course.exercises)) throw new Error('Course must have exercises');

    for (let i = 0; i < course.exercises.length; i++) {
      const ex = course.exercises[i];
      if (!ex.id) throw new Error(`Exercise at index ${i} must have an id`);
      if (!ex.title) throw new Error(`Exercise ${ex.id} must have a title`);
      if (!ex.tasks || !Array.isArray(ex.tasks)) throw new Error(`Exercise ${ex.id} must have tasks`);

      for (let j = 0; j < ex.tasks.length; j++) {
        const task = ex.tasks[j];
        if (!task.id) throw new Error(`Task ${j} in exercise ${ex.id} must have an id`);
        if (!task.validation || !Array.isArray(task.validation)) throw new Error(`Task ${task.id} in exercise ${ex.id} must have validation rules`);

        for (let k = 0; k < task.validation.length; k++) {
          const rule = task.validation[k];
          if (!rule.type) throw new Error(`Validation rule at index ${k} in task ${task.id} must have a type`);
          if (rule.type === 'functionCall' && !rule.name) throw new Error(`FunctionCall rule at index ${k} in task ${task.id} must have a name`);
          if (rule.type === 'pixelMatch') {
            if (rule.expected && rule.expected.length !== 3) throw new Error(`PixelMatch rule at index ${k} in task ${task.id} must have expected [r,g,b]`);
          }
        }
      }
    }

    return true;
  }

  transformToTypeScript(course, outputPath) {
    const tsContent = `// DO NOT EDIT — generated from YAML
// Source: src/data/courses/${course.slug}.yaml
import type { Course } from "../data/types";

export const ${course.slug}Course: Course = ${JSON.stringify(course, null, 2)};
`;

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, tsContent, 'utf8');
    return outputPath;
}

export async function loadAllCourses() {
  const coursesDir = path.join(__dirname, '../data/courses');
  const files = fs.readdirSync(coursesDir);

  const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
  const courses = [];

  for (const file of yamlFiles) {
    const coursePath = path.join(coursesDir, file);
    const course = new YamlCourseParser().parseYamlFile(coursePath);
    new YamlCourseParser().validateCourseSchema(course);
    courses.push(course);
  }

  return courses;
}

export async function loadCourseBySlug(slug) {
  const courses = await loadAllCourses();
  return courses.find(course => course.slug === slug) || null;
}