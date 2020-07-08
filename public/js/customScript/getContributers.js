module.exports.getValues = (repoUrl, authToken, secretToken) => {
  if (repoUrl.indexOf("https://github.com/") === 0) {
    // console.log("nyao");
    return { title: "Hello", values: ["Worlds"] };
  } else {
    console.log("This url is not available.");
  }
  return { title: "Hello", values: ["Worlds"] };
};
