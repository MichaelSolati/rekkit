ng build --target=production
rm -rf public
mv dist public
git add .
git commit -m "Update Angular App"
git push
