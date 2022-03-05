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
const fs = require("fs").promises;
const mariadb = require("mariadb");
const fetch = require("node-fetch");
const cron = require("node-cron");
const env = process.env;

// *** Global Variables ***
let pool;
let cronTask;

// *** MariaDB connection ***
const setupMariaDB = () => {
  pool = mariadb.createPool({
    host: env.HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    connectionLimit: env.CON_LIMIT,
    waitForConnections: true,
    multipleStatements: true,
  });
};

// ★★★ Periodic Process ★★★
const setupCronTask = () => {
  // Updated every morning at 7:00 a.m.
  cronTask = cron.schedule("0 0 7 * * *", async () => {
    try {
      console.log("Update Catalogs Info 🏖");
      await updateCatalogInfo(18);
    } catch (err) {
      console.error(err);
    }
  });
};

// ★★★ Initial Process ★★★
const setupEndProcess = () => {
  process.on("SIGINT", () => {
    console.log("Keyboard Interrupt 🏂");
    pool.end();
    cronTask.stop();
    process.exit(0);
  });
};

const setupHelmet = () => {
  const setting = {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "api.github.com",
          "raw.githubusercontent.com",
          "www.google-analytics.com",
          "blob:"
        ],
        scriptSrc: [
          "'self'",
          "www.googletagmanager.com",
          "www.google-analytics.com",
          "cdn.jsdelivr.net",
          "cdnjs.cloudflare.com",
        ],
        imgSrc: [
          "'self'",
          "img.shields.io",
          "github.com",
          "www.google-analytics.com",
          "raw.githubusercontent.com",
          "leadyou.hacknock.com",
          "https:",
          "blob:"
        ],
      },
    },
  };
  app.use(helmet(setting));
};

// ★★★ Serving File & Rooting API Request ★★★
const listenPort = () => {
  const port = env.WEB_PORT;
  app.listen(port, () => {
    console.log(`Listen Port ${port}`);
  });
};

