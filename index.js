import express from 'express';
import bodyParser from 'body-parser';
import {
  getAll,
  write,
  update,
  remove,
  getGrade,
  getTotalValue,
  getAverageValue,
} from './operations.js';

const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

router.get('/', async (req, res) => {
  res.send(await getAll());
});

router.post('/', async (req, res) => {
  let grade = req.body;
  res.send(await write(grade.student, grade.subject, grade.type, grade.value));
});

router.put('/', async (req, res) => {
  let grade = req.body;
  res.send(
    await update(
      grade.id,
      grade.student,
      grade.subject,
      grade.type,
      grade.value
    )
  );
});

router.delete('/:id', async (req, res) => {
  let id = req.params.id;
  await remove(id);
  res.sendStatus(204);
});

router.get('/:id', async (req, res) => {
  let id = req.params.id;
  let grade = await getGrade(id);

  if (grade) {
    res.send(grade);
  } else {
    res.sendStatus(404);
  }
});

router.get('/:student/:subject', async (req, res) => {
  let student = req.params.student;
  let subject = req.params.subject;
  let total = await getTotalValue(student, subject);

  res.send(total);
});

router.get('/:student/:subject', async (req, res) => {
  let student = req.params.student;
  let subject = req.params.subject;
  let average = await getAverageValue(student, subject);

  res.send(average);
});

app.use(router);

app.listen(8080, () => {
  console.log('API escutando na porta 8080');
});
