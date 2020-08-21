// Control general acrivity on index.html

// Define root element which hold all custome elements.
const rootEle = document.getElementById("area-form");
const outputEle = document.getElementById("area-preview");
let templateJson = new Object();
let sampleContentsJson = new Object();

// ★★★ Inspect format of JSON file ★★★
const inspectTemplateJson = (template) => {
  if (!("sections" in template)) {
    throw new Error("template.json is broken.");
  }
  for (const section of template.sections) {
    if (
      !("title" in section) ||
      !("hiddenTitle" in section) ||
      !("required" in section) ||
      !("replacement" in section) ||
      !("multiple" in section) ||
      !("component" in section) ||
      !("description" in section) ||
      !("kindsOfValues" in section) ||
      !("format" in section) ||
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
  if (!("repository-url" in contents && "sections" in contents)) {
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

const inspectAutoFillJson = (contents) => {
  for (const section of contents) {
    if (!("title" in section && "values" in section)) {
      throw new Error(`Section:${section.title}, contents.json is broken.`);
    }
    if (section.values.length == 0) {
      throw new Error(`Section:${section.title}, contents.json is broken.`);
    }
  }
};

// Get template.json which describe the layout of input form
const getJson = async (url, inspector) => {
  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    inspector(json);
    return json;
  } catch (error) {
    throw error;
  }
};

const convertToId = (title) => {
  return title.replace(" ", "-");
};

// function which generate the form user input information.
const generateForm = (tempJson, autoJson, index) => {
  // console.log(JSON.stringify(tempJson));
  // console.log(JSON.stringify(autoJson));
  for (const section of tempJson.sections) {
    const childElement = document.createElement(
      tempJson.sections[index].component
    );

    childElement.setAttributeNS(
      null,
      "name-title",
      tempJson.sections[index]["title"]
    );
    childElement.setAttributeNS(
      null,
      "required",
      tempJson.sections[index]["required"]
    );
    childElement.setAttributeNS(
      null,
      "desc-short",
      tempJson.sections[index]["description"]
    );
    childElement.setAttributeNS(
      null,
      "hiddenTitle",
      tempJson.sections[index]["hiddenTitle"]
    );
    childElement.setAttributeNS(
      null,
      "multiple",
      tempJson.sections[index]["multiple"]
    );
    childElement.setAttributeNS(
      null,
      "placeholder",
      tempJson.sections[index].attributes["placeholder"]
    );

    if ("maxlength" in tempJson.sections[index].attributes) {
      childElement.setAttributeNS(
        null,
        "maxlength",
        tempJson.sections[index].attributes["maxlength"]
      );
    }
    if ("kindsOfFile" in tempJson.sections[index].attributes) {
      childElement.setAttributeNS(
        null,
        "kindsOfFile",
        tempJson.sections[index].attributes["kindsOfFile"].join(",")
      );
    }
    childElement.setAttributeNS(null, "alert", "false");
    childElement.setAttributeNS(null, "class", "info-box");
    childElement.setAttributeNS(
      null,
      "id",
      convertToId(tempJson.sections[index].title)
    );
    childElement.setAttributeNS(
      null,
      "value",
      convertToId(tempJson.sections[index].title)
    );

    if (Object.keys(autoJson).length > 0) {
      const templateSection = autoJson.find(
        (element) => element.title == section.title
      );
      if (typeof templateSection !== "undefined") {
        childElement.setAttributeNS(
          null,
          "values",
          JSON.stringify(templateSection.values)
        );
      }
    }
    rootEle.appendChild(childElement);
    ++index;
  }
};

const getColumnData = (listColumn, referNum) => {
  let arrayC = new Array();
  if (listColumn.length > referNum) {
    const allColumns = listColumn[referNum].querySelectorAll(".column");
    for (let i = 0; i < allColumns.length; i++) {
      arrayC.push(allColumns[i].value);
    }
    // content = listColumn[referNum].querySelector(".column").value;
    // arrayC.push(content);
    arrayC = arrayC.concat(getColumnData(listColumn, ++referNum));
  }
  return arrayC;
};

// ★★★ Generate README Engine ★★★
const generateJson = (listEle, tempJson, index) => {
  let arraySec = new Array();
  if (typeof tempJson.sections[index] !== "undefined") {
    const root = listEle[index].shadowRoot;
    let stackEles = root.querySelectorAll(".field");
    let secTitle = root.querySelector(".sub-title").textContent;
    let values = getColumnData(stackEles, 0);
    const lenValue = values.reduce((prev, current) => {
      return prev + current.length;
    }, 0);
    const kindsOfValues = tempJson.sections[index]["kindsOfValues"];
    if (lenValue !== 0 && values.length % kindsOfValues.length === 0) {
      arraySec.push({
        title: secTitle,
        values: values,
      });
    }
    arraySec = arraySec.concat(generateJson(listEle, tempJson, ++index));
  }
  return arraySec;
};

const createContentsJson = () => {
  const sectionsJson = generateJson(
    document.getElementsByClassName("info-box"),
    templateJson,
    0
  );
  return {
    "repository-url": "",
    "project-icon": "",
    sections: sectionsJson,
  };
};

const divideArraybyN = (array, n) => {
  const newArray = [];
  for (let i = 0; i < Math.ceil(array.length / n); i++) {
    const j = i * n;
    newArray.push(array.slice(j, j + n));
  }
  return newArray;
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
    const n = templateSection["kindsOfValues"].length;
    const valueText = divideArraybyN(section.values, n)
      .reduce((prev, current) => {
        let length = 0;
        let text = templateSection.format;
        for (const value of current) {
          length += value.length;
          text = text.replace("%s", value);
        }
        return length === 0 ? prev : prev + text;
      }, "")
      .trimEnd();
    if (templateSection["hiddenTitle"] === false) {
      if (templateSection.replacement) {
        text += `# ${valueText}\n`;
      } else {
        text += `# ${section.title}\n`;
        text += `${valueText}\n`;
      }
    } else {
      text += `${valueText}\n`;
    }
    text += "\n";
  }
  return text;
};

const inspectRequired = (eleList, referNum) => {
  let returnNum = 0;
  if (eleList.length > referNum) {
    if (eleList[referNum].getAttribute("required") === "true") {
      if (
        eleList[referNum].shadowRoot
          .querySelector(".field")
          .querySelector(".column").value === ""
      ) {
        eleList[referNum].setAttribute("alert", "true");
        document.getElementById("fill-alert").textContent =
          "赤枠は必須項目なので、入力してください。";
        returnNum = -1 + inspectRequired(eleList, ++referNum);
      } else {
        eleList[referNum].setAttribute("alert", "false");
        returnNum = 0 + inspectRequired(eleList, ++referNum);
      }
    } else {
      returnNum = 0 + inspectRequired(eleList, ++referNum);
    }
  }
  return returnNum;
};

const getQueryStringParams = (query) => {
  const hoge = /^[?#]/.test(query) ? query.slice(1) : query;
  return hoge.split("&").reduce((params, param) => {
    let [key, value] = param.split("=");
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
    return params;
  }, {});
};

const inspectParams = (params) => {
  if (!("owner" in params) || !("repo" in params) || !("autofill" in params)) {
    throw new Error("Illegal Query");
  }
};

const renderForm = async () => {
  try {
    // template.jsonを取得
    const template = await getJson(
      "/src/json/template.json",
      inspectTemplateJson
    );

    // auto fill用のcontents.jsonを取得
    let autoFillJson = {};
    const hasAPILife = true;
    const params = getQueryStringParams(window.location.search);

    if (
      !("owner" in params) ||
      !("repo" in params) ||
      !("autofill" in params) ||
      params.autofill !== "true"
    ) {
      return Promise.resolve({
        temp: template,
        auto: {},
      });
    }
    if (hasAPILife) {
      const url = `/getvalues?owner=${params.owner}&repo=${params.repo}`;
      autoFillJson = await getJson(url, inspectAutoFillJson);
    } else {
      const json = await getJson(
        "/src/json/sample-contents.json",
        inspectContentsJson
      );
      autoFillJson = json.sections;
    }
    return Promise.resolve({
      temp: template,
      auto: autoFillJson,
    });
  } catch (err) {
    throw err;
  }
};

// ★★★ Preview & Save README.md ★★★
const extractResourcePath = (template, contents) => {
  const filepathArray = contents.sections
    .map((section) => {
      const templateSection = template.sections.find((element) => {
        return element.title === section.title;
      });
      return {
        contentsSection: section,
        templateSection: templateSection,
      };
    })
    .filter(({ templateSection }) => {
      return (
        typeof templateSection !== "undefined" &&
        templateSection["kindsOfValues"].includes("filepath")
      );
    })
    .flatMap(({ contentsSection, templateSection }) => {
      const n = templateSection["kindsOfValues"].length;
      let array = new Array();
      for (let i = 0; i < contentsSection.values.length; i++) {
        if (templateSection["kindsOfValues"][i % n] === "filepath") {
          array.push(contentsSection.values[i]);
        }
      }
      return array;
    });
  const nameArray = Array.from({ length: filepathArray.length }).map(
    (_, index) => `file-${index}`
  );
  return {
    paths: filepathArray,
    names: nameArray,
  };
};

const replaceContentsPaths = (paths, newPaths, contents) => {
  let jsonString = JSON.stringify(contents);
  for (let i = 0; i < paths.length; i++) {
    jsonString = jsonString.replace(paths[i], newPaths[i]);
  }
  return JSON.parse(jsonString);
};

const saveBlob = (blob, filename) => {
  const blobUrl = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.setAttribute("href", blobUrl);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const downloadMarkdown = async (filename, templateJson, contentsJson) => {
  const resources = extractResourcePath(templateJson, contentsJson);
  let zip = new JSZip();
  let folder = zip.folder(filename);
  let resourceFolder = folder.folder("resources");
  let newPaths = new Array();
  for (const [index, path] of resources.paths.entries()) {
    const response = await fetch(path);
    const content = await response.blob();
    const extension = content.type.split("/").slice(-1)[0];
    const imageName = `${resources.names[index]}.${extension}`;
    newPaths.push(`resources/${imageName}`);
    resourceFolder.file(imageName, content);
  }
  const newContentsJson = replaceContentsPaths(
    resources.paths,
    newPaths,
    contentsJson
  );
  const newMD = generateReadme(templateJson, newContentsJson);
  const mdBlob = new Blob([newMD], {
    type: "application/octet-stream",
  });
  folder.file("README.md", mdBlob);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveBlob(zipBlob, filename);
};

const preview = (flag) => {
  const contentsJson = createContentsJson();
  try {
    if (Object.keys(templateJson).length === 0) {
      throw new Error("template.json is empty.");
    }
    inspectContentsJson(contentsJson);
    const md = generateReadme(templateJson, contentsJson);
    outputEle.innerHTML = marked(md);
    if (typeof flag !== "undefined" && flag)
      downloadMarkdown("README", templateJson, contentsJson);
  } catch (error) {
    console.error(error);
  }
};

// ★★★ Calling Method ★★★
renderForm()
  .then((obj) => {
    if (Object.keys(obj).length === 0) return;
    templateJson = obj.temp;
    generateForm(obj.temp, obj.auto, 0);
    setInterval(preview, 1000);
  })
  .catch((err) => {
    console.error(err);
    alert(err);
  });

// Submitボタンを押した時の処理
document.getElementById("submit").addEventListener("click", () => {
  if (inspectRequired(document.getElementsByClassName("info-box"), 0) === 0) {
    document.getElementById("fill-alert").textContent = "";
    preview(true);
  } else {
    // アラートを出す？
  }
});
