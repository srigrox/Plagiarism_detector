
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import Application from '../model/Application';
import Code from '../model/Code';
import User from '../model/User';
import { use } from 'chai';
import Folder from '../model/Folder';

const app: express.Application = express();

app.use(express.json({type: 'json'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(fileUpload());

const application = Application.instance();
let user = new User('username', 'password');
application.register(user)

const sampleCode = [
  'x, y = 0, 0',
  'while x < 10:',
  '   y += x * 2',
  '   x += 1',
  'print(y)'
];
const code = new Code("code", sampleCode.join('\n'));
application.upload(code)

console.log(application.getCurrentUser().getFiles()[0].getCode())

const todos = [
  { title: application.getCurrentUser().getFiles()[0].getCode().type }
];

let file1, file2, folder1, folder2, folder3;

file1 = new Code("code.py", "x = 1");
file2 = new Code("index.py", "x = 2");

folder2 = new Folder("Subfolder", [file1])
folder1 = new Folder("Folder", [folder2, file2])
folder3 = new Folder("Folderr", [folder2]);

application.upload(folder1)
application.upload(folder2)
application.upload(folder3)
application.upload(file1)
application.upload(file2)

application.selectFiles(folder1, folder3);

application.compare();

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
  application.upload(new Code("code", file)); // TODO: Change "Code" to file name

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


