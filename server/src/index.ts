
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import Application from '../model/Application';
import Code from '../model/Code';
import User from '../model/User';
import { use } from 'chai';
import IComparison from '../model/IComparison';
import SummaryComparison from '../model/SummaryComparison';

const app: express.Application = express();
var cors = require('cors')

app.use(express.json({type: 'json'}));
app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
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


const sampleCode1 = [
  'def arrayMultiply(array, c):',
  '    return [element*c for element in array]',
  'def arraySum(a, b):',
  '    x = a + b',
  '    return x'
  // 'def intermediate(a, b, ratio):',
]

const sampleCode2 = [
  "def add(x, y):",
  "  return x + y",

  "# This function subtracts two numbers",
  "def subtract(x, y):",
  "    return x - y",

  "# This function multiplies two numbers",
  "def multiply(x, y):",
  "    return x * y",
  "# This function divides two numbers",
  "def divide(x, y):",
  "    return x / y",


  'print("Select operation.")',
  'print("1.Add")',
  'print("2.Subtract")',
  'print("3.Multiply")',
  'print("4.Divide")',

  "while True:",
  "    # Take input from the user",
  '    choice = input("Enter choice(1/2/3/4): ")',

  '    # Check if choice is one of the four options',
  "    if choice in ('1', '2', '3', '4'):",
  '        num1 = float(input("Enter first number: "))',
  '        num2 = float(input("Enter second number: "))',

  "        if choice == '1':",
  '            print(num1, "+", num2, "=", add(num1, num2))',

  "        elif choice == '2':",
  '            print(num1, "-", num2, "=", subtract(num1, num2))',

  "        elif choice == '3':",
  '            print(num1, "*", num2, "=", multiply(num1, num2))',

  "        elif choice == '4':",
  '            print(num1, "/", num2, "=", divide(num1, num2))',
  "        break",
  "    else:",
  '        print("Invalid Input")'
]

// const scode = `def arrayMultiply(array, c):
// return [element*c for element in array]

// def arraySum(a, b):
// return map(sum, zip(a,b))

// def intermediate(a, b, ratio):
// aComponent = arrayMultiply(a, ratio)
// bComponent = arrayMultiply(b, 1-ratio)
// return arraySum(aComponent, bComponent)

// def gradient(a, b, steps):
// steps = [n/float(steps) for n in range(steps)]
// for step in steps:
//     print intermediate(a, b, step)

// #print arrayMultiply((1,2,3), 0.3)
// #print arraySum((1,2,3), (0.5, 0.5, 0.5))
// #print intermediate((1,2,3), (3,2,1), 0.5)
// #print gradient(None, None, 5)


// pureBlue = (8, 123, 157)
// pureYellowGreen = (0,84,166)

// gradient(pureBlue, pureYellowGreen, 6)`

const code = new Code("code", sampleCode.join('\n'));
application.upload(code)

const todos = [
  { title: application.getCurrentUser().getFiles()[0].getCode().type }
];

let file1, file2;

// file1 = new Code("code.py", "x = 1");
file1 = new Code("code2.py", sampleCode2.join('\n'));
file2 = new Code("index.py", sampleCode2.join('\n'));

application.upload(file1);
application.upload(file2);

application.selectFiles(file1.getID(), file2.getID());

application.compare();

/*
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
*/

