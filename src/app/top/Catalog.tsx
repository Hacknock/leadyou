import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { parse } from "marked";
import styles from "../support/Marked.css";
import "./Catalog.css";

type Repository = {
  ownerRepo: string;
  rawURL: string;
  sha: string;
};

export type CatalogObject = {
  totalCount: number;
  repositories: Repository[];
};

type Props = {
  catalog: CatalogObject;
};

type README = {
  repo: Repository;
  text: string;
};

export default function Catalog(props: Props) {
  const { catalog } = props;
  const { t } = useTranslation();
  const [readmes, setReadmes] = useState<README[]>([]);

  const getReadme = async (repo: Repository) => {
    try {
      const response = await fetch(repo.rawURL);
      const text = await response.text();
      return { repo: repo, text: text };
    } catch (error) {
      console.error(error);
      return { repo: repo, text: "" };
    }
  };

  const convertURLtoGitHubURL = (
    ownerRepo: string,
    sha: string,
    tag: string,
    item: string,
    text: string
  ) => {
    let text_ = text;
    const regex = /http(s)?:\/\/.+/;
    if (regex.test(item)) {
      // httpsにマッチした場合
      const newTag = tag.replace(
        `://github.com/${ownerRepo}/blob/`,
        `://github.com/${ownerRepo}/raw/`
      );
      text_ = text_.replace(tag, newTag);
    } else {
      // 相対パスだった場合（万能ではない）
      const matched = item.match(/^(\.\/)*(.+)/);
      if (matched !== null) {
        const newTag = tag.replace(
          item,
          `https://github.com/${ownerRepo}/raw/${sha}/${matched[2]}`
        );
        text_ = text_.replace(tag, newTag);
      }
    }
    return text_;
  };

  const convertMarkdownImageLink = (ownerRepo: string, sha: string, text: string) => {
    let text_ = text;
    const tags = text_.match(/!\[([^\[\]\(\)]*?)\]\(([^\[\]\(\)]*?)\)/g);
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        const matched = tag.match(/^!\[.*?\]\((.*?)\)$/);
        if (matched !== null) {
          text_ = convertURLtoGitHubURL(ownerRepo, sha, tag, matched[1], text_);
        }
      }
    }
    return text_;
  };

  const convertHTMLImageLink = (ownerRepo: string, sha: string, text: string) => {
    let text_ = text;
    const tags = text_.match(/(<img src="(.*?)"|<img .*? src="(.*?)")/g);
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        const matched = tag.match(/^(<img src="(.*?)"|<img .*? src="(.*?)")$/);
        if (matched !== null) {
          if (typeof matched[2] !== "undefined") {
            text_ = convertURLtoGitHubURL(ownerRepo, sha, tag, matched[2], text_);
          } else if (typeof matched[3] !== "undefined") {
            text_ = convertURLtoGitHubURL(ownerRepo, sha, tag, matched[3], text_);
          }
        }
      }
    }
    return text_;
  };

  const convertRelativeToAbsolute = (readme: README) => {
    // Markdownの画像添付記法 ![]()
    let text = convertMarkdownImageLink(readme.repo.ownerRepo, readme.repo.sha, readme.text);
    // HTMLのimgタグ <img src="" ... />
    text = convertHTMLImageLink(readme.repo.ownerRepo, readme.repo.sha, text);
    return text;
  };

  const createHTML = (readme: README) => {
    const newText = convertRelativeToAbsolute(readme);
    let style =
      ".md-content { padding: 16px; text-align: left; }\n.md-content img { max-width: 450px; }\n";
    style += styles;
    const html = `<div class="md-content">${parse(newText)}</div>`;
    return `<html><head><style>${style}</style></head><body>${html}</body></html>`;
  };

  const cells = (() => {
    return readmes
      .filter((readme) => readme.text.length > 0)
      .map((readme, i) => {
        const html = createHTML(readme);
        const { ownerRepo } = readme.repo;
        return (
          <div className="readme" key={`readme-cell-${i}`}>
            <div className="wrap-iframe">
              <iframe title={"owner/repo"} srcDoc={html} />
            </div>
            <p>
              <img src={"images/github-icon.png"} />
              <a href={`https://github.com/${ownerRepo}`}>{ownerRepo}</a>
            </p>
          </div>
        );
      });
  })();

  useEffect(() => {
    const promises = catalog.repositories.map((repo) => getReadme(repo));
    Promise.all(promises)
      .then((readmes) => setReadmes(readmes))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="catalog">
      <h2>{t("generatedReadmes")}</h2>
      <div className="catalog-area">{cells}</div>
    </div>
  );
}
