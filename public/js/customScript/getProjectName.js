module.exports.getValues = (repoUrl, authToken, secretToken) => {
  const errorPromise = (message) => {
    return new Promise((_, reject) => reject(new Error(message)));
  };

  if (!repoUrl.startsWith("https://github.com/"))
    return errorPromise("Inputed repository url is not correct.");
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5)
    return errorPromise("Can not specify the repository with the inputed url.");

  const returnJson = {
    title: "Project Name",
    values: [splitRepoUrl[4]],
  };
  return new Promise((resolve, _) => resolve(returnJson));
};
