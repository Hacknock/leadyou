# LEADYOU

<!-- # Short Description -->

`LEADYOU` is a web application that helps you to write a `README` easily.

LEADYOU automatically fills several parts contents such as Project Name, Short Description, and Badges.
Additionally you can fill other items we recommend you to fill (Tags, Advantages, Installation, Minimal Example are recommended items).

<!-- # Badges -->

[![GitHub issues](https://img.shields.io/github/issues/Hacknock/leadyou)](https://github.com/Hacknock/leadyou/issues)
[![GitHub forks](https://img.shields.io/github/forks/Hacknock/leadyou)](https://github.com/Hacknock/leadyou/network/members)
[![GitHub stars](https://img.shields.io/github/stars/Hacknock/leadyou)](https://github.com/Hacknock/leadyou/stargazers)
[![GitHub top language](https://img.shields.io/github/languages/top/Hacknock/leadyou)](https://github.com/Hacknock/leadyou/)
[![GitHub license](https://img.shields.io/github/license/Hacknock/leadyou)](https://github.com/Hacknock/leadyou/)

## Tags

`README` `GitHub` `Markdown` `React` `TypeScript` `webpack` `GitHub Pages` `GitHub Actions`

## Demo

**Just follow the flow of input to create a rich document** 🎉

<img src="resources/file-0.png" alt="Demo" width="500px" />

## Advantages

1. You can clarify what to write README because LEADYOU gives you specific items to write.
2. LEADYOU supports you to write README with auto-fill function.
3. Easy to insert demo images because LEADYOU automatically generates necessary links after uploading images to LEADYOU.

## Build

0. LEADYOU needs Node.js (v18) and npm (v9).
1. Please download this repository before deploying.
   ```sh
   git clone git@github.com:Hacknock/leadyou.git
   ```
   or
   ```sh
   git clone https://github.com/Hacknock/leadyou.git
   ```
2. Build and view in web browser.
   ```sh
   npm install
   npm run start
   ```
   Then, access `localhost:3000`.

## Minimal Example

You can add or delete some items to make README using this repository source code. 
For example, you want to add "Support".
This item will help your colleagues ask you when they will face a problem with using your software.
You add the following code after lines 178 of `/src/json/template.json`.

```json
},
{
  "title": "Support",
  "description": "Please input the contact information when the user faces some problem on using your software.",
  "required": false,
  "multiple": true,
  "hiddenTitle": false,
  "replacingTitle": false,
  "formType": "one-line-field",
  "kindsOfValues": ["plain"],
  "formats": ["- %s\n"],
  "attributes": {
    "placeholder": "[Name](URL)"
  }
}
```

You deploy it again, Support item will be on edit form like this screenshot. 🍻

<img src="resources/file-1.png" alt="Minimal Example" width="300px" />

## Contributors

- [KASHIHARAAkira](https://github.com/KASHIHARAAkira)
- [Kyome22](https://github.com/Kyome22)

<!-- CREATED_BY_LEADYOU_README_GENERATOR -->
