import React, { useState, useEffect, FormEventHandler } from "react";
import { Trans, useTranslation } from "react-i18next";
import { chunked } from "../Utils";
import JSZip from "jszip";
import Forms from "./Forms";
import Preview from "./Preview";
import GetProjectName from "./formScripts/GetProjectName";
import GetShortDescription from "./formScripts/GetShortDescription";
import GetBadges from "./formScripts/GetBadges";
import GetContributors from "./formScripts/GetContributors";
import templateJSON from "../json/template.json";
import "./Editor.css";
import { FormScript } from "./formScripts/FormScript";

type Props = {
  owner: string | null;
  repo: string | null;
  autoFill: boolean;
};

type Attributes = {
  kindsOfFile?: string[];
  placeholder?: string;
  maxLength?: number;
};

type Decoration = {
  title: string;
  description: string;
  required: boolean;
  formType: string;
  attributes: Attributes;
};

type Section = {
  title: string;
  description: string;
  required: boolean;
  multiple: boolean;
  hiddenTitle: boolean;
  replacingTitle: boolean;
  formType: string;
  kindsOfValues: string[];
  formats: string[];
  attributes: Attributes;
  script: string;
};

type Template = {
  decorations: Decoration[];
  sections: Section[];
};

type SectionState = {
  section: Section;
  values: string[];
  files: (File | null)[];
};

export type EditorState = {
  showAlert: boolean;
  sectionStates: SectionState[];
};

export default function Editor(props: Props) {
  const { owner, repo, autoFill } = props;
  const { t } = useTranslation();
  const formScripts: FormScript[] = [
    new GetProjectName(),
    new GetShortDescription(),
    new GetBadges(),
    new GetContributors(),
  ];

  const initialState: EditorState = {
    showAlert: false,
    sectionStates: (templateJSON as Template).sections.map(
      (section): SectionState => ({
        section: section,
        values: Array(section.kindsOfValues.length || 1).fill(""),
        files: [null],
      })
    ),
  };
  const [editorState, setEditorState] = useState(initialState);

  const setValues = (at: number, values: string[]) => {
    setEditorState({
      ...editorState,
      sectionStates: editorState.sectionStates.map((sectionState, index): SectionState => {
        if (index === at) {
          return { ...sectionState, values: values };
        } else {
          return sectionState;
        }
      }),
    });
  };

  const setFiles = (at: number, values: string[], files: (File | null)[]) => {
    setEditorState({
      ...editorState,
      sectionStates: editorState.sectionStates.map((sectionState, index): SectionState => {
        if (index === at) {
          return { ...sectionState, values: values, files: files };
        } else {
          return sectionState;
        }
      }),
    });
  };

  const setShowAlert = (showAlert: boolean) => {
    setEditorState({ ...editorState, showAlert: showAlert });
  };

  const composeReadme = (output: boolean) => {
    const text = editorState.sectionStates.reduce((result, sectionState, i) => {
      const { title, hiddenTitle, replacingTitle, kindsOfValues, formats } = sectionState.section;
      let text = "";
      const isEmpty =
        sectionState.values.reduce((result, value) => {
          return result + value.length;
        }, 0) === 0;
      if (isEmpty) {
        return result;
      }
      const hasFile = sectionState.section.attributes.kindsOfFile !== undefined;
      const valueText = chunked(sectionState.values, kindsOfValues.length)
        .reduce((result, values, j) => {
          const formatedText = formats.reduce((result, format, k) => {
            if (values[k].length > 0) {
              if (output && hasFile && kindsOfValues[k] === "filePath") {
                const extension = sectionState.files[j]?.name.split(".").pop() || "";
                const path = `resources/file-${i}-${j}.${extension}`;
                return result + format.replace("%s", path);
              } else {
                return result + format.replace("%s", values[k]);
              }
            } else {
              return result;
            }
          }, "");
          return result + formatedText;
        }, "")
        .trimEnd();
      if (hiddenTitle === false) {
        if (replacingTitle) {
          text += `# ${valueText}\n`;
        } else {
          text += `# ${title}\n\n`;
          text += `${valueText}\n`;
        }
      } else {
        text += `<!-- # ${title} -->\n\n`;
        text += `${valueText}\n`;
      }
      text += "\n";
      return result + text;
    }, "");
    return text + "<!-- CREATED_BY_LEADYOU_README_GENERATOR -->";
  };

  const checkRequirements = () => {
    for (const sectionState of editorState.sectionStates) {
      if (sectionState.section.required) {
        const isEmpty =
          sectionState.values.reduce((result, value) => {
            return result + value.length;
          }, 0) === 0;
        if (isEmpty) return false;
      }
    }
    return true;
  };

  const saveBlob = (blob: Blob, filename: string) => {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${filename}.zip`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  const download = async (filename: string) => {
    const zip = new JSZip();
    const folder = zip.folder(filename);
    if (folder === null) return;
    const resourceFolder = folder.folder("resources");
    if (resourceFolder === null) return;
    editorState.sectionStates.forEach((sectionState, i) => {
      sectionState.files.forEach((file, j) => {
        if (file !== null) {
          const extension = file.name.split(".").pop() || "";
          const resourceName = `file-${i}-${j}.${extension}`;
          resourceFolder.file(resourceName, file);
        }
      });
    });
    const readme = composeReadme(true);
    const readmeBlob = new Blob([readme], { type: "application/octet-stream" });
    folder.file("README.md", readmeBlob);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveBlob(zipBlob, filename);
  };

  const generate = () => {
    if (checkRequirements()) {
      download("README").finally(() => {
        setShowAlert(false);
      });
    } else {
      if (confirm(t("confirmGenerate") || undefined)) {
        download("README").finally(() => {
          setShowAlert(true);
        });
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    generate();
  };

  useEffect(() => {
    if (owner !== null && repo !== null && autoFill) {
      const repoURL = `https://github.com/${owner}/${repo}`;
      const promises = formScripts.map((formScript) => {
        return formScript.getValues(repoURL);
      });

      Promise.all(promises)
        .then((response) => {
          const sectionStates = editorState.sectionStates.map((sectionState): SectionState => {
            const item = response.find((item) => {
              return item.title === sectionState.section.title;
            });
            if (item !== undefined) {
              return { ...sectionState, values: item.values };
            } else {
              return sectionState;
            }
          });
          setEditorState({ ...editorState, sectionStates: sectionStates });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="editor">
      <div className="edit-area">
        <h2>{t("inputForm")}</h2>
        <div className="edit-inner">
          <form onSubmit={handleSubmit}>
            <Forms editorState={editorState} setValues={setValues} setFiles={setFiles} />
            <p className="proviso">
              <Trans
                i18nKey="proviso-1"
                components={{ l: <a href="?scene=document&pageid=terms-of-service" /> }}
              />
              <Trans i18nKey="proviso-2" components={{ l: <a href="/" /> }} />
              <Trans
                i18nKey="proviso-3"
                components={{ l: <a href="?scene=document&pageid=help" /> }}
              />
            </p>
            <input type="submit" value={t("generate") || undefined} />
            {editorState.showAlert && <p className="fill-alert">{t("warningForRequirements")}</p>}
          </form>
        </div>
      </div>
      <div className="preview-area">
        <h2>{t("previewReadme")}</h2>
        <div className="md-content">
          <Preview markdownText={composeReadme(false)} />
        </div>
      </div>
    </div>
  );
}
