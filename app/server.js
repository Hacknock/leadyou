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
const fs = require("fs");
const mariadb = require("mariadb");
const fetch = require("node-fetch");
const cron = require("node-cron");
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

// ★★★ Periodic Process ★★★
// Updated every morning at 7:00 a.m.
const cronTask = cron.schedule("0 0 7 * * *", () => {
  console.log("Update Catalogs Info 🏖");
  updateCatalogInfo(18);
});

// ★★★ Initial Process ★★★
process.on("SIGINT", () => {
  console.log("Keyboard Interrupt 🏂");
  pool.end();
  cronTask.stop();
  process.exit(0);
});

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://api.github.com",
          "https://raw.githubusercontent.com",
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
  console.log(`Listen Port ${port}`);
});

// ★★★ File Serve & Rooting API Request ★★★
app.get("/", (_, res) => {
  responseFileSupport(res, "./public/html/index.html", "text/html");
});

app.get("/:path", (req, res) => {
  const path = String(req.params.path).toLocaleLowerCase();
  console.log(`Get: ${path}`);
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
      getValues(res, req.query);
      break;
    }
    case "getcount": {
      getCount(res);
      break;
    }
    case "countup": {
      countUp(res, req.query);
      break;
    }
    case "getlist": {
      getList(res);
      break;
    }
    case "updatecatalog": {
      updateCatalog(res);
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
  console.log(`Get: ${dir}, ${file}`);
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

// ★★★ File System Functions ★★★
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

// ★★★ API Functions ★★★
// ★★★ API: getValues ★★★
const getValues = (res, query) => {
  const repoUrl = `https://github.com/${query.owner}/${query.repo}`;
  const token = env.GITHUB_TOKEN;
  customScript(repoUrl, token)
    .then((stack) => {
      res.json({ result: "success", stack: stack });
      res.end();
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: "failed" });
      res.end();
    });
};

const customScript = async (repoUrl, token) => {
  try {
    const files = fs.readdirSync("./public/plugins/custom-scripts/");
    let maps = Array.prototype.map;
    let customScriptList = maps.call(files, (x) => {
      return `./public/plugins/custom-scripts/${x}`;
    });

    let customScripts = customScriptList.map((path) => require(path));
    return await multiGetValues(customScripts, repoUrl, token);
  } catch (err) {
    throw err;
  }
};

const multiGetValues = async (customScripts, repoUrl, token) => {
  let stack = new Array();
  if (customScripts.length === 0) {
    return stack;
  }
  try {
    const values = await customScripts[0].getValues(repoUrl, token);
    stack.push(values);
    customScripts.shift();
    const recursiveStack = await multiGetValues(customScripts, repoUrl, token);
    stack = stack.concat(recursiveStack);
    return stack;
  } catch (err) {
    throw err;
  }
};

// ★★★ API: countUP ★★★
const countUp = (res, query) => {
  const owner = query.owner.toLowerCase();
  const repo = query.repo.toLowerCase();
  insertOrUpdateGeneratedRepository(owner, repo)
    .then(() => {
      res.json({ result: "success" });
      res.end();
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: "failed" });
      res.end();
    });
};

// ★★★ API: getCount ★★★
const getCount = (res) => {
  selectFromGeneratedRepository()
    .then((records) => {
      const count = Object.keys(records).length;
      res.json({ result: "success", count: count });
      res.end();
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: "failed" });
      res.end();
    });
};

// ★★★ API: getList ★★★
const getList = async (res) => {
  selectFromGeneratedRepository(18, true)
    .then((records) => {
      res.json({ result: "success", records: records });
      res.end();
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: "failed" });
      res.end();
    });
};

// ★★★ API: updateCatalog ★★★
const updateCatalog = (res) => {
  updateCatalogInfo();
  res.json({ result: "called" });
  res.end();
};

// ★★★ Fetch & Update Catalog Info ★★★
const updateCatalogInfo = (limit) => {
  selectFromGeneratedRepository(limit)
    .then((records) => {
      const promises = records.map((record) => {
        return checkReadmeDefaultBranch(record.owner, record.repository);
      });
      return Promise.all(promises);
    })
    .catch((err) => {
      console.error(err);
    });
};

const checkReadmeDefaultBranch = async (owner, repo) => {
  try {
    const branch = await fetchReadme(owner, repo);
    await updateGeneratedRepositoryDefaultBranch(owner, repo, branch);
  } catch (err) {
    console.error(err);
  }
};

const fetchReadme = async (owner, repo) => {
  const requestURL = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `token ${env.GITHUB_TOKEN}`,
    },
  };

  try {
    const response = await fetch(requestURL, options);
    const json = await response.json();
    if (!("content" in json)) {
      throw new Error("failed to fetch readme");
    }
    const base64str = json["content"];
    const str = Buffer.from(base64str, "base64").toString("utf8");
    if (!str.includes("<!-- CREATED_BY_LEADYOU_README_GENERATOR -->")) {
      throw new Error("No Tag");
    }
    const downloadURL = json["download_url"].split("/");
    const branch = downloadURL[downloadURL.length - 2];
    return branch;
  } catch (err) {
    throw err;
  }
};

// ★★★ MariaDB Operations ★★★
const insertOrUpdateGeneratedRepository = async (owner, repo) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const records = await conn.query(
      "select * from generated where owner = ? and repository = ?",
      [owner, repo]
    );
    delete records.meta;
    if (Object.keys(records).length === 0) {
      // Never been inserted yet.
      await conn.query("insert into generated(owner,repository) values (?,?)", [
        owner,
        repo,
      ]);
    } else {
      // Update only the timestamp since it is already inserted.
      await conn.query(
        "update generated set ts = current_timestamp where owner = ? and repository = ?",
        [owner, repo]
      );
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const selectFromGeneratedRepository = async (limit, inUse = false) => {
  let conn;
  try {
    conn = await pool.getConnection();
    let queryStr = "select * from generated";
    if (inUse) {
      queryStr += " where branch is not null";
    }
    queryStr += " order by ts desc";
    if (typeof limit !== "undefined") {
      queryStr += ` limit ${limit}`;
    }
    records = await conn.query(queryStr);
    delete records.meta;
    return records;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const updateGeneratedRepositoryDefaultBranch = async (owner, repo, branch) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Update the timestamp and default branch.
    await conn.query(
      "update generated set ts = current_timestamp, branch = ? where owner = ? and repository = ?",
      [branch, owner, repo]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
