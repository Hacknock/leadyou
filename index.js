// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const express = require('express');
const app = express();
const http = require('http');
let server = http.createServer(app);
const mongo = require('mongodb');   //momgodb define
const MongoClient = mongo.MongoClient;  //use mongo client

const port=3000;

server.listen(port, ()=>{
    console.log('listen port 3000 #00');
});

const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

function insertData(jsonData) {
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption,(err, client) =>{
        if(err) {
            console.log('Error occurred #01');
            throw err;
        } else {
            console.log('Database connection is established on insert data process. #02');
            const db = client.db('pullreqme');  //Get pullreqme database
            db.collection('dbSearch', (err, collection)=>{
               collection.find({idGithub: jsonData.idGithub}).toArray((err, items) =>{
                   console.log(jsonData.idGithub);
                   console.log(items.length);
                   if (items.length == 0) {
                        console.log('No data. #03');
                        insertDocuments(db,'dbSearch',jsonData,()=>{
                            client.close();
                        });
                   } else {
                        console.log('Data has been existed. #04');
                        console.log(jsonData.idGithub);
                        db.collection('dbSearch').deleteMany({idGithub: jsonData.idGithub}, (err, result)=>{
                            if(err) {
                                console.log("Failed to delete documents " + jsonData.idGithub);
                                throw err;
                            } else {
                                console.log(result.result.n);
                                insertDocuments(db,'dbSearch',jsonData,()=>{
                                    client.close();
                                });
                            }
                        });
                   }
               });
            });
        }
    });
}

const insertDocuments = (db, coll, document, callback) => {
    db.collection(coll).insertOne(document, (err, result) =>{
        if (err) {
            console.log('error occured');
        } else {
            console.log("success to insert documents");
            callback(result);
        }
    })
};

let jsonInsert =
    {
        idGithub: 'nyao',
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

app.get('/src/css/*', (req, res) => {
    fs.readFile('./public/css/' + req.params[0], 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(data);
        res.end();
    });
});

app.get('/src/js/*', (req, res) => {
    fs.readFile('./public/js/' + req.params[0], 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(data);
        res.end();
    });
});

//img file rooting
app.get('/src/img/*', function(req, res){
    console.log(req.params[0]);
    var buf = fs.readFileSync('./public/img/'+ req.params[0]);
    res.send(buf, { 'Content-Type': 'image' }, 200);
});