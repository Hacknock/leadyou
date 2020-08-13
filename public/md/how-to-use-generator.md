# How to use README.md generator

LEADYOU の README.md generator はあなたが公開するリポジトリ情報を自動的に読み取り、README.md に必要な事項を auto fill します。  
あなたは、以下の３ステップを行うことで、必要事項が記載された README.md を生成することが可能です。

1. Access to README.md generator
2. Put a check to "Auto Fill"
3. Fill out the rest of all required column on README.md generator
4. Download README.md you make using README.md generator

## Access to README.md generator

README.md generator は web application です。  
[README.md generator](https://leadyou.hacknock.com)へアクセスしてください。

## Put url you want to make README.md and a check to "Auto Fill"

README.md generator の入力欄にあなたが README.md を作りたい公開リポジトリの URL を  入力してください。次に、"Auto Fill" にチェックを入れます。  
その後、"Next Step"を押してください。　　
次のステップへ移動します。  
しかし、これらの項目はオプションであり、以下を参照して URL の入力や "Auto Fill"へのチェックを外すことが可能です。

1. 公開リポジトリ URL を指定せず、単純にフォームを利用して README.md を作成したい。  
   この場合は、URL を入力せず "Auto Fill" にもチェックを入れずに"Next Step"を押してください。
2. 公開リポジトリを指定して、Auto Fill をせずに、0 から README.md generator を利用して README.md を作成したい。  
   この場合は URL のみを入力して、"Auto Fill"にチェックを入れて"Next Step"を押してください。

## Fill out all required column on README.md generator

"Auto Fill"にチェックを入れても多くの場合、全ての必須項目が埋まることはありません。  
特に Tags, Advantages, Installation、Minimal Example については、あなたが埋める必要があります。  
ページ下の submit ボタンを押した時に、赤枠が表示された部分が必須項目です。  
Demo には gif を含む画像ファイルを挿入することができます。  
選択されたファイルは LEADYOU のサーバーへアップロードされることはありません。  
全ての必須項目を埋めたら、submit ボタンを押して、次のステップへ移動してください。

## Download README.md you make using README.md generator

前のステップで submit ボタンを押すと、自動的に README.md が生成されます。  
Demo に画像ファイルを挿入した際は、その画像データと README.md が正しいディレクトリ構造で zip ファイルであなたのパソコンにダウンロードされます。

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
