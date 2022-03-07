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

# Tags

`README` `GitHub` `Markdown` `Web Components` `MariaDB` `Docker`

# Demo

**Just follow the flow of input to create a rich document** 🎉

![Demo](resources/file-0.png)

# Advantages

1. You can clarify what to write README because LEADYOU gives you specific items to write.
2. LEADYOU supports you to write README with auto-fill function.
3. Easy to insert demo images because LEADYOU automatically generates necessary links after uploading images to LEADYOU.

# Installation

LEADYOU needs docker-engine, docker-compose, and a personal access token of GitHub.
If you need to install docker-engine and docker-compose, the following websites might be helpful.

- [How to install Docker Engine](https://docs.docker.com/engine/install/ubuntu/)
- [How to install Docker Compose](https://docs.docker.com/compose/install/)
- [Overview of docker-compose CLI](https://docs.docker.com/compose/reference/)

You can get a personal access token [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Please download this repository before deploying.

```sh
git clone git@github.com:Hacknock/leadyou.git
```

or

```sh
git clone https://github.com/Hacknock/leadyou.git
```

# Deployment

You need to fill some items of the environment values setting file before deploying.
Make the `.env` file on the top-level directory and set the following items.

### Environment File Setting

**.env**

`.env` file has a setting parameter. If you face a problem setting each parameter, please refer to [Docker MariaDB image official page](https://hub.docker.com/_/mariadb).

```
MYSQL_ROOT_PASSWORD=[Set mariadb ROOT password]
MYSQL_DATABASE=[Set database name]
MYSQL_USER=[Set user name]
MYSQL_PASSWORD=[Set USER password]
MYSQL_PORT=[Set MARIADB port number]
CON_LIMIT=[Set connection limitation number]
WEB_PORT=[Set APPLICATION port number]
GITHUB_TOKEN=[Set GitHub personal access token]
LEADYOU_API_TOKEN=[Set API token]
```

- Set `GITHUB_TOKEN` to your personal access token of GitHub. Please refer to the _Installation_ section of this README.
- Set `LEADYOU_API_TOKEN` to any given value (whatever you want).

Recommendation value

```
MYSQL_PORT=3306
CON_LIMIT=5
WEB_PORT=3000
```

### Test

We prepare the test code to check the connection between the app and MariaDB. Please run the following command.

```sh
sudo docker-compose -f docker-compose.yml -f ./docker/test.yml up --build --abort-on-container-exit
```

### Deploy

Please run the following command on the top-level directory of this repository.

**Run with log output**

```sh
sudo docker-compose up --build
```

Please type `ctrl+c` if you close docker.

**Run without log output (daemon)**

Please execute the following command if you run LEADYOU in daemon mode.

```sh
sudo docker-compose up --build -d
```

Please execute the following command if you want to stop LEADYOU.

```sh
sudo docker-compose stop
```

**Run without log output and keep storage on host OS**
This mode enables to keep storage which includes issued README data. This data is used for displaying the README catalogs on the top page.

```sh
sudo docker-compose -f docker-compose.yml -f ./docker/production.yml up --build -d
```

Please execute the following command if you want to stop LEADYOU.

```sh
sudo docker-compose stop
```

**How to access LEADYOU after deployment**

After deployment, you access `http://localhost:[Port number you set]`.
You should be able to access LEADYOU on your local PC.

### Call LEADYOU API

We provide APIs enable you to check LEADYOU's behavior.

**Show table of generated READMEs.**

This API gives a list of information about README which was generated with LEADYOU on your local environment.

```
http://localhost:[Port number you set]/showGeneratedTable?limit=10&token=[LEADYOU_API_TOKEN]
```

- `limit` is the number of records to show.
- `token` is the environment variable you set in the `.env` file.

**Update catalog states**

This API updates state (used/not used) of READMEs which were generated with LEADYOU on your local environment.
Based on this information, the top page of LEADYOU displays a catalog listing the actual READMEs in use.

```
http://localhost:[Port number you set]/updateCatalog?limit=3&token=[LEADYOU_API_TOKEN]
```

- `limit` is the number of records to update status (counted from the most recent).
- `token` is the environment variable you set in the `.env` file.

# Minimal Example

You can add or delete some items to make README using this repository source code.
For example, you want to add "Support".
This item will help your colleagues ask you when they will face a problem with using your software.
You add the following code on lines 178 to 191 of `/app/public/public/plugins/template.json`.

```json
{
  "title": "Support",
  "hiddenTitle": false,
  "required": false,
  "replacement": false,
  "multiple": true,
  "component": "wrap-oneline-field",
  "description": "Please input the contact information when the user faces some problem on using your software.",
  "kindsOfValues": ["plain"],
  "formats": ["- %s\n"],
  "attributes": {
    "placeholder": "[Name](URL)"
  }
}
```

You deploy it again, Support item will be on edit form like this screenshot. 🍻

![Minimal Example](resources/file-1.png)

# Contributors

- [KASHIHARAAkira](https://github.com/KASHIHARAAkira)
- [Kyome22](https://github.com/Kyome22)

<!-- CREATED_BY_LEADYOU_README_GENERATOR -->
