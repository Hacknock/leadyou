// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const rp = require('request-promise');
const fs = require('fs');
const ejs = require('ejs');
const mongo = require('mongodb'); // momgodb define
const MongoClient = mongo.MongoClient; // use mongo client
const bodyParser = require('body-parser');
const config = require('config');

const token = config.get('AuthGithub.kyomechan');

const port = 3000;
const mongoURL = 'mongodb://127.0.0.1:27017';
const nameDb = 'pullreqme';
const portfolioCollection = 'dbPortfolio';
const languageCollection = 'dbLanguage';

const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// initial process
server.listen(port, () => {
    console.log('listen port 3000 #00');
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// This function crawls data of all users whose forks original portfolio.
const crawlingPortfolio = () => {
    const options = {
        uri: 'https://api.github.com/repos/pullreq-me/portfolio/forks',
        qs: { access_token: token },
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    rp(options).then(function (json) {
        for (let i = 0; i < Object.keys(json).length; i++) {
            let idGithub = json[i]['owner']['login'];
            getUserPortfolio(idGithub);
            getUserLanguages(idGithub);
        }
    }).catch(function (err) {
        throw err;
    });
};

// This function gets the portfolio of one user.
const getUserPortfolio = (idGithub) => {
    const options = {
        uri: `https://api.github.com/repos/${idGithub}/portfolio/contents/README.md`,
        qs: { access_token: token },
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    rp(options).then(function (json) {
        const content = Buffer.from(json['content'], 'base64').toString();
        let data = Object.assign({ idGithub: idGithub }, parseUserPortfolio(content));
        insertUserData(portfolioCollection, data);
    }).catch(function (err) {
        throw err;
    });
};

// This function parses the markdown and returns user data (json object).
const parseUserPortfolio = (content) => {
    let data = { nameUser: 'Unknown', desc: 'No description' };
    let result = content.split(/(?<=\n)(?=# )/).filter(value => {
        return value.startsWith('# ');
    });
    if (0 == result.length) return;
    result = result[0].split(/(?<=\n)(?=## )/);
    for (let value of result) {
        if (value.startsWith('# ')) { // overview
            data = Object.assign(data, parseOverview(value));
        } else if (value.startsWith('## Programming Languages')) {
            data = Object.assign(data, { langProg: parseTags(value) });
        } else if (value.startsWith('## Frameworks / Libraries')) {
            data = Object.assign(data, { libFw: parseTags(value) });
        } else if (value.startsWith('## envnments')) {
            data = Object.assign(data, { env: parseTags(value) });
        } else if (value.startsWith('## Other Skills')) {
            data = Object.assign(data, { skills: parseTags(value) });
        } else if (value.startsWith('## Qualifications')) {
            data = Object.assign(data, { qualifi: parseTags(value) });
        } else if (value.startsWith('## Job Experience')) {
            data = Object.assign(data, parseJobExperience(value));
        } else if (value.startsWith('## Education')) {
            data = Object.assign(data, parseEducation(value));
        } else if (value.startsWith('## Projects')) {
            data = Object.assign(data, { projects: parseTitles(value) });
        } else if (value.startsWith('## Distributions')) {
            data = Object.assign(data, { dist: parseTitles(value) });
        } else if (value.startsWith('## Publications')) {
            data = Object.assign(data, { pub: parseTitles(value) });
        }
    }
    return data;
};

// This function parses the markdown and returns [nameUser, desc].
const parseOverview = (content) => {
    let data = {};
    const result = content.split(/\n/g).filter(value => {
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
                    Object.assign(data, { linkWeb: url[2] });
                    break;
                case 'facebook':
                    Object.assign(data, { linkFB: url[2] });
                    break;
                case 'twitter':
                    Object.assign(data, { linkTw: url[2] });
                    break;
                case 'linkedin':
                    Object.assign(data, { linkLI: url[2] });
                    break;
                case 'youtube':
                    Object.assign(data, { linkYT: url[2] });
                    break;
            }
        } else {
            desc += value;
        }
    }
    data = Object.assign(data, { nameUser: nameUser, desc: desc });
    return data;
};

// This function parses the markdown and returns tags
// [Programming Languages, Frameworks / Libraries, envnments, Other Skills, Qualifications].
const parseTags = (content) => {
    return content.split(/\n/g).filter(value => {
        return (value.length !== 0) && !(value.startsWith('## '));
    }).flatMap(value => {
        return value.match(/`[^`]+` */g);
    }).map(value => {
        return value.replace(/` */g, '');
    }).filter(value => {
        return (value.length !== 0);
    });
};

// This function parses the markdown and returns tags [Projects, Distributions, Publications].
const parseTitles = (content) => {
    return content.split(/\n/g).filter(value => {
        return value.startsWith('### ');
    }).map(value => {
        return value.replace(/### /, '');
    }).filter(value => {
        return (value.length !== 0);
    });
};

// This function parses the markdown and returns Job Experience array.
const parseJobExperience = (content) => {
    const result = content.split(/(?<=\n)(?=### )/).filter(value => {
        return value.startsWith('### ');
    });
    let termComp = [];
    let nameComp = [];
    for (let i in result) {
        termComp.push('');
        nameComp.push('');
        const lines = result[i].split(/\n/g).filter(value => {
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
        return { termComp: termComp, nameComp: nameComp };
    }
    return {};
};

// This function parses the markdown and returns Education array.
const parseEducation = (content) => {
    const result = content.split(/(?<=\n)(?=### )/).filter(value => {
        return value.startsWith('### ');
    });
    let termEdu = [];
    let nameEdu = [];
    for (let i in result) {
        termEdu.push('');
        nameEdu.push('');
        const lines = result[i].split(/\n/g).filter(value => {
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
        return { termEdu: termEdu, nameEdu: nameEdu };
    }
    return {};
};

const insertUserData = (collection, jsonData) => {
    MongoClient.connect(mongoURL, connectOption, (err, client) => {
        if (err) {
            console.log('Error occurred #01');
            throw err;
        }
        console.log('Database connection is established on insert data process. #02');
        const db = client.db(nameDb);  //Get pullreqme database
        findData(db, collection, { idGithub: jsonData.idGithub }, (items) => {
            if (items.length == 0) {
                console.log('No data. #03');
                insertDocuments(db, collection, jsonData, () => {
                    client.close();
                });
            } else {
                console.log('Data has been existed. #04');
                console.log(jsonData.idGithub);
                deleteData(db, collection, { idGithub: jsonData.idGithub }, () => {
                    insertDocuments(db, collection, jsonData, () => {
                        client.close();
                    });
                });
            }
        });
    });
};

// This function insert new search info document to database(database, collection, document, callback)
const insertDocuments = (db, coll, document, callback) => {
    db.collection(coll).insertOne(document, (err, result) => {
        if (err) {
            console.log('error occurred #05');
            throw err;
        }
        console.log('success to insert documents #06');
        callback(result);
    });
};

// This function delete data from database with especially key (database, collection, key, callback)
const deleteData = (db, coll, key, callback) => {
    db.collection(coll).deleteMany(key, (err, result) => {
        if (err) {
            console.log('Error occurred on delete many. #07');
            throw err;
        }
        console.log('success to delete many. #08');
        callback(result);
    });
};

// This function find data from database with especially key (database, collection, key, callback)
const findData = (db, coll, key, callback) => {
    db.collection(coll).find(key).toArray((err, items) => {
        if (err) {
            console.log('Error occurred on finding documents. #09');
            throw err;
        }
        console.log('Success to find documents with key. #10');
        callback(items);
    });
};

// This function gets the languages of one user.
const getUserLanguages = (idGithub) => {
    const options = {
        uri: `https://api.github.com/users/${idGithub}/repos`,
        qs: { access_token: token },
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    rp(options).then(function (json) {
        let urls = json.map(v => {
            return v.languages_url;
        });
        getAllLangEvi(urls, {}, (result) => {
            let data = Object.assign({ idGithub: idGithub }, result);
            console.log(idGithub);
            insertUserData(languageCollection, data);
        });
    }).catch(function (err) {
        throw err;
    });
};

const getAllLangEvi = (urls, jsonData, callback) => {
    if (urls.length === 0) {
        callback(jsonData);
        return;
    }
    const url = urls.pop();
    const options = {
        uri: url,
        qs: { access_token: token },
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };
    rp(options).then(function (json) {
        const keys = Object.keys(json);
        for (let key of keys) {
            if (key in jsonData) {
                jsonData[key] += json[key];
            } else {
                jsonData[key] = json[key];
            }
        }
        getAllLangEvi(urls, jsonData, callback);
    }).catch(function (err) {
        throw err;
    });
};

const searchUser = (bodyReq, callback) => {
    makeQuery(bodyReq.split(' '), new Array(), (result) => {
        console.log(result);
        MongoClient.connect(mongoURL, connectOption, (err, client) => {
            const db = client.db(nameDb);  //Get pullreqme database
            findData(db, portfolioCollection, { '$or': result }, (items) => {
                console.log('number of hits');
                console.log(items.length);
                let listLang = result.map(v => {
                    return v.langProg;
                });
                let idGithubs = items.map(v => {
                    return v.idGithub;
                });
                console.log({ 'idGithub': { '$in': idGithubs } });
                findData(db, languageCollection, { 'idGithub': { '$in': idGithubs } }, (items) => {
                    let resultSort = {};
                    for (let i = 0; i < idGithubs.length; i++) {
                        let score = 0;
                        for (let j = 0; j < listLang.length; j++) {
                            console.log(items[i][listLang[j]]);
                            if (typeof items[i][listLang[j]] === 'undefined') {
                                console.log('undifined');
                                console.log(items[i]);
                                console.log(listLang[j]);
                            } else {
                                score += items[i][listLang[j]];
                            }
                        }
                        resultSort = Object.assign(resultSort, { [idGithubs[i]]: score });
                    }
                    console.log(resultSort);
                    callback(resultSort);
                });
            });
        });
    });
};

const sortResult = (idGithubs, langs, callback) => {

};

const makeQuery = (keywords, arrayQuery, callback) => {
    if (keywords.length === 0) {
        callback(arrayQuery);
        return;
    }
    let keyword = keywords.pop();
    if (keyword.indexOf('lang:') === 0) {
        let listLang = keyword.split(':')[1];
        listLang = listLang.split(',');
        for (var j = 0; j < listLang.length; j++) {
            arrayQuery.push({ 'langProg': listLang[j] });
        }
        makeQuery(keywords, arrayQuery, callback);
    } else {
        arrayQuery.push({ 'nameUser': keyword });
        makeQuery(keywords, arrayQuery, callback);
    }
};

app.get('/', (req, res) => {
    fs.readFile('./public/html/index.html', 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});

app.post('/search/result', (req, res) => {
    searchUser(req.body.search, (result) => {
        fs.readFile('./public/html/result.ejs', 'utf-8', (err, data) => {
            const page = ejs.render(data, { jsonData: JSON.stringify(result) });
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(page);
            res.end();
        });
    });
});

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

// img file rooting
app.get('/src/img/*', function (req, res) {
    console.log(req.params[0]);
    const buf = fs.readFileSync('./public/img/' + req.params[0]);
    res.send(buf, { 'Content-Type': 'image' }, 200);
});

app.get('/src/json/*', function (req, res) {
    fs.readFile('./public/json/' + req.params[0], 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
    });
});

app.get('/src/customdom/*', function (req, res) {
    fs.readFile('./public/js/customElement/' + req.params[0], 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(data);
        res.end();
    });
})


app.get('/makeReadme', (req, res) => {
    fs.readFile('./public/html/form.html', 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});