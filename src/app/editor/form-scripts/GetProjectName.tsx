import { FormScript, FormScriptResult } from "./FormScript";

export default class GetProjectName implements FormScript {
  async getValues(repoURL: string): Promise<FormScriptResult> {
    if (!repoURL.startsWith("https://github.com/")) {
      throw new Error("Inputed repository url is not correct.");
    }

    const splitRepoURL = repoURL.split("/");
    if (splitRepoURL.length < 5) {
      throw new Error("Can not specify the repository with the inputed url.");
    }

    return { script: "GetProjectName", values: [splitRepoURL[4]] };
  }
}
