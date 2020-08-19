# How to use README Generator

To reduce the cost of developers to fill out a README with all the necessary information, we are developing the README Generator that fetches your repository information and creates a README automatically.
You can generate README.md with the necessary information by following 3 steps.

1. Access to README Generator
2. Put your public repository URL and check "Auto Fill"
3. Fill out all required column on README Generator
4. Download README.md you made using README Generator
5. Upload README.md to your repository

## Access to README Generator

README Generator is a web application.
Please access the [README Generator](https://leadyou.hacknock.com).

## Put your public repository URL and check "Auto Fill"

Put your public repository URL in which you want to make README.md for the input field.
Next, check "Auto Fill".
Then press "Next Step".

Go to the next step.
However, these items are optional and you can enter the URL or uncheck "Auto Fill" as shown below.

1. If you want to create README.md simply by using the form without specifying the public repository URL.<br />
   In this case, do not input the URL and do not check "Auto Fill".
   You only have to press "Next Step".

2. If you want to create a README.md from scratch by using README Generator without auto-filling by specifying a public repository.<br />
   In this case, input the URL, do not check "Auto Fill" and press "Next Step".

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
git clone [Your repository URL or ssh]

cd [Your repository name]

cp -pR [README.md download folder path]/README/* .

git add -A

git commit -m "Updated README.md"

git push origin [your branch name]
```

2. ブラウザからファイルをアップロードする方法
   [Adding a file to a repository](https://docs.github.com/en/github/managing-files-in-a-repository/adding-a-file-to-a-repository) を参照して、ダウンロードしたファイルを入れてください。
