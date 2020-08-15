# How to use README Generator

README に必要事項を全てを記載するという開発者の負担を軽減するために、あなたのリポジトリの情報を自動的に取得し、README を作成する README Generator を開発しました。
LEADYOU の README Generator はあなたが公開するリポジトリ情報を自動的に読み取り、README.md に必要な事項を auto fill します。
あなたは、以下の３ステップを行うことで、必要事項が記載された README.md を生成することが可能です。

1. Access to README Generator
2. Put your public repository url you want to make README.md and a checkmark to "Auto Fill"
3. Fill out all required column on README Generator
4. Download README.md you made using README Generator
5. Upload README.md to your repository

## Access to README Generator

README Generator は web application です。
[README Generator](https://leadyou.hacknock.com)へアクセスしてください。

## Put your public repository url you want to make README.md and a check to "Auto Fill"

README Generator の入力欄にあなたが README.md を作りたい公開リポジトリの URL を入力してください。次に、"Auto Fill" にチェックを入れます。
その後、"Next Step"を押してください。
次のステップへ移動します。
しかし、これらの項目はオプションであり、以下を参照して URL の入力や "Auto Fill"へのチェックを外すことが可能です。

1. 公開リポジトリ URL を指定せず、単純にフォームを利用して README.md を作成したい。  
   この場合は、URL を入力せず "Auto Fill" にもチェックを入れずに"Next Step"を押してください。
2. 公開リポジトリを指定して、Auto Fill をせずに、0 から README Generator を利用して README.md を作成したい。  
   この場合は URL のみを入力して、"Auto Fill"にチェックを入れずに"Next Step"を押してください。

## Fill out all required column on README Generator

"Auto Fill"にチェックを入れても多くの場合、全ての必須項目が埋まることはありません。
特に Tags, Advantages, Installation、Minimal Example については、あなたが埋める必要があります。
Demo には gif を含む画像ファイルを挿入することができます。
選択されたファイルは LEADYOU のサーバーへアップロードされることはありません。

## Download README.md you made using README Generator

全ての必須項目を埋めたら、submit ボタンを押してください。
自動的に README.md が生成され、ダウンロードされます。
ダウンロードされた zip ファイルを解凍すると、README.md と添付されたリソースファイル一式が正しいディレクトリ 構造で展開されます。

## Upload README.md to your repository

前のステップでダウンロードした README.md をアップロードしましょう。
ファイルのアップロード方法は二つあります。
以下のお好みの方法でダウンロードした zip ファイルにある README.md と resources フォルダをリポジトリのルートディレクトリにアップロードしてください。

1. リポジトリをクローンし、push する方法

```
git clone [Your repository url or ssh]

cd [Your repository name]

cp -pR [README.md download folder path]/README/* .

git add -A

git commit -m "Updated README.md"

git push origin [your branch name]
```

2. ブラウザからファイルをアップロードする方法  
   [Adding a file to a repository](https://docs.github.com/en/github/managing-files-in-a-repository/adding-a-file-to-a-repository) を参照して、ダウンロードしたファイルを入れてください。
