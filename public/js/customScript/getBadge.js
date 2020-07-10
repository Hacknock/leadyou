module.exports.getValues = (repoUrl, authToken, secretToken) => {
  if (!repoUrl.startsWith("https://github.com/"))
    return new Promise((resolve, reject) => {
      reject(new Error("Inputed repository url is not correct."));
    });
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5)
    return new Promise((resolve, reject) => {
      reject(new Error("Can not specify the repository with the inputed url."));
    });
  console.log("Get badge from " + repoUrl);

  const sieldsUrl = "https://img.shields.io/github";
  const badgeInfoList = [
    { name: "issues", jumpKey: "issues" },
    { name: "forks", jumpKey: "network/members" },
    { name: "stars", jumpKey: "stargazers" },
    { name: "license", jumpKey: "" },
  ];
  let returnJson = {
    title: "Badge",
  };

  let arrayValue = new Array();
  for (const info of badgeInfoList) {
    arrayValue = arrayValue.concat(
      `[![Github ${info.name}](${sieldsUrl}/${info.name}/${splitRepoUrl[3]}/${splitRepoUrl[4]})](${repoUrl}/${info.jumpKey})`
    );
  }
  returnJson.values = arrayValue;
  return new Promise((resolve, reject) => resolve(returnJson));
};
