ng build --target=production
mv dist public
git add .
git commit -m "Update Angular App"
git push
