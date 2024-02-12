import { FormScript, FormScriptResult } from "./FormScript";

type BadgeInfo = {
  name: string;
  path: string;
  jumpKey: string;
};

export default class GetBadges implements FormScript {
  async getValues(repoURL: string): Promise<FormScriptResult> {
    if (!repoURL.startsWith("https://github.com/")) {
      throw new Error("Inputed repository url is not correct.");
    }
    const splitRepoURL = repoURL.split("/");
    if (splitRepoURL.length < 5) {
      throw new Error("Can not specify the repository with the inputed url.");
    }

    const sieldsURL = "https://img.shields.io/github";
    const badgeInfoList: BadgeInfo[] = [
      { name: "issues", path: "issues", jumpKey: "issues" },
      { name: "forks", path: "forks", jumpKey: "network/members" },
      { name: "stars", path: "stars", jumpKey: "stargazers" },
      { name: "top language", path: "languages/top", jumpKey: "" },
      { name: "license", path: "license", jumpKey: "" },
    ];

    const values = badgeInfoList.map((info) => {
      const url = `${sieldsURL}/${info.path}/${splitRepoURL[3]}/${splitRepoURL[4]})](${repoURL}/${info.jumpKey}`;
      return `[![Github ${info.name}](${url})`;
    });

    return { title: "Badges", values: values };
  }
}
