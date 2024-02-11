import React from "react";
import { EditorState } from "./Editor";
import OneLineField from "./formTypes/OneLineField";
import MultiLineField from "./formTypes/MultiLineField";
import AttachmentWithMultiLineField from "./formTypes/AttachmentWithMultiLineField";

type Props = {
  editorState: EditorState;
  setValues: (at: number, values: string[]) => void;
};

export default function Forms(props: Props) {
  const { editorState, setValues } = props;

  const forms = editorState.sectionStates
    .map(({ section, values }, index) => {
      switch (section.formType) {
        case "one-line-field":
          return (
            <OneLineField
              title={section.title}
              description={section.description}
              required={section.required}
              multiple={section.multiple}
              placeholder={section.attributes.placeholder || null}
              maxLength={section.attributes.maxLength || null}
              values={values}
              setValues={(values) => setValues(index, values)}
            />
          );
        case "multi-line-field":
          return (
            <MultiLineField
              title={section.title}
              description={section.description}
              required={section.required}
              multiple={section.multiple}
              placeholder={section.attributes.placeholder || null}
              maxLength={section.attributes.maxLength || null}
              values={values}
              setValues={(values) => setValues(index, values)}
            />
          );
        case "attachment-with-multi-line-field":
          return (
            <AttachmentWithMultiLineField
              title={section.title}
              description={section.description}
              required={section.required}
              multiple={section.multiple}
              placeholder={section.attributes.placeholder || null}
              maxLength={section.attributes.maxLength || null}
              values={values}
              setValues={(values) => setValues(index, values)}
            />
          );
      }
    })
    .flatMap((item) => [item, <hr className="separate-form" />]);

  return <React.Fragment>{forms}</React.Fragment>;
}
