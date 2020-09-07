// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const fs = require("fs");
const express = require("express");
const app = express();
const mariadb = require("mariadb");
const config = require("config");
const fetch = require("node-fetch");

const dbConfig = config.get("mariaDB");
console.log(dbConfig);

// *** MariaDB connection information *** //
const pool = mariadb.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  connectionLimit: dbConfig.connectionLimit,
});

// ★★★ Initial Process ★★★
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("listen port 3000");
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
      const token = config.get("GitHub.clientToken");
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
    await conn.query("use leadyou");
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
    await conn.query("use leadyou");
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
    await conn.query("use leadyou");
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
      "select * from uniqueGene order by ts desc limit 24"
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

const checkExistReadme = (record, conn) => {
  const path = `${record.user}/${record.repository}`;
  return fetch(`https://raw.githubusercontent.com/${path}/master/README.md`)
    .then((res) => res.text())
    .then((text) => {
      if (text.indexOf("<!-- CREATED_BY_LEADYOU_README_GENERATOR -->") < 0) {
        return conn.query(
          "update uniqueGene set uploaded = 0 where user = ? and repository = ?",
          [record.user, record.repository]
        );
      } else {
        return conn.query(
          "update uniqueGene set uploaded = 1 where user = ? and repository = ?",
          [record.user, record.repository]
        );
      }
    })
    .catch((err) => {
      throw err;
    });
};

const checkUpdated = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("use leadyou");
    const records = await conn.query(
      "select * from uniqueGene order by ts desc limit 24"
    );
    delete records.meta;
    records.forEach(async (record) => {
      try {
        await checkExistReadme(record, conn);
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};
