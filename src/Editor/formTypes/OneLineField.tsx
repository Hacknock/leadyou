import React from "react";
import { useTranslation } from "react-i18next";
import "./OneLineField.css";

type Props = {
  title: string;
  description: string;
  required: boolean;
  multiple: boolean;
  placeholder: string | null;
  maxLength: number | null;
  values: string[];
  setValues: (values: string[]) => void;
};

export default function OneLineField(props: Props) {
  const { t } = useTranslation();
  const { description, maxLength, values, setValues } = props;

  let desc: string = description;
  if (maxLength !== null && maxLength > 0) {
    desc = `${description} (in ${maxLength} characters or less)`;
  }

  const rows = values.map((value, i) => {
    return (
      <div key={`one-line-${i}`} className="container">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValues(values.map((v, j) => (j === i ? e.target.value : v)));
          }}
          placeholder={props.placeholder || ""}
          maxLength={maxLength || 140}
        />
        {values.length > 1 && (
          <input
            type="button"
            value="delete"
            onClick={(e) => {
              setValues(values.filter((_, j) => j !== i));
              console.log("delete");
            }}
            className="delete"
          />
        )}
      </div>
    );
  });

  return (
    <div className="one-line-field">
      <h3 className="sub-title">
        {props.title}
        {props.required && <span className="mark-required">*</span>}
      </h3>
      <p>{desc}</p>
      {rows}
      {props.multiple && (
        <input
          type="button"
          value="add"
          onClick={(e) => {
            setValues([...values, ""]);
          }}
          className="add"
        />
      )}
    </div>
  );
}
