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

const existFile = (filePath) => {
  try {
    fs.statSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

const getLocalJson = (filePath) => {
  if (existFile(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return json;
  }
  return "cannot read the json file";
};

// ★★★ Generate README Engine ★★★
const inspectTemplateJson = (template) => {
  if (!("sections" in template)) {
    throw new Error("template.json is broken.");
  }
  for (const section of template.sections) {
    if (
      !("title" in section) ||
      !("hidden_title" in section) ||
      !("required" in section) ||
      !("multiple" in section) ||
      !("component" in section) ||
      !("description" in section) ||
      !("attributes" in section)
    ) {
      throw new Error(`${section.title} template.json is broken.`);
    }
  }
  if ("decorations" in template) {
    for (const decoration of template.decorations) {
      if (
        !("title" in decoration) ||
        !("required" in decoration) ||
        !("component" in decoration) ||
        !("description" in decoration) ||
        !("attributes" in decoration)
      ) {
        throw new Error(
          `Decoration:${decoration.title}, template.json is broken.`
        );
      }
    }
  }
};

const inspectContentsJson = (contents) => {
  if (!("repository_url" in contents && "sections" in contents)) {
    throw new Error("contents.json is broken");
  }
  for (const section of contents.sections) {
    if (!("title" in section && "values" in section)) {
      throw new Error(`Section:${section.title}, contents.json is broken.`);
    }
    if (section.values.length == 0) {
      throw new Error(`Section:${section.title}, contents.json is broken.`);
    }
  }
};

// ignoring child component
const generateReadme = (template, contents) => {
  let text = "";
  for (const section of contents.sections) {
    const templateSection = template.sections.find((element) => {
      return element.title == section.title;
    });
    if (typeof templateSection === "undefined") {
      continue;
    }
    if (templateSection.hidden_title === false) {
      text += `# ${section.title}\n`;
    }
    for (const value of section.values) {
      text += `${value}\n`;
    }
    text += "\n";
  }
  console.log(text);
};

// Temporary Calling
const templatePath = "./public/json/template.json";
const templateJson = getLocalJson(templatePath);
try {
  inspectTemplateJson(templateJson);
} catch (error) {
  console.error(error);
}
const sampleContentsPath = "./public/sample_json/contents.json";
const sampleContentsJson = getLocalJson(sampleContentsPath);
try {
  inspectContentsJson(sampleContentsJson);
} catch (error) {
  console.error(error);
}

generateReadme(templateJson, sampleContentsJson);
