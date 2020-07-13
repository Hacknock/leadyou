const fetch = require("node-fetch");

module.exports.getValues = (repoUrl, authToken, secretToken) => {
  const errorPromise = (message) => {
    return new Promise((_, reject) => reject(new Error(message)));
  };

  if (!repoUrl.startsWith("https://github.com/"))
    return errorPromise("Inputed repository url is not correct.");
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5)
    return errorPromise("Can not specify the repository with the inputed url.");

  const requestURL = `https://api.github.com/repos/${splitRepoUrl[3]}/${splitRepoUrl[4]}`;

  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  return fetch(requestURL, options)
    .then((res) => res.json())
    .then((res) => {
      return {
        title: "Short Description",
        values: [res.description],
      };
    })
    .catch((err) => {
      throw err;
    });
};
