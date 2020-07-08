module.exports.getBadge = (repoUrl, authToken, secretToken) => {
  const sieldsUrl = "https://img.shields.io/github";
  const badgeList = ["release", "issues", "forks", "stars", "license"];
  const badgeNameList = [
    "Release version",
    "Issues",
    "Forks",
    "Stars",
    "License",
  ];
  let returnJson = new Object();

  if (repoUrl.indexOf("https://github.com/") === 0) {
    console.log("Get badge from " + repoUrl);

    // split with delimiter
    const splitRepoUrl = repoUrl.split("/");
    returnJson.title = "Badge";
    let arrayValue = new Array();

    for (let i = 0; i < badgeList.length; i++) {
      arrayValue = arrayValue.concat(
        "[![" +
          badgeNameList[i] +
          "](" +
          sieldsUrl +
          "/" +
          badgeList[i] +
          "/" +
          splitRepoUrl[3] +
          "/" +
          splitRepoUrl[4] +
          ")](" +
          repoUrl +
          ")"
      );
    }

    returnJson.value = arrayValue;
    console.log(returnJson);
    return returnJson;
  } else {
    console.log("This url is not available.");
  }
};
