
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import Application from '../model/Application';
import Code from '../model/Code';
import User from '../model/User';
import { use } from 'chai';
import Folder from '../model/Folder';
import IFile from '../model/IFile';
import IComparison from '../model/IComparison';
import SummaryComparison from '../model/SummaryComparison';

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

const todos = [
  { title: application.getCurrentUser().getFiles()[0].getCode().type }
];

let file1, file2, folder1, folder2, folder3;

// file1 = new Code("code.py", "x = 1");
file1 = code
file2 = new Code("index.py", "x = 2");

folder2 = new Folder("Subfolder", [file1]);
folder1 = new Folder("Folder", [folder2, file2]);
folder3 = new Folder("Folderr", [folder2]);

application.upload(folder1);
application.upload(folder2);
application.upload(folder3);
application.upload(file1);
application.upload(file2);

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

// Register Route
app.post('/register', (req, res) => {
  let user = new User(req.body.username, req.body.password);

  try {
    application.register(user);
  } catch (error) {
    res.status(500).send(error);
    return
  }

  res.status(200).send("Registration Successful")
});

// Login Route
app.post('/login', (req, res) => {
  let name = req.body.username;
  // TODO: Add password verification
  let user = application.getUsers().get(name);
  
  if (user === undefined) {
    res.status(500).send("User not found");
  } else {
    application.setCurrentUser(user);
    res.status(200).send("Registration Successful");
  }
});

// Route for getting all files
app.get('/file', (req, res) => {
  let files = application.getCurrentUser().getFiles();
  let output: Array<Object> = [];
  files.forEach((file) => output.push({ "name": file.getName(), "id": file.getID }));
  const out = { files: output };
  res.status(200).send(out);
});

// Route for file upload
// Possible TODO: Add date/time of upload
app.post('/file', (req, res) => {
  let file = req.files.myFile.data.toString();
  let name = req.files.myFile.name.toString();

  try {
    application.upload(new Code(name, file));
  } catch (error) {
    res.status(500).send("Python file has errors");
  }

  res.status(200).send("File uploaded successfully");
});

// Route for getting selected files
app.get('/fileselection', (req, res) => {
  let files = application.getCurrentUser().selectedFiles.getSelectedFiles().values();
  
  let out = { "file1": files.next().value, "file2": files.next().value }
  res.status(200).send(out);
});

// Route for selecting files
app.post('/fileselection', (req, res) => {
  const files = application.getCurrentUser().getFiles();
  // TODO: Check if the request files are the same name
  let file1: IFile, file2: IFile;
  files.forEach((file) => {
    let name = file.getName()
    if (name === req.body.file1) {
      file1 = file;
    } else if (name === req.body.file2) {
      file2 = file;
    }
  });

  if(file1 !== undefined && file2 !== undefined) {
    application.selectFiles(file1, file2);
    res.status(200).send("Files selected successfully");
  } else {
    res.status(500).send("One or more files were not found");
  }
});

app.get('/comparison', (req, res) => {
  let files = application.getCurrentUser().selectedFiles.getSelectedFiles().values();
  let file1 = files.next().value;
  let file2 = files.next().value;

  let summaries = application.getCurrentUser().getComparisons();

  let comparison: SummaryComparison;
  // Search the summary comparisons 
  summaries.forEach((summ) => {
    let selFiles = summ.getComparedFiles().getSelectedFiles().values();
    if(file1 === selFiles.next().value && file2 == selFiles.next().value) {
      comparison = summ;
    }
  });

  let comparisons: Object[]
  let out = { "percentage": comparison.getPlagiarismPercentage(), "comparisons": comparisons};
  comparison.getComparisons().forEach((comp) => {
    out.comparisons.push({ "line": 1, "severity": comp.PlagiarismSeverity() }) // TODO: Change response
  })
  res.status(200).send(out);
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


