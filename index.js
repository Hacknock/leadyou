// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongo = require('mongodb'); // momgodb define
const MongoClient = mongo.MongoClient; // use mongo client

const port=3000;

server.listen(port, () => {
    console.log('listen port 3000 #00');
});

const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

function insertData(jsonData) {
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption, (err, client) => {
        if (err) {
            console.log('Error occurred #01');
            throw err;
        } else {
            console.log('Database connection is established on insert data process. #02');
            const db = client.db('pullreqme'); // Get pullreqme database
            db.collection('dbSearch', (err, collection) => {
                collection.find({idGithub: jsonData.idGithub}).toArray((err, items) => {
                    console.log(items.length);
                    if (items.length == 0) {
                        console.log();
                    } else {

                    }
                });
            });
        }
    });
}

const jsonInsert = {
    idGithub: 'hai',
    nameUser: '',
    desc: '',
    linkFB: '',
    linkTw: '',
    linkLinked: '',
    linkYoutube: '',
    linkWeb: '',
    langProgram: '',
    liFr: '',
    enviro: '',
    skills: '',
    qualifi: '',
    termComp: '',
    nameComp: '',
    termEdu: '',
    nameEdu: '',
    projects: '',
    distr: '',
    namePub: '',
};

insertData(jsonInsert);

app.get('/src/css/*', (req, res) => {
    fs.readFile('./public/css/' + req.params[0], 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
    });
});

app.get('/src/js/*', (req, res) => {
    fs.readFile('./public/js/' + req.params[0], 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
    });
});

// img file rooting
app.get('/src/img/*', function(req, res) {
    console.log(req.params[0]);
    const buf = fs.readFileSync('./public/img/'+ req.params[0]);
    res.send(buf, {'Content-Type': 'image'}, 200);
});
