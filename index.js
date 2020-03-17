// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const express = require('express');
const app = express();
const http = require('http');
var server = http.createServer(app);
const mongo = require('mongodb');   //momgodb define
const MongoClient = mongo.MongoClient;  //use mongo client

const port=3000;

server.listen(port, ()=>{
    console.log('listen port 3000')
});

var jsonInsert = {
    idGithub: '',
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