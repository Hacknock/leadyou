#!/bin/bash

echo "You need to install homebrew before installing and deploy thie environment."
echo "Install all necessary package of npm."

xcode-select --install
brew doctor
brew update
brew info mariadb
brew install mariadb
mysql_install_db

npm install

# Mariadb install site is https://mariadb.com/resources/blog/installing-mariadb-10-1-16-on-mac-os-x-with-homebrew/

exit 0
