# What is README?

README とは、あなたが作成したオープンソースやライブラリなどを外部の人が使う際に参照する仕様書のようなものです。

> You can add a README file to your repository to tell other people why your project is useful, what they can do with your project, and how they can use it.  
> (Quote it from [About READMEs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-readmes) written by Github.com)

と Github が述べているように、README はあなたのプロジェクトの有用性や何ができるのか、どのように使えばいいのかを示すものであると言えます。  
Github では以下の 5 点が一般的に含まれていると示しています。

- What the project does
- Why the project is useful
- How users can get started with the project
- Where users can get help with your project
- Who maintains and contributes to the project

# Why is README important?

README は他の開発者が、あなたのプロジェクトにアクセスした時に、真っ先に見るものです。  
あなたが一番最初に、そのリポジトリにアクセスした時に、これは何故有用なのか、何ができるのか、どのように使うのかを知りたいはずです。  
特に、同じことを実現できる二つのプロジェクトを比較する時や、あなたが手頃で使いやすいパッケージを探している時には、README を読んでそれを採用するか否かを瞬時に判断できるのがベストであることは明らかです。  
このように各リポジトリの README は自分のプロジェクトで、そのパッケージやライブラリ、フレームワークなどのオープンソースを採用するか否か、複数のオープンソースを比較するという上で重要です。

# What are current problems?

現在の多くのプロジェクトの README には、"What is README?"で述べた 5 つの要素が記載されていないだけではなく、そのプロジェクトが現在実現されていない問題の何を解決しているのかという有用性、何の機能を提供してくれるのか、どのように使えるのかということが書かれていません。  
これでは、あなたがそのオープンソースを利用するべきか否かを判断できませんし、他のオープンソースとの比較も困難です。  
あなたも経験があるように、多くの場合、私たちが新しいオープンソースの存在を Stack Overflow のような質問サイトや技術カンファレンスを通して存在を知ったり、Google で実現したいことを検索し、リッチなオープンソースのサイトを経由して知ったり、もしくは論文などを通して知ったりしていると思います。  
いずれにしても、あなたが見つけたオープンソースの有用性を知るためには、README 以外のソースを探し、読み、比較しなくてはいけません。逆にいうとあなたがこれから革新的なオープンソースを公開し、普及させたいのであれば、そのプロジェクトのサイトを作成し公開するなど、さらなるリソースが必要となります。  
開発者が、いつでも自分のアイデアで新しいオープンソースを作成し、共有し、誰もが利用できる上で、その情報を最小限の労力で公開し閲覧できるというのは、今とても重要な課題であると私たちは考えています。

# Our proposed readme contents

私たちが提案する README.md のコンテンツは、これまでに投稿されてきた知識の共有方法である論文を参考にしています。  
特に今回は Github に公開されている多くが技術系であることを考慮し、工学系や情報系の論文で良く含めるべきといわれるコンテンツを元に、README.md に含むべきコンテンツを提案します。  
必須項目は基本的に論文に従って設定されています。

## Proposed Contents

1. Project Name（必須）
2. Badges
3. Tags（必須）
4. Short Discription（必須）
5. Demo
6. Advantages（必須）
7. Installation（必須）
8. Deployment
9. Minimal Example（必須）
10. Contributors（必須）
11. Users

## You can contribute this format

このドキュメントを記載した時点では、LEADYOU の開発者の提案が採用されていますが、あなたが入れるべきである内容を提案したい場合は、指定の手順に従って承認されれば本サービスに自動的に反映されます。  
詳しくは　[ここ](https://hacknock.com)をご覧ください。

# Let's Write Readme

以上で提案したコンテンツを含む README.md を生成するフォームを以下のリンクから利用できます。  
[Let's write Readme!](https://pullreq.me/how-to-make-readme)
