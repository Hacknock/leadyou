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

```sh
MYSQL_ROOT_PASSWORD=[set password]
MYSQL_DATABASE=[set database name]
MYSQL_USER=[set user name]
MYSQL_PASSWORD=[set password]
PORT = [set port number]
```

**./config/app.env**

```sh
HOST = db
USER = [please fill the same value of MYSQL_USER]
PASSWORD = [please fill the same value of MYSQL_PASSWORD]
CON_LIMIT = 5
PORT = [please fill the same value of PORT]
TOKEN = [please fill your Github client token]
```

### Deploy

Please run the following command on top-level directory of this repository.

```
sudo docker-compose build
sudo docker-compose up
```

After that, you access `http://localhost:[Port number you set]`.
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
