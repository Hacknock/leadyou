/**
 * Copyright 2022 Hacknock
 *
 * Licensed under the Apache License, Version 2.0(the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * This code is for leadyou
 * Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
 *
 */

const express = require("express");
const app = express();
const helmet = require("helmet");
const fetch = require("node-fetch");
const fs = require("fs");
const mariadb = require("mariadb");
const env = process.env;

// *** MariaDB connection information *** //
const pool = mariadb.createPool({
  host: env.HOST,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  connectionLimit: env.CON_LIMIT,
  waitForConnections: true,
  multipleStatements: true,
});

// ★★★ Initial Process ★★★
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://api.github.com",
          "https://www.google-analytics.com",
        ],
        scriptSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: [
          "'self'",
          "https://img.shields.io",
          "https://github.com",
          "https://www.google-analytics.com",
          "https://raw.githubusercontent.com",
          "https:",
        ],
      },
    },
  })
);

const port = env.WEB_PORT;
app.listen(port, () => {
  console.log(`listen port ${port}`);
});

// ★★★ File Serve & Rooting API Request ★★★
app.get("/", (_, res) => {
  responseFileSupport(res, "./public/html/index.html", "text/html");
});

app.get("/:path", (req, res) => {
  const path = String(req.params.path).toLocaleLowerCase();
  console.log(`get: ${path}`);
  switch (path) {
    case "favicon.ico": {
      responseFileSupport(
        res,
        "./public/images/favicon-black.ico",
        "image/x-icon"
      );
      break;
    }
    case "makereadme": {
      responseFileSupport(res, "./public/html/form.html", "text/html");
      break;
    }
    case "page": {
      responseFileSupport(res, "./public/html/document.html", "text/html");
      break;
    }
    case "getvalues": {
      const query = req.query;
      const repoUrl = `https://github.com/${query.owner}/${query.repo}`;
      const token = env.GITHUB_TOKEN;
      customScript(repoUrl, token)
        .then((result) => {
          res.json(result);
          res.end();
        })
        .catch((err) => {
          console.error(err);
        });
      break;
    }
    case "getcount": {
      getCount(res);
      break;
    }
    case "countup": {
      // get query
      const owner = req.query.owner.toLowerCase();
      const repo = req.query.repo.toLowerCase();
      Promise.all([
        insertGeneratedRepository(owner, repo),
        uniqueInsertGeneratedRepository(owner, repo),
      ])
        .then(() => {
          res.json({ result: "success" });
        })
        .catch((err) => {
          console.error(err);
          res.json({ result: "failed" });
        });
      break;
    }
    case "getlist": {
      getList(res).catch((err) => {
        console.log(err);
      });
      break;
    }
    default: {
      errorSupport(res, 400);
    }
  }
});

app.get("/src/:dir/:file", (req, res) => {
  const dir = String(req.params.dir).toLocaleLowerCase();
  const file = String(req.params.file).toLocaleLowerCase();
  console.log(`get: ${dir}, ${file}`);
  switch (dir) {
    case "css": {
      responseFileSupport(res, `./public/css/${file}`, "text/css");
      break;
    }
    case "js": {
      responseFileSupport(res, `./public/js/${file}`, "text/javascript");
      break;
    }
    case "customdom": {
      responseFileSupport(
        res,
        `./public/plugins/custom-elements/${file}`,
        "text/javascript"
      );
      break;
    }
    case "json": {
      responseFileSupport(res, `./public/plugins/${file}`, "application/json");
      break;
    }
    case "images": {
      if (file.endsWith(".svg")) {
        responseFileSupport(res, `./public/images/${file}`, "image/svg+xml");
      } else {
        responseFileSupport(res, `./public/images/${file}`, "image/*");
      }
      break;
    }
    case "md": {
      responseFileSupport(res, `./public/md/${file}`, "text/markdown");
      break;
    }
    default: {
      errorSupport(res, 400);
    }
  }
});

const responseFileSupport = (res, path, type) => {
  try {
    const data = fs.readFileSync(path);
    res.writeHead(200, { "Content-Type": type });
    res.write(data);
    res.end();
  } catch (err) {
    errorSupport(res, 404);
  }
};

const errorSupport = (res, code) => {
  try {
    const data = fs.readFileSync("./public/html/error.html");
    res.writeHead(code, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("500 Internal Server Error");
    res.end();
  }
};

const customScript = async (repoUrl, token) => {
  // get file list of script
  try {
    const files = fs.readdirSync("./public/plugins/custom-scripts/");
    let maps = Array.prototype.map;
    let customScriptList = maps.call(files, (x) => {
      return `./public/plugins/custom-scripts/${x}`;
    });

    let customScripts = customScriptList.map(require);
    return await multiGetValues(customScripts, repoUrl, token);
  } catch (err) {
    return new Promise((_, reject) => reject(err));
  }
};

const multiGetValues = async (customScripts, repoUrl, token) => {
  let stack = new Array();
  if (customScripts.length > 0) {
    try {
      let values = await customScripts[0].getValues(repoUrl, token);
      stack.push(values);
      customScripts.shift();
      let recursiveStack = await multiGetValues(customScripts, repoUrl, token);
      stack = stack.concat(recursiveStack);
      return new Promise((resolve, _) => resolve(stack));
    } catch (err) {
      return new Promise((_, reject) => reject(err));
    }
  }
  return new Promise((resolve, _) => resolve(stack));
};

const insertGeneratedRepository = async (user, repo) => {
  console.log("Insert generate log to mariaDB.");
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("insert into generate(user,repository) values (?,?)", [
      user,
      repo,
    ]);
    console.log("sucess to count up");
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const uniqueInsertGeneratedRepository = async (user, repo) => {
  console.log("Insert generate log to mariaDB unique.");
  let conn;
  try {
    conn = await pool.getConnection();
    return conn
      .query("select * from uniqueGene where user = ? and repository = ?", [
        user,
        repo,
      ])
      .then((records) => {
        delete records.meta;
        console.log(user, repo);
        console.log("number of select is " + Object.keys(records).length);
        if (Object.keys(records).length === 0) {
          return conn
            .query("insert into uniqueGene(user,repository) values (?,?)", [
              user,
              repo,
            ])
            .catch((err) => {
              throw err;
            });
        } else {
          return conn
            .query(
              "update uniqueGene set ts = current_timestamp where user = ? and repository = ?",
              [user, repo]
            )
            .catch((err) => {
              throw err;
            });
        }
      });
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const getCount = async (res) => {
  console.log("Insert generate log to mariaDB.");
  let conn;
  try {
    conn = await pool.getConnection();
    const sectionValues = await conn.query("select * from uniqueGene");
    delete sectionValues.meta;
    res.json({ result: "success", count: Object.keys(sectionValues).length });
  } catch (err) {
    console.error(err);
    res.json({ result: "failed" });
  } finally {
    if (conn) conn.release();
  }
};

const getList = async (res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("use leadyou");
    const records = await conn.query(
      "select * from uniqueGene order by ts desc limit 18"
    );
    delete records.meta;
    res.json(records);
  } catch (err) {
    res.json({ result: "error" });
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
