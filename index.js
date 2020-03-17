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
const bodyParser = require('body-parser');
const ejs = require('ejs');

const port = 3000;

server.listen(port, () => {
    console.log('listen port 3000 #00');
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

function insertData(jsonData) {
    const nameDb = 'pullreqme';
    const nameCollection = 'dbSearch';
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption, (err, client) => {
        if (err) {
            console.log('Error occurred #01');
            throw err;
        } else {
            console.log('Database connection is established on insert data process. #02');
            const db = client.db(nameDb);  //Get pullreqme database

            findData(db, nameCollection, {idGithub: jsonData.idGithub}, (items) => {
                console.log(items.length);
                if (items.length == 0) {
                    console.log('No data. #03');
                    insertDocuments(db, nameCollection, jsonData, () => {
                        client.close();
                    });
                } else {
                    console.log('Data has been existed. #04');
                    console.log(jsonData.idGithub);
                    deleteData(db, nameCollection, {idGithub: jsonData.idGithub}, (result) => {
                        insertDocuments(db, nameCollection, jsonData, () => {
                            client.close();
                        });
                    });
                }
            });
        }
    });
}

// This function insert new search info document to database(database, collection, document, callback)
const insertDocuments = (db, coll, document, callback) => {
    db.collection(coll).insertOne(document, (err, result) => {
        if (err) {
            console.log('error occurred #05');
            throw err;
        } else {
            console.log('success to insert documents #06');
            callback(result);
        }
    });
};

// This function delete data from database with especially key (database, collection, key, callback)
const deleteData = (db, coll, key, callback) => {
    db.collection(coll).deleteMany(key, (err, result) => {
        if (err) {
            console.log('Error occurred on delete many. #07');
            throw err;
        } else {
            console.log('success to delete many. #08');
            callback(result);
        }
    });
};

// This function find data from database with especially key (database, collection, key, callback)
const findData = (db, coll, key, callback) => {
    db.collection(coll).find(key).toArray((err, items) => {
        if (err) {
            console.log('Error occurred on finding documents. #09');
            throw err;
        } else {
            console.log('Success to find documents with key. #10');
            callback(items);
        }
    });
};

let jsonInsert = {
    idGithub: 'wan',
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
    namePub: ''
};

insertData(jsonInsert);

app.get('/', (req, res) => {
    fs.readFile('./public/html/index.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

app.post('/search/result', (req, res) => {
    console.log(req.body);
    fs.readFile('./public/html/index.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

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
    const buf = fs.readFileSync('./public/img/' + req.params[0]);
    res.send(buf, {'Content-Type': 'image'}, 200);
});
