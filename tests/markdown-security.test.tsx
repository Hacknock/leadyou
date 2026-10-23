import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Preview from "../src/app/editor/Preview";
import ReadmeFrame from "../src/app/top/ReadmeFrame";

test("preview removes active HTML and unsafe URLs", () => {
  const html = renderToStaticMarkup(<Preview markdownText={`<script>alert(1)</script>
<img src="https://example.com/badge.png" onerror="alert(1)">
<a href="javascript:alert(1)">unsafe</a>
<iframe src="https://example.com"></iframe>`} />);
  assert.doesNotMatch(html, /<script|onerror|javascript:|<iframe/i);
  assert.match(html, /https:\/\/example.com\/badge.png/);
});

test("preview preserves headings, tables, links and image sizing", () => {
  const html = renderToStaticMarkup(<Preview markdownText={`# README

| A | B |
| - | - |
| one | two |

[Docs](https://example.com)

<img src="https://example.com/demo.png" width="500">`} />);
  assert.match(html, /<h1>README<\/h1>/);
  assert.match(html, /<table>/);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /width="500"/);
});

test("external README frames always have an empty sandbox", () => {
  const html = renderToStaticMarkup(<ReadmeFrame title="owner/repo" html={'<script>parent.location="https://example.com"</script>'} />);
  assert.match(html, /sandbox=""/);
  assert.match(html, /referrerPolicy="no-referrer"/);
  assert.doesNotMatch(html, /allow-scripts|allow-same-origin|allow-top-navigation/);
  assert.match(html, /&lt;script&gt;/);
});