// Register Route
app.post('/register', (req, res) => {
  let user = new User(req.body.username, req.body.password);

  try {
    application.register(user);
  } catch (error) {
    res.status(500).send('Login before uploading files');
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
  res.status(200).send({ "files": getFilesAndSend() });   
});

// Route for file upload
app.post('/file', (req, res) => {
  const uploadedFiles = req.files
  const keys = Object.keys(uploadedFiles);
  for (let i = 0; i < keys.length; i++) {
    let f = uploadedFiles[keys[i]];
    try {
      application.upload(new Code(f.name.toString(), f.data.toString()));
    } catch (error) {
      res.status(500).send("Python file has errors");
    }
  }  

  res.status(200).send({ "files": getFilesAndSend() });  
});

app.delete('/file', (req, res) => {
  const id = req.query.file.toString();
  
  try {
    application.getCurrentUser().removeFile(id);

    res.status(200).send({ "files": getFilesAndSend() });    

  } catch (error) {
    res.status(500).send("File not found");
  }
});

function getFilesAndSend(): Array<Object> {
  let files = application.getCurrentUser().getFiles();

  let output: Array<Object> = [];
  files.forEach((file) => output.push({ "name": file.getName(), "id": file.getID(), "date": file.getDate() }));
  return output;
}

// Route for getting selected files
app.get('/fileselection', (req, res) => {
  let files = application.getCurrentUser().selectedFiles.getSelectedFiles().values();
  
  let out = { "file1": files.next().value, "file2": files.next().value }
  res.status(200).send(out);
});

// Route for selecting files
app.post('/fileselection', (req, res) => {
  const files = application.getCurrentUser().getFiles();
  const file1 = req.body.file1;
  const file2 = req.body.file2;
  if (file1 === file2) {
    res.status(500).send("Files selected are the same");
    return
  }

  try {
    application.selectFiles(file1, file2);
    res.status(200).send("");
  } catch (error) {
    res.status(500).send("One or more files were not found");
  }    
});

// Route for getting the comparison related to the current selection
app.get('/comparison', (req, res) => {
  let files = application.getCurrentUser().selectedFiles.getSelectedFiles().values();
  let file1: Code = files.next().value;
  let file2: Code = files.next().value;

  let summaries = application.getCurrentUser().getComparisons();

  let comparison: SummaryComparison;
  // Search the summary comparisons for matching comparison, TODO: Use IDs
  summaries.forEach((s) => {
    let selFiles = s.getComparedFiles().getSelectedFiles().values();
    if(file1 === selFiles.next().value && file2 === selFiles.next().value) {
      comparison = s;
    }
  });

  let comparison1 = comparison.getComparisons()[0];
  let comparison2 = comparison.getComparisons()[1];
  // TODO: Check for errors?

  let response = {
    "file1": file1.getPlainCode(),
    "file2": file2.getPlainCode(),
    "content": { 
      "plagiarism": comparison1.getPlagiarismSeverity(),
      "compare": comparison1.getLines().map((line) => {
        let out = []
        out.push(line[0], line[1], line[2], "?%");
        return out;
      }),
    },
    "textDiff": {
      "plagiarism": comparison2.getPlagiarismSeverity(),
      "compare": comparison2.getLines().map((line) => {
        let out = []
        out.push(line[0], line[1]);
        return out;
      }),
    }
  };

  res.status(200).send(response);
});

app.put('/comparison', (req, res) => {
  let file1: string = req.body.file1;
  let file2: string = req.body.file2;

  try {
    application.selectFiles(file1, file2);
    application.compare();
    
    res.status(200).send({});
  } catch (error) {
    res.status(500).send("Files not valid");
  }
  // TODO: Add response, all history or just one comparison?
});

app.get('/history', (req, res) => {
  res.status(200).send({ "history": getHistoryAndSend() });
});

app.delete('/history', (req, res) => {
  const id = req.query.file.toString();
  
  try {
    application.getCurrentUser().removeComparison(id);
    res.status(200).send({ "files": getHistoryAndSend() });    

  } catch (error) {
    res.status(500).send("File not found");
  }
});

function getHistoryAndSend(): Array<Object> {
  let comparisons = application.getCurrentUser().getComparisons();

  let output: Array<Object> = [];
  comparisons.forEach((comparison) => {
    let iterator = comparison.getComparedFiles().getSelectedFiles().values()
    output.push({ 
      "file1": iterator.next().value.getName(),
      "file2": iterator.next().value.getName(),
      "id": comparison.getID(),
      "date": comparison.getDate(),
      "similarity": "?%" })
  });

  return output;
}

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


