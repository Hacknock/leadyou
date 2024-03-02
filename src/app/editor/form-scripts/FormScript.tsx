export type FormScriptResult = {
  script: string;
  values: string[];
};

export interface FormScript {
  getValues(repoURL: string): Promise<FormScriptResult>;
}
