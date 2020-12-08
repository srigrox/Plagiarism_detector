
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
application.register(user);

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
  "def add(x, y):",
  "    return x + y"
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

const sampleCode3 = [
  'import pandas as pd',
  'import pygsheets',
  'def create() :',
  '    client = pygsheets.authorize(service_file = "Downloads/client_secret.json")',
  "    sh = client.open('Tracking')",
  '    entry = sh.sheet1',
  '    database = sh.worksheet_by_title("DATABASE")',    
  '    Name = entry.get_col(3)',
  '    Name = Name[8:59]',
  '    Name1 = database.get_col(7)',
  '    a = 0',
  '    for n in Name1 :', 
  '        if(len(n) > 0) :',
  '            a = a + 1',
  '    database.update_col(7, Name, row_offset = a)',
      
  '    Understanding = entry.get_col(4)',
  '    Understanding = Understanding[8:59]',
  '    Understanding1 = database.get_col(8)',
  '    b = 0',
  '    for n in Understanding1 :',
  '        if(len(n) > 0) :',
  '            b = b + 1',
  '    database.update_col(8, Understanding, row_offset = b)',
  '    print(Understanding)',
      
  '    Accuracy = entry.get_col(5)',
  '    Accuracy = Accuracy[8:59]',
  '    Accuracy1 = database.get_col(9)',
  '    c = 0',
  '    for n in Accuracy1 :',
  '        if(len(n) > 0) :',
  '            c = c + 1',
  '    database.update_col(9, Accuracy, row_offset = c)',
  '    print(Accuracy)',
      
  '    Enjoyability = entry.get_col(6)',
  '    Enjoyability = Enjoyability[8:59]',
  '    Enjoyability1 = database.get_col(10)',
  '    d = 0',
  '    for n in Name1 :',
  '        if(len(n) > 0) :',
  "           d = d + 1",
  '    database.update_col(10, Enjoyability, row_offset = d)',
  '    print(Enjoyability)',
      
  '    x = 0',
  '    for n in Name :',
  '        if(len(n) > 0) :',
  '            x = x + 1',
  '    print(x)',
      
  '    listOfStrings1 = [entry.get_value((4,3))] * x',
  '    listOfStrings2 = [entry.get_value((4,5))] * x',
  '    listOfStrings3 = [entry.get_value((4,7))] * x',
  '    listOfStrings4 = [entry.get_value((4,9))] * x',
  '    listOfStrings5 = [entry.get_value((6,5))] * x',
  '    listOfStrings6 = [entry.get_value((6,7))] * x',
      
  '    Date1 = database.get_col(2)',
  '    e = 0',
  '    for n in Date1 :',
  '        if(len(n) > 0) :',
  '            e = e + 1',
  '    database.update_col(2, listOfStrings1, row_offset = e)',
      
  '    Activity1 = database.get_col(4)',
  '    f = 0',
  '    for n in Activity1 :',
  '        if(len(n) > 0) :',
  '            f = f + 1',
  '    database.update_col(4, listOfStrings2, row_offset = f)',
      
  '    Domain1 = database.get_col(5)',
  '    g = 0',
  '    for n in Domain1 :',
  '        if(len(n) > 0) :',
  '            g = g + 1',
  '    database.update_col(5, listOfStrings3, row_offset = g)',
     
  '    Concept1 = database.get_col(6)',
  '    h = 0',
  '    for n in Concept1 :',
  '        if(len(n) > 0) :',
  '            h = h + 1',
  "    database.update_col(6, listOfStrings4, row_offset = h)",
      
  '    Acc1 = database.get_col(1)',
  '    i = 0',
  '    for n in Acc1 :',
  '        if(len(n) > 0) :',
  '            i = i + 1',
  '    database.update_col(1, listOfStrings5, row_offset = i)',
     
  '    Concept_A = database.get_col(3)',
  '    l = 0',
  '    for n in Concept_A :',
  '        if(len(n) > 0) :',
  '            l = l + 1',
  '    database.update_col(3, listOfStrings6, row_offset = l)',
      
  "    lis = ['' for i in range(50)]",
  '    entry.update_col(3, lis, row_offset = 8)',
  '    entry.update_col(4, lis, row_offset = 8)',
  '    entry.update_col(5, lis, row_offset = 8)',
  '    entry.update_col(6, lis, row_offset = 8)',
      
  "    entry.update_value((4,5), '')",
  "    entry.update_value((4,7), '')",
  "    entry.update_value((4,9), '')",
  "    entry.update_value((6,5), '')",
  "    entry.update_value((6,7), '')",
  
  'create()',
]

const sampleCode4 = [
"def avg(marks):",
"  assert len(marks) != 0",
"  return sum(marks)/len(marks)",

"mark1 = []",
'print("Average of mark1:",avg(mark1))',
]

const sampleCode5 = [
'class MyClass:',
'  x = 5',
]

const code = new Code("code", sampleCode.join('\n'));
//application.upload(code)

let file1, file2;

// file1 = new Code("code.py", "x = 1");
file1 = new Code("code2.py", sampleCode3.join('\n'));
file2 = new Code("index.py", sampleCode3.join('\n'));

//application.upload(file1);
//application.upload(file2);

//application.selectFiles(file1.getID(), file2.getID());

//application.compare();

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
  let files = application.getCurrentUser().getSelectedFiles().getSelectedFiles().values();
  
  let out = { "file1": files.next().value, "file2": files.next().value }
  res.status(200).send(out);
});

// Route for selecting files
app.post('/fileselection', (req, res) => {
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
  let files = application.getCurrentUser().getSelectedFiles().getSelectedFiles().values();
  let file1: Code = files.next().value;
  let file2: Code = files.next().value;
  
  let summaries = application.getCurrentUser().getComparisons();

  let comparison: SummaryComparison;
  // Search the summary comparisons for matching comparison
  summaries.forEach((s) => {
    let selFiles = s.getComparedFiles().getSelectedFiles().values();
    let id1 = selFiles.next().value.getID()
    let id2 = selFiles.next().value.getID()
    if(file1.getID() === id1 && file2.getID() === id2) {
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
        out.push(line[0][0], line[0][1], line[1][0], line[1][1], line[2], "?%");
        return out;
      }),
    },
    "textDiff": {
      "plagiarism": comparison2.getPlagiarismSeverity(),
      "compare": comparison2.getLines().map((line) => {
        let out = []
        out.push(line[0][0], line[0][1], line[1][0], line[1][1]);
        return out;
      }),
    }
  };

  res.status(200).send(response);
});

app.post('/comparison', (req, res) => {
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
    res.status(200).send({ "history": getHistoryAndSend() });    

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
      "similarity": `${Math.round(comparison.getComparisons()[0].getPlagiarismSeverity())}%/${Math.round(comparison.getComparisons()[1].getPlagiarismSeverity())}%` })
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

module.exports = app; // for testing API