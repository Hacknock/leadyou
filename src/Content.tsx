import React from "react";
import "./Content.css";

type Props = {
  lang: string;
};

export default function Content(props: Props) {
  const { lang } = props;

  return (
    <div className="content">
      <div className="section">
        <h1>Hello World</h1>
      </div>
    </div>
  );
}
