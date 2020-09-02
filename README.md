# readme-generator-master

API of pullreq-me

## System Deploy

You need to install node.js and mongoDB. You can get these the following page.

`$ npm install`

You will deploy mariaDB scheme and install dummy data. I made a script for each. Before that, you need to enter your mariaDB console. You start mariaDB server

`$ mysql.server start`

and run the following code.

`$ mysql`

Perhaps, depends on your environment, you need 'sudo'.

`$ sudo mysql`

attention Actually, this shell script I strongly do not recommend you use because you use admin right using 'sudo'. You have another way to connect mariaDB, I recommend you use it.

Next step, you make new tables and database.

`mysql> source setting.sql`

Congratulations 🍻
You success to get all developmental environment and dependencies.

## Lint

fource lint -->
`$ npm run lint`
コードの見た目をいい感じにしてくれる(メンテした)

## SQL close

If you want to leave sql console, please run the following.

`mysql> exit`

If you want to stop sql server, please run the below code.

`$ mysql.server stop`
