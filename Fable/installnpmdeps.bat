rem this was all required it seems
npm init
npm install --save-dev fable-compiler
npm install --save-dev webpack
npm install --save-dev source-map-loader
npm install --save core-js
npm install --save fable-core
rem apparently this could be avoided if the fableconfig.json specifies 
rem postbuild: node node_modules/webpack/bin/webpack
npm install -g webpack
fable