const setupGetRequest = () => {
  // Root
  app.get("/", async (_, res) => {
    try {
      await serveFile(res, "html/index.html", "text/html");
    } catch (err) {
      console.error(err);
    } finally {
      res.end();
    }
  });

  // Favicon
  app.get("/favicon.ico", async (_, res) => {
    try {
      await serveFile(res, "images/favicon-black.ico", "image/x-icon");
    } catch (err) {
      console.error(err);
    } finally {
      res.end();
    }
  });

  // API
  app.get("/:method", async (req, res) => {
    try {
      const method = String(req.params.method).toLocaleLowerCase();
      console.log(`Get: ${method}`);
      if (method === "makereadme") {
        await serveFile(res, "html/form.html", "text/html");
      } else if (method === "page") {
        await serveFile(res, "html/document.html", "text/html");
      } else if (method === "getvalues") {
        await getValues(res, req.query);
      } else if (method === "getcount") {
        await getCount(res);
      } else if (method === "countup") {
        await countUp(res, req.query);
      } else if (method === "getlist") {
        await getList(res);
      } else if (method === "updatecatalog") {
        await updateCatalog(res, req.query);
      } else {
        writeBadRequest(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      res.end();
    }
  });

  // File
  app.get("/src/:dir/:file", async (req, res) => {
    const dir = String(req.params.dir).toLocaleLowerCase();
    const file = String(req.params.file).toLocaleLowerCase();
    console.log(`Get: ${dir}, ${file}`);
    try {
      if (dir === "css") {
        await serveFile(res, `css/${file}`, "text/css");
      } else if (dir === "js") {
        await serveFile(res, `js/${file}`, "text/javascript");
      } else if (dir === "customdom") {
        const filePath = `plugins/custom-elements/${file}`;
        await serveFile(res, filePath, "text/javascript");
      } else if (dir === "json") {
        await serveFile(res, `plugins/${file}`, "application/json");
      } else if (dir === "md") {
        await serveFile(res, `md/${file}`, "text/markdown");
      } else if (dir === "images") {
        if (file.endsWith(".svg")) {
          await serveFile(res, `images/${file}`, "image/svg+xml");
        } else {
          await serveFile(res, `images/${file}`, "image/*");
        }
      } else {
        writeBadRequest(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      res.end();
    }
  });
};

// ★★★ File System Functions ★★★
const writeBadRequest = (res) => {
  res.writeHead(400, { "Content-Type": "text/plain" });
  res.write("400 Bad Request");
};

const serveErrorPage = async (res, code) => {
  try {
    const data = await fs.readFile("./public/html/error.html");
    res.writeHead(code, { "Content-Type": "text/html" });
    res.write(data);
  } catch (err) {
    writeBadRequest(res);
    throw err;
  }
};

const serveFile = async (res, path, type) => {
  try {
    const data = await fs.readFile(`./public/${path}`);
    res.writeHead(200, { "Content-Type": type });
    res.write(data);
  } catch {
    try {
      await serveErrorPage(res, 404);
    } catch (err) {
      throw err;
    }
  }
};

// ★★★ API Functions ★★★
// ★★★ API: getValues ★★★
const getValues = async (res, query) => {
  try {
    const repoURL = `https://github.com/${query.owner}/${query.repo}`;
    const token = env.GITHUB_TOKEN;
    const stack = await customScript(repoURL, token);
    res.json({ result: "success", stack: stack });
  } catch (err) {
    res.json({ result: "failed" });
    throw err;
  }
};

const customScript = async (repoURL, token) => {
  try {
    const files = await fs.readdir("./public/plugins/custom-scripts/");
    const customScripts = files
      .map((file) => {
        return `./public/plugins/custom-scripts/${file}`;
      })
      .map((path) => require(path));
    return await multiGetValues(customScripts, repoURL, token);
  } catch (err) {
    throw err;
  }
};

const multiGetValues = async (customScripts, repoURL, token) => {
  let stack = new Array();
  if (customScripts.length === 0) {
    return stack;
  }
  try {
    const values = await customScripts[0].getValues(repoURL, token);
    stack.push(values);
    customScripts.shift();
    const recursiveStack = await multiGetValues(customScripts, repoURL, token);
    stack = stack.concat(recursiveStack);
    return stack;
  } catch (err) {
    throw err;
  }
};

// ★★★ API: countUP ★★★
const countUp = async (res, query) => {
  try {
    const owner = query.owner.toLowerCase();
    const repo = query.repo.toLowerCase();
    await insertOrUpdateGeneratedRepository(owner, repo);
    res.json({ result: "success" });
  } catch (err) {
    res.json({ result: "failed" });
    throw err;
  }
};

// ★★★ API: getCount ★★★
const getCount = async (res) => {
  try {
    const records = await selectFromGeneratedRepository();
    const count = Object.keys(records).length;
    res.json({ result: "success", count: count });
  } catch (err) {
    res.json({ result: "failed" });
    throw err;
  }
};

// ★★★ API: getList ★★★
const getList = async (res) => {
  try {
    const records = await selectFromGeneratedRepository(18, true);
    res.json({ result: "success", records: records });
  } catch (err) {
    res.json({ result: "failed" });
    throw err;
  }
};

// ★★★ API: updateCatalog ★★★
const updateCatalog = async (res, query) => {
  if (env.NODE_ENV === "production") {
    res.json({ result: "cancelled in production" });
    return;
  }

  let limit = 18;
  if ("limit" in query) {
    const n = parseInt(query.limit);
    if (!Number.isNaN(n)) {
      limit = Math.max(Math.min(n, 18), 1);
    }
  }
  try {
    await updateCatalogInfo(limit);
    res.json({ result: "success", limit: limit });
  } catch (err) {
    res.json({ result: "failed" });
    throw err;
  }
};

// ★★★ Fetch & Update Catalog Info ★★★
const updateCatalogInfo = async (limit) => {
  try {
    const records = await selectFromGeneratedRepository(limit);
    const promises = records.map((record) => {
      return checkReadmeDefaultBranch(record.owner, record.repository);
    });
    return Promise.all(promises);
  } catch (err) {
    throw err;
  }
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
    if (conn) conn.end();
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
    if (conn) conn.end();
  }
};

const updateGeneratedRepositoryDefaultBranch = async (owner, repo, branch) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Update the timestamp and default branch.
    await conn.query(
      "update generated set ts = ts, branch = ? where owner = ? and repository = ?",
      [branch, owner, repo]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
};

// ★★★ Main ★★★
(() => {
  setupMariaDB();

  setupCronTask();
  setupEndProcess();
  setupHelmet();

  listenPort();
  setupGetRequest();
})();
