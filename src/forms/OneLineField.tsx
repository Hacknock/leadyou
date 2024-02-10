import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./OneLineField.css";

type Props = {
  title: string;
  hiddenTitle: boolean;
  description: string;
  required: boolean;
  multiple: boolean;
  placeholder: string | null;
  maxLength: number | null;
};

export default function OneLineField(props: Props) {
  const { t } = useTranslation();
  const { title, hiddenTitle, description, required, multiple, placeholder, maxLength } = props;

  let desc: string = description;
  if (maxLength !== null && maxLength > 0) {
    desc = `${description} (in ${maxLength} characters or less)`;
  }

  const [values, setValues] = useState([""]);
  const rows = values.map((value, i) => {
    return (
      <div key={`one-line-${i}`} className="container">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValues(values.map((v, j) => (j === i ? e.target.value : v)));
          }}
          placeholder={placeholder || ""}
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
      {!hiddenTitle && (
        <h3 className="sub-title">
          {title}
          {required && <span className="mark-required">*</span>}
        </h3>
      )}
      <p>{desc}</p>
      {rows}
      {multiple && (
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
