#!/bin/bash
set -e

export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"

echo "Building site..."
bundle exec jekyll build

echo "Deploying to islammdshariful.github.io..."
cd /tmp
rm -rf _deploy
mkdir _deploy
cd _deploy
git init -q
git branch -M main
git remote add origin https://github.com/islammdshariful/islammdshariful.github.io.git
cp -r /Users/islammdshariful/Projects/islammdshariful.github.io/_site/* .
git add .
git commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push -f origin main

echo "Done! Site will be live at https://islammdshariful.github.io in a minute."
