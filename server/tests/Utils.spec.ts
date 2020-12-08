import { expect } from 'chai';
import { text } from 'express';
import Code from '../model/Code';
import SelectedFiles from '../model/SelectedFiles';
// import TextualDiff from '../model/TextualDiff';
import User from '../model/User';
import { compare, compareAlgorithm, compareFiles, textualDiff } from '../model/Utils';

describe('Plagiarism algorithm Tests', () => {

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



    let file1 : Code = new Code("code2.py", sampleCode2.join('\n'));
    let file2 : Code = new Code("code2.py", sampleCode1.join('\n'));

    let file3 : Code = new Code("code2.py", sampleCode3.join('\n'));
    let file4 : Code = new Code("code2.py", sampleCode3.join('\n'));

    let file5 : Code = new Code("code2.py", sampleCode4.join('\n'));
    let file6 : Code = new Code("code2.py", sampleCode5.join('\n'));

    let selectedFiles1 = new SelectedFiles(file1, file2)

    let selectedFiles2 = new SelectedFiles(file3, file4)

    let selectedFiles3 = new SelectedFiles(file1, file4)

    let selectedFiles5 = new SelectedFiles(file5, file6)

    let selectedFiles4 = new SelectedFiles(file6, file6)

    let selectedFiles6 = new SelectedFiles(file5, file5)

    // let selectedFiles4 = new SelectedFiles(file1, file2)

    describe('textual diff', () => {

        let td = textualDiff(file1, file2);
        let td1 = textualDiff(file3, file4)
        let td2  = textualDiff(file1, file4)
        let td3 = textualDiff(file4, file5)
        let td4 = textualDiff(file5, file5)
        let td5 = textualDiff(file4, file4)

        it('Check for plagiarised line numbers', () => {
            expect(td["Line numbers"]).to.eql([[0,1,2,3]]);
        });

        it('Check for plagiarised percentage', () => {
            expect(td["Plagarised"]).to.equal(5.88235294117647);
        });

        it('Check for plagiarised line numbers same files', () => {
            expect(td1["Line numbers"].length).to.equal(21);
        });

        it('Check for plagiarised line numbers same files', () => {
            expect(td1["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(td2["Line numbers"].length).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(td2["Plagarised"]).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(td3["Plagarised"]).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(td4["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(td5["Plagarised"]).to.equal(100);
        });


    });

    describe('content difference', () => {
        let cd = compareFiles(file2, file2);
        let cd1 = compareFiles(file3, file4)
        let cd2  = compareFiles(file1, file4)
        let cd3 = compareFiles(file4, file5)
        let cd4 = compareFiles(file5, file5)
        let cd5 = compareFiles(file4, file4)

        it('Check for plagiarised line numbers', () => {
            expect(cd["Line numbers"]).to.eql([[[2,4], [2,4], "def"]]);
        });

        it('Check for plagiarised percentage', () => {
            expect(cd["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers same files', () => {
            expect(cd1["Line numbers"].length).to.equal(4);
        });

        it('Check for plagiarised line numbers same files', () => {
            expect(cd1["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(cd2["Line numbers"].length).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(cd2["Plagarised"]).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(cd3["Plagarised"]).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(cd4["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(cd5["Plagarised"]).to.equal(100);
        });
    });

    describe('main function result', () => {
        let md = compareAlgorithm(selectedFiles1)
        let md1 = compareAlgorithm(selectedFiles2)
        let md2 = compareAlgorithm(selectedFiles3)
        // let md3 = compareAlgorithm(selectedFiles4)
        let md4 = compareAlgorithm(selectedFiles5)
        // let md5 = compareAlgorithm(selectedFiles6)
        
        it('Check for plagiarised line numbers', () => {
            expect(md["textual diff"]["Plagarised"]).to.eql(5.88235294117647);
        });

        it('Check for plagiarised percentage', () => {
            expect(md["content_check"]["Plagarised"]).to.equal(5.555555555555555);
        });

        it('Check for plagiarised line numbers same files', () => {
            expect(md1["textual diff"]["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers same files', () => {
            expect(md1["content_check"]["Plagarised"]).to.equal(100);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(md2["textual diff"]["Plagarised"]).to.equal(0);
        });

        it('Check for plagiarised line numbers different files', () => {
            expect(md2["content_check"]["Plagarised"]).to.equal(0);
        });

        // it('Check for plagiarised line numbers different files', () => {
        //     expect(md3["content_check"]["Plagarised"]).to.equal(0);
        // });

        it('Check for plagiarised line numbers different files', () => {
            expect(md4["content_check"]["Plagarised"]).to.equal(0);
        });

        // it('Check for plagiarised line numbers different files', () => {
        //     expect(md5["content_check"]["Plagarised"]).to.equal(100);
        // });
    });

    
});