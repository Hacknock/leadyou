import React, { FormEventHandler, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { chunked } from "../Utils";
import Forms from "./Forms";
import Preview from "./Preview";
import templateJSON from "../json/template.json";
import "./Editor.css";

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
          return {
            ...sectionState,
            values: values,
          };
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
          return {
            ...sectionState,
            values: values,
            files: files,
          };
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
    const text = editorState.sectionStates.reduce((result, sectionState) => {
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
        .reduce((result, values, i) => {
          const formatedText = formats.reduce((result, format, j) => {
            if (values[j].length > 0) {
              if (output && hasFile) {
                const extension = sectionState.files[i]?.name.split(".").pop() || "";
                const path = `resources/file-${i}-${j}.${extension}`;
                return result + format.replace("%s", path);
              } else {
                return result + format.replace("%s", values[j]);
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

  const generate = () => {
    setShowAlert(true);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    generate();
  };

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
            {editorState.showAlert && <p className="fill-alert">{t("warningForBlankFields")}</p>}
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
