import React from "react";
import OneLineField from "./formTypes/OneLineField";
import MultiLineField from "./formTypes/MultiLineField";
import AttachmentWithMultiLineField from "./formTypes/AttachmentWithMultiLineField";
import templateJSON from "./json/template.json";

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

export default function Forms() {
  const template = templateJSON as Template;

  const forms = template.sections
    .map((section) => {
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
            />
          );
      }
    })
    .flatMap((item) => [item, <hr className="separate-form" />]);

  return <React.Fragment>{forms}</React.Fragment>;
}
