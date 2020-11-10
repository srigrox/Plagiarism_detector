"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// Create express app
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
