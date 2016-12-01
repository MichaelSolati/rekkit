ng build --target=production
mv dist public
git checkout server/master
git add .
git commit -m "Update Angular App"
git push
git checkout web/master
