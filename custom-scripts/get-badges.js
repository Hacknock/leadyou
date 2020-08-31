module.exports.getValues = (repoUrl) => {
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
    { name: "issues", path: "issues", jumpKey: "issues" },
    { name: "forks", path: "forks", jumpKey: "network/members" },
    { name: "stars", path: "stars", jumpKey: "stargazers" },
    { name: "top language", path: "languages/top", jumpKey: "" },
    { name: "license", path: "license", jumpKey: "" },
  ];
  let returnJson = {
    title: "Badges",
  };

  let arrayValue = new Array();
  for (const info of badgeInfoList) {
    arrayValue = arrayValue.concat(
      `[![Github ${info.name}](${sieldsUrl}/${info.path}/${splitRepoUrl[3]}/${splitRepoUrl[4]})](${repoUrl}/${info.jumpKey})`
    );
  }
  returnJson.values = arrayValue;
  return new Promise((resolve, _) => resolve(returnJson));
};
