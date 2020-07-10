const fetch = require("node-fetch");

module.exports.getValues = (repoUrl, authToken, secretToken) => {
  if (!repoUrl.startsWith("https://github.com/"))
    throw new Error("Inputed repository url is not correct.");
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5)
    throw new Error("Can not specify the repository with the inputed url.");

  const requestURL = `https://api.github.com/repos/${splitRepoUrl[3]}/${splitRepoUrl[4]}/contributors`;

  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  return fetch(requestURL, options)
    .then((res) => res.json())
    .then((res) => {
      let returnJson = {
        title: "Contributors",
      };
      let arrayValue = new Array();
      for (const user of res) {
        arrayValue = arrayValue.concat(user.login);
      }
      returnJson.values = arrayValue;
      return returnJson;
    })
    .catch((err) => {
      throw err;
    });
};
