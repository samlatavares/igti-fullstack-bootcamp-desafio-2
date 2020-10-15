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

export async function getTotalValue(student, subject) {
  let grades = await getAll();
  let soma = 0;

  grades.grades.forEach((grade) => {
    if (grade.subject === subject && grade.student === student) {
      soma += grade.value;
    }
  });

  return { total: soma };
}

export async function getAverageValue(student, subject) {
  let grades = await getAll();
  let sum = 0;
  let count = 0;

  grades.grades.forEach((grade) => {
    if (grade.subject === subject && grade.student === student) {
      sum += grade.value;
      count++;
    }
  });

  let average = 0;

  if (count > 0) {
    average = sum / count;
  }
  return { average: average };
}

export async function getTopThree(subject, type) {
  let grades = await getAll();
  let topThree = [];

  let filteredGrade = grades.grades.filter((grade) => {
    return grade.subject === subject && grade.type === type;
  });

  filteredGrade.sort((a, b) => {
    return b.value - a.value;
  });

  topThree = filteredGrade.slice(0, 3);

  return topThree;
}
