import React from "react";
import { useTranslation } from "react-i18next";
import "./Editor.css";

type Props = {
  lang: string;
  owner: string | null;
  repo: string | null;
  autoFill: boolean;
};

export default function Editor(props: Props) {
  const { lang, owner, repo, autoFill } = props;
  const { t } = useTranslation();

  return <div className="editor">hello</div>;
}
