# New README.md format proposal

<!-- ここに、GithubとかBitbucketではこういうことをいわれているので、自分たちはこういうことレイアウトを提案します -->

## What GitHub and Bitbucket mentioned about README.md

私たちが[What is README?](https://leadyou.hacknock.com)でも触れましたが、Github では README.md について以下のように述べています。

> You can add a README file to your repository to tell other people why your project is useful, what they can do with your project, and how they can use it.  
> (Quote it from [About READMEs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-readmes) written by GitHub)

また、Bitbucket では、README.md について同様に、以下のように述べられています。

> A README is a reference for other users visiting your repository and documents steps for them to get your application up and running. You can either add and edit your README file locally or straight from Bitbucket Cloud.  
> (Quote it from [README content](https://support.atlassian.com/bitbucket-cloud/docs/readme-content/) written by Bitbucket)

Github によると README は、あなたのプロジェクトでユーザーが何をすることができるか、どのように使用できるのか、なぜ有用であるのかを記述する必要があると述べています。
Bitbucket では、README はユーザーのためのリファレンスであり、ユーザーがあなたのプロジェクトを利用する時に、どのようにアプリケーションを起動し実行するのかという手順を文書化したものであると述べています。
これらのことから README は、あなたが公開したリポジトリを他のユーザーが利用する際に、他のプロジェクトでは実現できていない課題を解決することや、今まで実現できていないことが実現できるということなど有用性を示すことで、ユーザーがあなたのプロジェクトを利用したり貢献したりする動機付けを提供するとともに、あなたのプロジェクトを利用する方法を記述した概要であると言えます。
これらを示すために GitHub は以下の 5 つのコンテンツを含むべきであると示しています。

- What the project does
- Why the project is useful
- How users can get started with the project
- Where users can get help with your project
- Who maintains and contributes to the project

## The reason why we proposed new README format

前の節で述べた内容を、ほとんどのプロジェクトでは達成できていないのが現状です。
具体的な名前は挙げませんが、私たちが良く利用しているオープンソースでさえ、README に前の節で述べた内容を満たす十分な情報が書かれていません。
従って、開発者は README から必要な情報を得ることが出来ていないという現状があると言えます。
これは、README を書くための統一的なフォーマットが普及していないことが原因であるのではないかと私たちは考えました。
そこで、私たちは GitHub や Bitbucket が述べている README の推奨要件を満たすような統一的なフォーマットを知識の共有方法の一つである論文の記述方法を参考に提案します。

## Our proposed README format

以下に私たちが提案する RADME に入れるべき具体的な内容について説明をします。

### Project Name (Required)

プロジェクト名はあなたのプロジェクトの名前です。
これは、ユーザーにどのように呼んで欲しいかというブランドでもあり重要です。
この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Badges

あなたのプロジェクトの状態を一目で分かるようにするために、[Shields IO](https://shields.io/)が提供するバッジを表示することを推奨しています。
この項目は[README Generator](https://generator.hacknock.com)では必須項目ではなく推奨項目になっています。

### Tags (Required)

Tags はあなたのプロジェクトのキーワードです。
ユーザーがあなたのプロジェクトで用いている言語やフレームワークなどを一眼で分かるようにするために重要な情報です。
この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Short Description (Required)

Short Description はあなたのプロジェクトの全体像を簡潔にユーザーが理解するために重要です。
含めるべき内容としては、「あなたのプロジェクトが開発され公開された経緯（今存在しているフレームワークやオープンソースの課題や達成されていないことなど）」、「それを解決するアイデア」、「あなたのプロジェクトで出来ること」3 つです。
この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Demo

ユーザーがあなたのプロジェクトの動作を確認するための情報です。
特にユーザーインターフェイスを含む場合は、画像で動作の様子を表示することを推奨しています。
この項目は[README Generator](https://generator.hacknock.com)では必須項目ではなく推奨項目になっています。

### Advantages

### Installation

### Deployment

### Minimal Example

### Contributors

### Users

## Edit History

- 2020-08-15) First proposal by Akira Kashihara and Takuto Nakamura
