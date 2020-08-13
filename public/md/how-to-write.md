# How to write README.md?

## What contents should you include?

Bitbucket では

> A README is a reference for other users visiting your repository and documents steps for them to get your application up and running.  
> (Quate it from [README content](https://support.atlassian.com/bitbucket-cloud/docs/readme-content/) written by Bitbucket.org)

つまり、あなたの README.md にはあなたの開発し配布するオープンソースなどのアプリケーションを、他者が動かすための必要十分な情報を含む必要があります。

Github の [About READMEs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-readmes) では以下の 5 点が一般的に含まれ流べきであると示しています。

- What the project does
- Why the project is useful
- How users can get started with the project
- Where users can get help with your project
- Who maintains and contributes to the project

また、上記に加えて repository license、contribution guideline、code of conduct を定義することも重要であると述べています。  
この際に、これらを別のファイルで示す場合、README.md はこれらのファイルの参照を容易にする役割もになっています。

## The way you write README.md

一般的には、README.md は Markdown であなた自身が白紙の状態から記載する必要があります。  
ところが、Github.com では license 情報や最低限の README.md のフォーマット、とは言ってもタイトルのみが挿入された README.md のテンプレートファイルをリポジトリを新しく作成する時に、自動的に含むことが可能です。  
このテンプレートファイルを元に、書き換えるのが最も一般的な方法の一つと言えると思います。  
これまでは、あなたが全てを README.md に入力する必要がありました。  
そこで新たな README.md の作成方法として、LEADYOU では、あなたの公開レポジトリの情報を自動で取得し、入力できる項目は自動で入力できる README.md Generator を開発し提供しています。
