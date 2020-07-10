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
app.get("/", (req, res) => {
  responseFileSupport(res, "./public/html/index.html", "text/html");
});

app.get("/:path", (req, res) => {
  const path = String(req.params.path).toLocaleLowerCase();
  console.log(path);
  switch (path) {
    case "favicon.ico": {
      responseFileSupport(res, "./public/favicon.ico", "image/x-icon");
      break;
    }
    case "makereadme": {
      responseFileSupport(res, "./public/html/form.html", "text/html");
      break;
    }
    case "getvalues": {
      console.log(req.query);
      let jsonReturn = customScript(
        req.query.url,
        req.query.authToken,
        req.query.secretToken
      );
      console.log("debug");
      console.log(typeof jsonReturn);

      res.json(jsonReturn);
      res.end();
      break;
    }
    default: {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write("400 Bad Request");
      res.end();
    }
  }
});

app.get("/src/:dir/:file", (req, res) => {
  const dir = String(req.params.dir).toLocaleLowerCase();
  const file = String(req.params.file).toLocaleLowerCase();
  console.log(`${dir}, ${file}`);
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
        `./public/js/customElement/${file}`,
        "text/javascript"
      );
      break;
    }
    case "json": {
      responseFileSupport(res, `./public/json/${file}`, "application/json");
      break;
    }
    case "img": {
      responseFileSupport(res, `./public/img/${file}`, "image/*");
      break;
    }
    default: {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write("400 Bad Request");
      res.end();
    }
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

// const existFile = (filePath) => {
//   try {
//     fs.statSync(filePath);
//     return true;
//   } catch (err) {
//     return false;
//   }
// };

// const getLocalJson = (filePath) => {
//   if (existFile(filePath)) {
//     const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
//     return json;
//   }
//   return "cannot read the json file";
// };

const customScript = async (repoUrl, authToken, secretToken) => {
  // get file list of script

  try {
    const files = fs.readdirSync("./public/js/customScript/");
    let maps = Array.prototype.map;
    let customScriptList = maps.call(files, function (x) {
      return "./public/js/customScript/" + x;
    });

    let customScripts = customScriptList.map(require);
    return await multiGetValues(customScripts, repoUrl, authToken, secretToken);
  } catch (err) {
    return new Promise((_, reject) => reject(err));
  }
};

const multiGetValues = async (
  customScripts,
  repoUrl,
  authToken,
  secretToken
) => {
  console.log(customScripts);
  let stack = new Array();
  if (customScripts.length > 0) {
    try {
      let values = await customScripts[0].getValues(
        repoUrl,
        authToken,
        secretToken
      );
      stack.push(values);
      customScripts.shift();
      let recursiveStack = await multiGetValues(
        customScripts,
        repoUrl,
        authToken,
        secretToken
      );
      stack = stack.concat(recursiveStack);
      return new Promise((resolve, _) => resolve(stack));
    } catch (err) {
      return new Promise((_, reject) => reject(err));
    }
  }
  return new Promise((resolve, _) => resolve(stack));
};

// customScriptの処理を確認するだけ。
customScript("https://github.com/facebook/react", "", "")
  .then((result) => {
    for (let item of result) {
      if ("title" in item && "values" in item) {
        console.log(item.title, item.values);
      }
    }
  })
  .catch((err) => {
    console.error(err);
  });
