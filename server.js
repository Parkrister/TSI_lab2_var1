const http = require("http");
const url = require("url");
const fs = require("fs");

///
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
///
app.set("view engine", "hbs");

const DATA = require('./data_json.json');

app.get("/", function(request, response){ 
    console.log('connect');
    response.render("test.hbs", {
        DATA : DATA,
        RESULT: `disabled`,
    });
});

function check(QUESTIONS, ANSWERS){
    for(let i = 0; i < Object.keys(ANSWERS.answers).length;i++){
        flag = QUESTIONS[i].answers[ANSWERS.answers[i]].correct;
        if(flag == 'false'){
            return false;
        }
    }
    return true;
}

app.get("/:name", function(request, response){ 
    if(request.params.name === 'favicon.ico'){
        response.render("test.hbs", {
            DATA : DATA,
            RESULT: `disabled`,
        });    
    }
    else{
        console.log('name : ', request.params.name);
        try {
            var res = JSON.parse(fs.readFileSync(`results/${request.params.name}.json`, 'utf8'));
        } catch(err) {
            response.send('No result');
        }
        let flag = check(DATA, res);
        response.render("test.hbs", {
            DATA : DATA,
            LOGIN: `LOGIN : ${request.params.name}`,
            RESULT: flag
        });
    }
});

app.post("/result", function (req, res) {
    fs.writeFile(`results/${req.body.login}.json`, JSON.stringify(req.body), function(err){
        if(err) throw err;
        console.log(req.body, ' result:', check(DATA, JSON.parse(JSON.stringify(req.body))));
    });
});

app.listen(3000);