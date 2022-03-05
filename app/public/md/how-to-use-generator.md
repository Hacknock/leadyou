# How to use README Generator

To reduce the cost of developers to fill out a README with all the necessary information, we are developing the README Generator that fetches your repository information and creates a README automatically.
You can generate README.md with the necessary information by following five steps.

1. Access to README Generator
2. Put your public repository URL and check "Auto Fill"
3. Fill out all required column on README Generator
4. Download README.md you made using README Generator
5. Upload README.md to your repository

## Access to README Generator

README Generator is a web application.
Please access the [LEADYOU](/).

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

In many cases, the auto-filling does not fill all the necessary information.
Especially for Tags, Advantages, Installation, and Minimal Example, you need to fill out.
The information required to fill out is marked with a red asterisk.
You can insert an image file (including GIF) into the Demo.
The files you select will not be uploaded to LEADYOU's servers.

## Download README.md you made using README Generator

Once you have filled out all the necessary information, press the "Generate" button.
README.md is automatically generated and downloaded.
Unzip the downloaded file and the README.md and a set of attached resource files will be expanded in the correct directory structure.

## Upload README.md to your repository

Upload the README.md that you downloaded in the previous step to the repository.
There are two ways to upload files.
Upload the README.md and resources to the root directory of your repository using the following preferred method.

1. Cloning the repository and pushing the files

```
git clone [Your repository URL or ssh]

cd [Your repository name]

cp -pR [README.md download folder path]/README/* .

git add -A

git commit -m "Updated README.md"

git push origin [your branch name]
```

2. Uploading the files through the browser<br />
   Refer to ["Adding a file to a repository"](https://docs.github.com/en/github/managing-files-in-a-repository/adding-a-file-to-a-repository) and upload the files.
