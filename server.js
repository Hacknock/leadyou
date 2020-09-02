// **
//
// This code is for pullreq-me
// Author: Akira Kashihara <akira@hacknock.com>, Takuto Nakamura <kyomesuke@gmail.com>
//
// **

const fs = require("fs");
const express = require("express");
const app = express();

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
    case "catalog": {
      responseFileSupport(res, "./public/html/catalog.html", "text/html");
      break;
    }
    case "getvalues": {
      const query = req.query;
      const repoUrl = `https://github.com/${query.owner}/${query.repo}`;
      customScript(repoUrl)
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
      countUp(res);
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

const customScript = async (repoUrl) => {
  // get file list of script
  try {
    const files = fs.readdirSync("./public/plugins/custom-scripts/");
    let maps = Array.prototype.map;
    let customScriptList = maps.call(files, (x) => {
      return `./public/plugins/custom-scripts/${x}`;
    });

    let customScripts = customScriptList.map(require);
    return await multiGetValues(customScripts, repoUrl);
  } catch (err) {
    return new Promise((_, reject) => reject(err));
  }
};

const multiGetValues = async (customScripts, repoUrl) => {
  let stack = new Array();
  if (customScripts.length > 0) {
    try {
      let values = await customScripts[0].getValues(repoUrl);
      stack.push(values);
      customScripts.shift();
      let recursiveStack = await multiGetValues(customScripts, repoUrl);
      stack = stack.concat(recursiveStack);
      return new Promise((resolve, _) => resolve(stack));
    } catch (err) {
      return new Promise((_, reject) => reject(err));
    }
  }
  return new Promise((resolve, _) => resolve(stack));
};

const countUp = (res) => {
  console.log("called me");
  const path = "./public/md/count-data.md";
  try {
    const data = fs.readFileSync(path);
    const count = parseInt(data.toString().trim());
    fs.writeFileSync(path, (count + 1).toString());
    res.json({ result: "success" });
  } catch (err) {
    console.error(err);
    res.json({ result: "failed" });
  }
};

const getCount = (res) => {
  const path = "./public/md/count-data.md";
  try {
    const data = fs.readFileSync(path);
    const count = parseInt(data.toString().trim());
    res.json({ result: "success", count: count });
  } catch (err) {
    console.error(err);
    res.json({ result: "failed" });
  }
};
