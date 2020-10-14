import { promises as fs } from 'fs';

let allGrades = null;

export async function getAll() {
  if (allGrades == null) {
    allGrades = JSON.parse(
      await fs.readFile('grades.json', { encoding: 'utf-8' })
    );
  }
  return allGrades;
}

export async function write(student, subject, type, value) {
  let grades = await getAll();
  let newGrade = {
    id: grades.nextId++,
    student: student,
    subject: subject,
    type: type,
    value: value,
    timestamp: new Date(),
  };

  grades.grades.push(newGrade);

  await fs.writeFile(
    'grades.json',
    JSON.stringify(grades, null, '\t'),
    'utf-8'
  );

  allGrades = grades;

  return newGrade;
}

export async function update(id, student, subject, type, value) {
  let grades = await getAll();

  let existingGrade = grades.grades.find((grade) => {
    return grade.id == id;
  });

  if (!existingGrade) {
    return null;
  }

  existingGrade.student = student;
  existingGrade.subject = subject;
  existingGrade.type = type;
  existingGrade.value = value;

  await fs.writeFile(
    'grades.json',
    JSON.stringify(grades, null, '\t'),
    'utf-8'
  );

  allGrades = grades;

  return existingGrade;
}

export async function remove(id) {
  let grades = await getAll();

  let newGrades = grades.grades.filter((grade) => {
    return grade.id != id;
  });

  allGrades.grades = newGrades;

  await fs.writeFile(
    'grades.json',
    JSON.stringify(allGrades, null, '\t'),
    'utf-8'
  );
}

export async function getGrade(id) {
  let grades = await getAll();

  let existingGrade = grades.grades.find((grade) => {
    return grade.id == id;
  });

  if (!existingGrade) {
    return null;
  }

  return existingGrade;
}
