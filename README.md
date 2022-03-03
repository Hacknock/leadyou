# LEADYOU

<!-- # Short Description -->

"LEADYOU" is a web application that helps you to write a README easily.<br>
LEADYOU automatically fills several parts contents such as Project Name, Short Description and Badges.<br>
Additonally you can fill other items we recommend you to fill (Tags, Advantages, Installatio, Minimal Example are recommended item).

<!-- # Badges -->

🚧Attach badges later.🚧

## Tags

`LEADYOU` `README` `Markdown`

## Demo

🚧Attach gif annimation later.🚧

## Advantages

1. You can clarify what to write README because LEADYOU gives you specific items to write.
2. LEADYOU supports you to write README with auto-fill function.
3. Easy to insert demo images because LEADYOU automatically generate necessary links after uploading images to LEADYOU.

## Installation

LEADYOU needs docker-engine, docker-compose and Github personal token.
If you need to install docker-engine and docker-compose, the following web sites might be helpful.

- [How to install Docker Engine](https://docs.docker.com/engine/install/ubuntu/)
- [How to install Docker Compose](https://docs.docker.com/compose/install/)

You can get Github acccess token [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Please download this repository before deploying.

```sh
git clone git@github.com:Hacknock/readme-generator-master.git
```

or

```sh
git clone https://github.com/Hacknock/readme-generator-master.git
```

## Deployment

You need to fill some items of environment values setting file before deploy.
You make `.env` file on top-level directory and set the following items.

### Environment File Setting

**.env**

.env file has setting parameter. If you face a plobram to set each parameter, please refer to [Docker mariadb image official page](https://hub.docker.com/_/mariadb).

```
MYSQL_ROOT_PASSWORD=[Set mariadb ROOT password]
MYSQL_DATABASE=[Set database name]
MYSQL_USER=[Set user name]
MYSQL_PASSWORD=[Set USER password]
MYSQL_PORT=[Set MARIADB port number]
CON_LIMIT=[Set connection limitation number]
WEB_PORT=[Set APPLICATION port number]
GITHUB_TOKEN=[Set Github client token]
```

Recommendation value

```
MYSQL_PORT=3306
CON_LIMIT=5
WEB_PORT=3000
```

You can get Github token [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

### Test

We prepare the test code to check the connection between app and mariadb. Please run the following command.

```
sudo docker-compose -f docker-compose.yml -f ./docker/test.yml up --build --abort-on-container-exit
```

### Deploy

Please run the following command on top-level directory of this repository.

**Run with log output**

```
sudo docker-compose up --build
```

Please type `ctrl+c` if you close docker.

**Run without log output (daemon)**

Please execute the following command if you run leadyou in daemon mode.

```
sudo docker-compose up --build -d
```

Please execute the following command if you want to stop leadyou.

```
sudo docker-compose stop
```

**Run without log output and keep storage on host OS**
This mode enable to keep storage which includes issued README data. This data is used for display README catalog on top page.

```
sudo docker-compose -f docker-compose.yml -f ./docker/production.yml up --build -d
```

Please execute the following command if you want to stop leadyou.

```
sudo docker-compose stop
```

**How to access to leadyou after deploy**

After deploy, you access `http://localhost:[Port number you set]`.
You should be able to access LEADYOU on your local PC.

## Minimal Example

You can add or delete some items to make README using this repository source code.
For example, you want to add "Support".
This item will helps your collegues ask you when they will face a problem on using your software.
You add the following code on line 178 to 191 of `./public/plugins/template.json`.

```json
{
  "title": "Support",
  "hiddenTitle": false,
  "required": false,
  "replacement": false,
  "multiple": true,
  "component": "wrap-oneline-field",
  "description": "Please input the contact information when user faces some problem on using your software.",
  "kindsOfValues": ["plain"],
  "formats": ["- %s\n"],
  "attributes": {
    "placeholder": "[Name](URL)"
  }
}
```

You deploy it again, Support item will be on edit form like this screen shot &#x1f37b;.

![Minimal Example](resources/edited_form_sample.png)

## Contributors

- [Kyome22](https://github.com/Kyome22)
- [KASHIHARAAkira](https://github.com/KASHIHARAAkira)

<!-- CREATED_BY_LEADYOU_README_GENERATOR -->
