// Control general acrivity on index.html

// Define root element which hold all custome elements.
const rootEle = document.getElementById("areaForm");
const outputEle = document.getElementById("output");
let templateJson = new Object();

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

// Get template.json which describe the layout of input form
const getTemplateJson = async () => {
  const myHeaders = new Headers();
  const myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };
  const myRequest = new Request("/src/json/template.json", myInit);
  try {
    const response = await fetch(myRequest);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      inspectTemplateJson(json);
      return json;
    } else {
      throw new TypeError("Oops, we haven't got JSON!");
    }
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

// ★★★ Generate README Engine ★★★
const generateJson = (listEle, tempJson, index) => {
  let arraySec = new Array();
  let arrayChild = new Array();
  if (typeof tempJson.sections[index] !== "undefined") {
    const root = listEle[index].shadowRoot;
    console.log(root);
    console.log(root.querySelectorAll(".field").length);

    // if (root.querySelector(".field").type === "text") {
    //   // console.log(root.querySelector('h2').textContent);
    //   // console.log(root.querySelector('.field').value);
    //   arrayChild.push(root.querySelector(".field").value);
    //   arraySec.push({
    //     title: root.querySelector("h2").textContent,
    //     values: arrayChild,
    //   });
    // } else if (root.querySelector(".field").type === "radio") {
    //   // console.log(root.querySelector('h2').textContent);
    //   // console.log(root.querySelectorAll('.field')[0].checked);
    //   // console.log(root.querySelectorAll('.field')[1].checked);
    //   arrayChild.push(root.querySelectorAll(".field")[0].checked);
    //   arrayChild.push(root.querySelectorAll(".field")[1].checked);
    //   arraySec.push({
    //     title: root.querySelector("h2").textContent,
    //     values: arrayChild,
    //   });
    // } else if (root.querySelectorAll(".files").length) {
    //   console.log(root.querySelector(".files").querySelectorAll(".column"));
    // }
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
    if (templateSection.hidden_title === false) {
      text += `# ${section.title}\n`;
    }
    for (const value of section.values) {
      text += `${value}\n`;
    }
    text += "\n";
  }
  return text;
};

// call at loaded
getTemplateJson()
  .then((json) => {
    templateJson = json;
    generateForm(json, 0);
  })
  .catch((error) => {
    console.error(error);
  });

// Submitボタンを押した時の処理
document.getElementById("submit").addEventListener("click", () => {
  const contentsJson = createContentsJson();
  try {
    if (Object.keys(templateJson).length === 0) {
      throw new Error("template.json is empty.");
    }
    inspectContentsJson(contentsJson);
    outputEle.textContent = generateReadme(templateJson, contentsJson);
  } catch (error) {
    console.error(error);
  }
});
