:: windows equivalent to tool.sh
pushd tool
cmd /c "npm install"
node index.js %*
popd