// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const fs = require("fs");
const express = require("express");
const app = express();

// Initial Process
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("listen port 3000");
});

// file serve
app.get("/", (req, res) => {
  responseFileSupport(res, "./public/html/index.html", "text/html");
});

app.get("/makereadme", (req, res) => {
  responseFileSupport(res, "./public/html/form.html", "text/html");
});

app.get("/favicon.ico", (req, res) => {
  responseFileSupport(res, "./public/favicon.ico", "image/x-icon");
});

app.get("/:path", (req, res) => {
  const path = String(req.params.path).toLocaleLowerCase();
  console.log(path);
  switch (path) {
    case "favicon.ico":
      responseFileSupport(res, "./public/favicon.ico", "image/x-icon");
      break;
    case "makereadme":
      responseFileSupport(res, "./public/html/form.html", "text/html");
      break;
    default:
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write("400 Bad Request");
      res.end();
  }
});

app.get("/src/:dir/:file", (req, res) => {
  const dir = String(req.params.dir).toLocaleLowerCase();
  const file = String(req.params.file).toLocaleLowerCase();
  console.log(`${dir}, ${file}`);
  switch (dir) {
    case "css":
      responseFileSupport(res, `./public/css/${file}`, "text/css");
      break;
    case "js":
      responseFileSupport(res, `./public/js/${file}`, "text/javascript");
      break;
    case "customdom":
      responseFileSupport(
        res,
        `./public/js/customElement/${file}`,
        "text/javascript"
      );
      break;
    case "json":
      responseFileSupport(res, `./public/json/${file}`, "application/json");
      break;
    case "img":
      responseFileSupport(res, `./public/img/${file}`, "image/*");
      break;
    default:
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write("400 Bad Request");
      res.end();
  }
});

const responseFileSupport = (res, path, type) => {
  try {
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      res.writeHead(200, { "Content-Type": type });
      res.write(data);
      res.end();
    });
  } catch (err) {
    console.error(err);
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  }
};

// app.post("/search/result", (req, res) => {
//   searchUser(req.body.search, (result) => {
//     fs.readFile("./public/html/result.ejs", "utf-8", (err, data) => {
//       const page = ejs.render(data, { jsonData: JSON.stringify(result) });
//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.write(page);
//       res.end();
//     });
//   });
// });

/*
// This function parses the markdown and returns user data (json object).
const parseUserPortfolio = (content) => {
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
      data = Object.assign(data, {langProg: parseTags(value)});
    } else if (value.startsWith('## Frameworks / Libraries')) {
      data = Object.assign(data, {libFw: parseTags(value)});
    } else if (value.startsWith('## envnments')) {
      data = Object.assign(data, {env: parseTags(value)});
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
      data = Object.assign(data, {dist: parseTitles(value)});
    } else if (value.startsWith('## Publications')) {
      data = Object.assign(data, {pub: parseTitles(value)});
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
        Object.assign(data, {linkWeb: url[2]});
        break;
        case 'facebook':
        Object.assign(data, {linkFB: url[2]});
        break;
        case 'twitter':
        Object.assign(data, {linkTw: url[2]});
        break;
        case 'linkedin':
        Object.assign(data, {linkLI: url[2]});
        break;
        case 'youtube':
        Object.assign(data, {linkYT: url[2]});
        break;
      }
    } else {
      desc += value;
    }
  }
  data = Object.assign(data, {nameUser: nameUser, desc: desc});
  return data;
};
*/
// This function parses the markdown and returns tags
// [Programming Languages, Frameworks / Libraries, envnments, Other Skills, Qualifications].
// const parseTags = (content) => {
//     return content.split(/\n/g).filter(value => {
//         return (value.length !== 0) && !(value.startsWith('## '));
//     }).flatMap(value => {
//         return value.match(/`[^`]+` */g);
//     }).map(value => {
//         return value.replace(/` */g, '');
//     }).filter(value => {
//         return (value.length !== 0);
//     });
// };

// // This function parses the markdown and returns tags [Projects, Distributions, Publications].
// const parseTitles = (content) => {
//     return content.split(/\n/g).filter(value => {
//         return value.startsWith('### ');
//     }).map(value => {
//         return value.replace(/### /, '');
//     }).filter(value => {
//         return (value.length !== 0);
//     });
// };

// // This function parses the markdown and returns Job Experience array.
// const parseJobExperience = (content) => {
//     const result = content.split(/(?<=\n)(?=### )/).filter(value => {
//         return value.startsWith('### ');
//     });
//     let termComp = [];
//     let nameComp = [];
//     for (let i in result) {
//         termComp.push('');
//         nameComp.push('');
//         const lines = result[i].split(/\n/g).filter(value => {
//             return (value.length !== 0);
//         });
//         for (let line of lines) {
//             if (line.startsWith('### ')) {
//                 let term = line.match(/\*([^*]+)\*/);
//                 if (term) {
//                     termComp[i] = term[1];
//                 }
//             } else if (line.startsWith('**')) {
//                 let name = line.match(/\*\*([^*]+)\*\*/);
//                 if (name) {
//                     nameComp[i] = name[1];
//                 }
//             }
//         }
//     }
//     if (0 < termComp.length) {
//         return {termComp: termComp, nameComp: nameComp};
//     }
//     return {};
// };

// // This function parses the markdown and returns Education array.
// const parseEducation = (content) => {
//     const result = content.split(/(?<=\n)(?=### )/).filter(value => {
//         return value.startsWith('### ');
//     });
//     let termEdu = [];
//     let nameEdu = [];
//     for (let i in result) {
//         termEdu.push('');
//         nameEdu.push('');
//         const lines = result[i].split(/\n/g).filter(value => {
//             return (value.length !== 0);
//         });
//         for (let line of lines) {
//             if (line.startsWith('### ')) {
//                 let term = line.match(/\*([^*]+)\*/);
//                 if (term) {
//                     termEdu[i] = term[1];
//                 }
//             } else {
//                 let name = line.match(/> (.+)/);
//                 if (name) {
//                     nameEdu[i] += name[1];
//                 }
//             }
//         }
//     }
//     if (0 < termEdu.length) {
//         return {termEdu: termEdu, nameEdu: nameEdu};
//     }
//     return {};
// };
