// Control general acrivity on index.html

// Define root element which hold all custome elements.
const rootEle = document.getElementById("areaForm");
const outputEle = document.getElementById("output");
let templateJson = new Object();
let sampleContentsJson = new Object();

// Inspect format of json
const inspectTemplateJson = (template) => {
  if (!("sections" in template)) {
    throw new Error("template.json is broken.");
  }
  for (const section of template.sections) {
    if (
      !("title" in section) ||
      !("hidden_title" in section) ||
      !("required" in section) ||
      !("replacement" in section) ||
      !("multiple" in section) ||
      !("component" in section) ||
      !("description" in section) ||
      !("delimiter" in section) ||
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
  // console.log(title)
  // console.log(title.replace(' ', '_'));
  return title.replace(" ", "_");
};

// function which generate the form user input information.
const generateForm = (tempJson, index) => {
  if (tempJson.sections.length > index) {
    const childElement = document.createElement(
      tempJson.sections[index].component
    );
    childElement.setAttributeNS(
      null,
      "nameTitle",
      tempJson.sections[index].title
    );
    childElement.setAttributeNS(
      null,
      "required",
      tempJson.sections[index].required
    );
    childElement.setAttributeNS(
      null,
      "descShort",
      tempJson.sections[index].description
    );
    childElement.setAttributeNS(
      null,
      "hiddenTitle",
      tempJson.sections[index].hidden_title
    );
    childElement.setAttributeNS(
      null,
      "multiple",
      tempJson.sections[index].multiple
    );
    childElement.setAttributeNS(null, "class", "infoBox");
    childElement.setAttributeNS(
      null,
      "id",
      convertToId(tempJson.sections[index].title)
    );
    rootEle.appendChild(childElement);
    generateForm(tempJson, ++index);
  } else {
    // console.log("Finish read read_sections");
  }
};

const getColumnData = (listColumn, referNum) => {
  let arrayC = new Array();
  if (listColumn.length > referNum) {
    content = listColumn[referNum].querySelector(".column").value;
    arrayC.push(content);
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
    let secTitle = root.querySelector("h2").textContent;
    let value = getColumnData(stackEles, 0);
    arraySec.push({
      title: secTitle,
      values: value,
    });
    arraySec = arraySec.concat(generateJson(listEle, tempJson, ++index));
  }
  return arraySec;
};

const createContentsJson = () => {
  const sectionsJson = generateJson(
    document.getElementsByClassName("infoBox"),
    templateJson,
    0
  );
  return {
    repository_url: "https://hacknock.com",
    project_icon: "hogehoge.ico",
    sections: sectionsJson,
  };
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
    const valueText = section.values.reduce((prev, current) => {
      return prev + `${current}${templateSection.delimiter}`;
    });
    if (templateSection.hidden_title === false) {
      if (templateSection.replacement) {
        text += `# ${valueText}\n`;
      } else {
        text += `# ${section.title}\n`;
        text += valueText;
      }
    } else {
      text += valueText;
    }
    text += "\n";
  }
  return text;
};

// call at loaded
getJson("/src/json/template.json", inspectTemplateJson)
  .then((json) => {
    templateJson = json;
    generateForm(json, 0);
  })
  .catch((error) => {
    console.error(error);
  });

getJson("/src/json/sample_contents.json", inspectContentsJson)
  .then((json) => {
    sampleContentsJson = json;
  })
  .catch((error) => {
    console.error(error);
  });

// Submitボタンを押した時の処理
document.getElementById("submit").addEventListener("click", () => {
  if (inspectRequired(document.getElementsByClassName("infoBox"), 0) === 0) {
    const contentsJson = createContentsJson();
    console.log(contentsJson);
    try {
      if (Object.keys(templateJson).length === 0) {
        throw new Error("template.json is empty.");
      }
      inspectContentsJson(contentsJson);
      outputEle.innerHTML = marked(generateReadme(templateJson, contentsJson));
    } catch (error) {
      console.error(error);
    }
  } else {
    // アラートを出す？
  }

  // とりあえず、サンプルのcontents.jsonから生成する
  // try {
  //   if (
  //     Object.keys(templateJson).length === 0 ||
  //     Object.keys(sampleContentsJson).length === 0
  //   ) {
  //     throw new Error("template.json or contents.json are empty.");
  //   }
  //   outputEle.innerHTML = marked(
  //     generateReadme(templateJson, sampleContentsJson)
  //   );
  // } catch (error) {
  //   console.error(error);
  // }
});

const inspectRequired = (eleList, referNum) => {
  let returnNum = 0;
  if (eleList.length > referNum) {
    // console.log(eleList[referNum].shadowRoot.querySelector("h2").textContent);
    console.log(eleList[referNum].getAttribute("required"));
    if (eleList[referNum].getAttribute("required") === "true") {
      // console.log(eleList[referNum].shadowRoot.querySelector("h2").textContent);
      if (
        eleList[referNum].shadowRoot
          .querySelector(".field")
          .querySelector(".column").value === ""
      ) {
        eleList[referNum].shadowRoot.querySelector("style").textContent += `

          .column {
            border-color: #f00;
          }

          `;

        returnNum = -1 + inspectRequired(eleList, ++referNum);
      } else {
        eleList[referNum].shadowRoot.querySelector("style").textContent += `

          .column {
            border-color: #000;
          }

          `;
        returnNum = 0 + inspectRequired(eleList, ++referNum);
      }
    } else {
      returnNum = 0 + inspectRequired(eleList, ++referNum);
    }
  }
  return returnNum;
};
