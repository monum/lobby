#! /bin/bash
pushd tool
npm install
node index.js "$@"
popd