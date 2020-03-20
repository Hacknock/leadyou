// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const express = require('express');
const http = require('http');
const request = require('request');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const mongo = require('mongodb'); // momgodb define
const MongoClient = mongo.MongoClient; // use mongo client
const bodyParser = require('body-parser');
const ejs = require('ejs');
const config = require('config');

const port = 3000;

server.listen(port, () => {
    console.log('listen port 3000 #00');
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// test code
// crawlingPortfolio();

const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

function crawlingPortfolio() {
    const options = {
        url: 'https://api.github.com/repos/pullreq-me/portfolio/forks',
        method: 'GET',
        json: true,
        headers: {
            'User-Agent': 'request'
        }
    };
    request(options, (error, response, json) => {

        for (let i = 0; i < Object.keys(json).length; i++) {
            let idGithub = json[1]['owner']['login'];
            let userPath = json[i]['full_name'];
            getUserPortfolio(idGithub, userPath);
        }
    });
}

function getUserPortfolio(idGithub, userPath) {
    const options = {
        url: `https://api.github.com/repos/${userPath}/contents/README.md`,
        method: 'GET',
        json: true,
        headers: {
            'User-Agent': 'request'
        }
    };
    request(options, (error, response, json) => {
        const content = Buffer.from(json['content'], 'base64').toString();
        let data = {idGithub: idGithub};
        data = Object.assign(data, parseUserPortfolio(content));
        console.log(data);
        insertData(data);
    });
}

function parseUserPortfolio(content) {
    let data = {nameUser: 'Unknown', desc: 'No description'};
    let result = content.split(/(?<=\n)(?=# )/).filter(value => {
        return value.startsWith('# ');
    });
    if (0 == result.length) return;
    result = result[0].split(/(?<=\n)(?=## )/);
    for (let value of result) {
        if (value.startsWith('# ')) { // overview
            data = Object.assign(data, parseOverview(value));
        } else if (value.startsWith('## Programming Languages')) {
            data = Object.assign(data, {langProgram: parseTags(value)});
        } else if (value.startsWith('## Frameworks / Libraries')) {
            data = Object.assign(data, {liFr: parseTags(value)});
        } else if (value.startsWith('## Environments')) {
            data = Object.assign(data, {enviro: parseTags(value)});
        } else if (value.startsWith('## Other Skills')) {
            data = Object.assign(data, {skills: parseTags(value)});
        } else if (value.startsWith('## Qualifications')) {
            data = Object.assign(data, {qualifi: parseTags(value)});
        } else if (value.startsWith('## Job Experience')) {
            data = Object.assign(data, parseJobExperience(value));
        } else if (value.startsWith('## Education')) {
            data = Object.assign(data, parseEducation(value));
        } else if (value.startsWith('## Projects')) {
            data = Object.assign(data, {projects: parseTitles(value)});
        } else if (value.startsWith('## Distributions')) {
            data = Object.assign(data, {distr: parseTitles(value)});
        } else if (value.startsWith('## Publications')) {
            data = Object.assign(data, {namePub: parseTitles(value)});
        }
    }
    return data;
}

function parseOverview(content) {
    let data = {};
    let result = content.split(/\n/g).filter(value => {
        return (value.length !== 0) && (value !== '***');
    });
    let nameUser = '';
    let desc = '';
    for (let value of result) {
        if (value.startsWith('# ')) {
            nameUser = value.replace(/# /, '');
        } else if (value.startsWith('[<img')) {
            let url = value.match(/.+id="(.+)" src.+\((.+)\)/);
            if (url === null) continue;
            switch (url[1]) {
                case 'website':
                    Object.assign(data, {linkWeb: url[2]});
                    break;
                case 'facebook':
                    Object.assign(data, {linkFB: url[2]});
                    break;
                case 'twitter':
                    Object.assign(data, {linkTw: url[2]});
                    break;
                case 'linkedin':
                    Object.assign(data, {linkLinked: url[2]});
                    break;
                case 'youtube':
                    Object.assign(data, {linkYoutube: url[2]});
                    break;
            }
        } else {
            desc += value;
        }
    }
    data = Object.assign(data, {nameUser: nameUser, desc: desc});
    return data;
}

function parseTags(content) {
    let tags = content.split(/\n/g).filter(value => {
        return (value.length !== 0) && !(value.startsWith('## '));
    }).flatMap(value => {
        return value.match(/`[^`]+` */g);
    }).map(value => {
        return value.replace(/` */g, '');
    }).filter(value => {
        return (value.length !== 0);
    });
    return tags;
}

function parseTitles(content) {
    let titles = content.split(/\n/g).filter(value => {
        return value.startsWith('### ');
    }).map(value => {
        return value.replace(/### /, '');
    }).filter(value => {
        return (value.length !== 0);
    });
    return titles;
}

function parseJobExperience(content) {
    let result = content.split(/(?<=\n)(?=### )/).filter(value => {
        return value.startsWith('### ');
    });
    let termComp = [];
    let nameComp = [];
    for (let i in result) {
        termComp.push('');
        nameComp.push('');
        let lines = result[i].split(/\n/g).filter(value => {
            return (value.length !== 0);
        });
        for (let line of lines) {
            if (line.startsWith('### ')) {
                let term = line.match(/\*([^*]+)\*/);
                if (term) {
                    termComp[i] = term[1];
                }
            } else if (line.startsWith('**')) {
                let name = line.match(/\*\*([^*]+)\*\*/);
                if (name) {
                    nameComp[i] = name[1];
                }
            }
        }
    }
    if (0 < termComp.length) {
        return {termComp: termComp, nameComp: nameComp};
    }
    return {};
}

function parseEducation(content) {
    let result = content.split(/(?<=\n)(?=### )/).filter(value => {
        return value.startsWith('### ');
    });
    let termEdu = [];
    let nameEdu = [];
    for (let i in result) {
        termEdu.push('');
        nameEdu.push('');
        let lines = result[i].split(/\n/g).filter(value => {
            return (value.length !== 0);
        });
        for (let line of lines) {
            if (line.startsWith('### ')) {
                let term = line.match(/\*([^*]+)\*/);
                if (term) {
                    termEdu[i] = term[1];
                }
            } else {
                let name = line.match(/> (.+)/);
                if (name) {
                    nameEdu[i] += name[1];
                }
            }
        }
    }
    if (0 < termEdu.length) {
        return {termEdu: termEdu, nameEdu: nameEdu};
    }
    return {};
}

function insertData(jsonData) {
    const nameDb = 'pullreqme';
    const nameCollection = 'dbSearch';
    const url = 'mongodb://127.0.0.1:27017';
    MongoClient.connect(url, connectOption, (err, client) => {
        if (err) {
            console.log('Error occurred #01');
            throw err;
        }
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
                deleteData(db, nameCollection, {idGithub: jsonData.idGithub}, () => {
                    insertDocuments(db, nameCollection, jsonData, () => {
                        client.close();
                    });
                });
            }
        });
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

// Search user function by search window
const search = (bodyReq, callback) => {
    // make json format to search user
    let keywords = bodyReq.split(' ');
    let jsonSearch = {};
    let qu = new Array();
    for (var i = 0; i < keywords.length; i++) {
        if (keywords[i].indexOf('lang:') === 0) {
            // OR search
            let listLang = keywords[i].split(':')[1];
            listLang = listLang.split(',');
            for (var j = 0; j < listLang.length; j++) {
                let jsonSt = {};
                jsonSt.langProgram = listLang[i];
                qu.push(jsonSt);
            }
        } else {
            let jsonSt = {};
            jsonSt = Object.assign(jsonSt, {nameUser: new RegExp(keywords[i])});
            qu.push(jsonSt);
        }
    }
    jsonSearch = Object.assign(jsonSearch, {$or: qu});
    // console.log('jsonSearch is ' + JSON.stringify(jsonSearch));
    const nameDb = 'pullreqme';
    const nameCollection = 'dbSearch';
    MongoClient.connect('mongodb://127.0.0.1:27017', connectOption, (err, client) => {
        if (err) {
            console.log('Error occured.');
            throw err;
        } else {
            console.log('Database connection is established on insert data process.');
            const db = client.db(nameDb);  //Get pullreqme database
            findData(db, nameCollection, jsonSearch, (items) => {
                console.log(items.length);
                // verification of programming language
                verifyLang(items, jsonSearch.langProgram, (result) => {
                    client.close();
                    callback(result);
                });
            });
        }
    });
};

const getAllRepo = (dataUsers, langProgram, arrayURL, callback) => {
    if (dataUsers.length === 0) {
        callback(arrayURL);
        return;
    }
    const dataUser = dataUsers.pop();
    const options = {
        url: `https://api.github.com/users/${dataUser.idGithub}/repos`,
        method: 'GET',
        json: true,
        headers: {
            'User-Agent': 'request',
            'client_id': config.get('AuthGithub.client_id'),
            'client_secret': config.get('AuthGithub.client_secret')
        }
    };
    // callback(dataUser);
    request(options, (error, response, json) => {
        //Get url which obtain programming language list
        let arraySt = json.map(v => {
            return v.languages_url;
        });

        getAllRepo(dataUsers, langProgram, arrayURL.concat(arraySt), callback);
    });
};

const verifyLang = (dataUsers, langProgram, callback) => {
    let arrayURL = new Array();
    getAllRepo(dataUsers, langProgram, arrayURL, (result) => {
        callback(result);

    });
};

let jsonInsert = {
    idGithub: 'Kyome22',
    nameUser: 'Takuto Nakamura',
    desc: '',
    linkFB: '',
    linkTw: '',
    linkLinked: '',
    linkYoutube: '',
    linkWeb: '',
    langProgram: 'C',
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
    fs.readFile('./public/html/result.ejs', 'utf-8', (err, data) => {
        search(req.body.search, (result) => {
            // console.log('result');
            // console.log(result);
            let page = ejs.render(data, {
                infoResult: JSON.stringify(result)
            });
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(page);
            res.end();
        });
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
