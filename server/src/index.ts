
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import { parse } from "@msrvida/python-program-analysis"
import { Application } from '../model/Application';
import { Code } from '../model/Code';

const app: express.Application = express();

app.use(express.json({type: 'json'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(fileUpload());

let application = Application.instance();
const files = []

const sampleCode = [
  'x, y = 0, 0',
  'while x < 10:',
  '   y += x * 2',
  '   x += 1',
  'print(y)'
];

const code = new Code(sampleCode.join('\n'));

files.push(parse(code.getCode())); 

const todos = [
  { title: files[0].code[0].type }
];

app.get('/todo', (req, res) => {
  res.status(200).send(todos);
});

app.post('/todo', (req, res) => {
  console.log(req.body);
  const todo = req.body.todo;
  todos.push(todo);
  res.status(200).send(todos);
});

app.delete('/todo', (req, res) => {
  const todo = req.query.todo || '';
  const index = todos.findIndex((existingTodo) =>  existingTodo.title === todo); 
  if(index > -1) {
    todos.splice(index, 1);
    res.status(200).send(todos);
  } else {
    res.status(500).send('Todo not found');
  }

});

// Route for file upload
app.post('/file', (req, res) => {
  let file = req.files.myFile.data.toString()
  console.log(file);
  files.push(parse(file));

  res.status(200).send("File uploaded successfully");
});

/* 
  Catch all route which matches any type of request on any route.
  Returns 404 not found.

  IMPORTANT: Express routes are checked sequentially and and first matching handlers is the one to respond.
             Always keep this last or all requests will result in a 404 error.

*/
app.all('*', (req, res) => {
  res.status(404).send('Not Found!')
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server running on localhost:${port}/`);
});


