module.exports.getValues = (repoUrl, authToken, secretToken) => {
  const errorPromise = (message) => {
    return new Promise((_, reject) => reject(new Error(message)));
  };

  if (!repoUrl.startsWith("https://github.com/"))
    return errorPromise("Inputed repository url is not correct.");
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5)
    return errorPromise("Can not specify the repository with the inputed url.");

  const sieldsUrl = "https://img.shields.io/github";
  const badgeInfoList = [
    { name: "issues", jumpKey: "issues" },
    { name: "forks", jumpKey: "network/members" },
    { name: "stars", jumpKey: "stargazers" },
    { name: "license", jumpKey: "" },
  ];
  let returnJson = {
    title: "Badges",
  };

  let arrayValue = new Array();
  for (const info of badgeInfoList) {
    arrayValue = arrayValue.concat(
      `[![Github ${info.name}](${sieldsUrl}/${info.name}/${splitRepoUrl[3]}/${splitRepoUrl[4]})](${repoUrl}/${info.jumpKey})`
    );
  }
  returnJson.values = arrayValue;
  return new Promise((resolve, _) => resolve(returnJson));
};
