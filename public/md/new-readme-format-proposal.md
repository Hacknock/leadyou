# New README.md format proposal

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

あなたのプロジェクトの名は、ユーザーにどのように呼んで欲しいかというブランドでもあり重要です。
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

_Example_

> hogehoge という処理を行うために、公式で提供されているフレームワークのみを用いるとユーザーが書くコードが煩雑になってしまうという課題があります。
> この課題を解決するために、これらのコードをラップし hogehoge の処理を行うためのシンプルなインターフェイスを提供することが、私のアイデアです。
> 私のプロジェクトが提供するラッパーライブラリをあなたが用いることで、hogehoge の処理を行うシンプルなコード記述を可能にします。

この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Demo

ユーザーがあなたのプロジェクトの動作を確認するための情報です。
特にユーザーインターフェイスを含む場合は、画像で動作の様子を表示することを推奨しています。
この項目は[README Generator](https://generator.hacknock.com)では必須項目ではなく推奨項目になっています。

### Advantages (Required)

ユーザーがあなたのプロジェクトの有用性を判断するために重要です。
開発者はこの項目に、他のオープンソースやフレームワークと比較して、あなたのプロジェクトをユーザーが利用するメリットを記載してください。
開発者は箇条書きで簡潔に記載すると、ユーザーは分かりやすいです。

_Example_

> - 簡潔なコード記述が可能です。
> - 他のライブラリとの依存関係がなく、本プロジェクトを導入するだけで利用が可能です。
> - 公式のフレームワークの API を用いているため、動作が高速です。

この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Installation (Required)

ユーザーがあなたのプロジェクトを導入するために必要な情報です。
具体的に導入する方法を記載してください。
再現性のある書き方を心がけてください。つまり、動作する環境や導入に際して必要な依存環境、導入に必要なシェルなどのスクリプトを書いてください。
この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Deployment

ユーザーがあなたのプロジェクトをデプロイするために必要な情報です。
全てのプロジェクトに必要であるとは限りませんが、必要な依存環境と連携するなど、デプロイに必要なコードや手順があれば書いてください。
この項目は[README Generator](https://generator.hacknock.com)では推奨項目になっています。

### Minimal Example (Required)

ユーザーがあなたのプロジェクトを利用する方法を簡単に知るための重要な情報です。
この項目を見て、利用のしやすさや実際に利用する時のコードを確認します。
また、この項目はユーザーが導入に成功しているかを確認するためにも用いることができます。
あなたのプロジェクトをユーザーが導入する時に、チュートリアルとして、この項目を参照することが考えられます。
この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Contributors (Required)

多くの大規模なプロジェクトや良く利用されるプロジェクトは、複数人の Contributors が存在します。
誰があなたのプロジェクトに関わったかという情報は、Contributors の貢献を称えるために重要です。
私たちは Contributors の努力を報いることで、オープンソースの発展が期待されると考えています。
この項目は[README Generator](https://generator.hacknock.com)では必須項目になっています。

### Users

あなたのプロジェクトを利用しているユーザーがいれば記載してください。
この情報は、ユーザーがあなたのプロジェクトの信頼性を判断する助けになると思います。
この項目は[README Generator](https://generator.hacknock.com)では推奨項目になっています。

## Edit History

- 2020-08-15) First proposal by Akira Kashihara and Takuto Nakamura
