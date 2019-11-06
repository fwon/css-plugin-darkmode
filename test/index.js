'use strict';

const fs = require('fs');
const path = require('path');
const cssdm = require('../lib/plugin.js');

function readFile(filename) {
  filename = path.resolve(__dirname, filename);
  return fs.readFileSync(filename).toString();
}

function logTitle(type) {
  return `
/**************Test ${type}*************/
`;
}

const css = cssdm(readFile('../examples/styles/style.css'));
const less = cssdm(readFile('../examples/styles/style.less'), {
  syntax: 'less'
});
const sass = cssdm(readFile('../examples/styles/style.sass'), {
  syntax: 'sass'
});
const scss = cssdm(readFile('../examples/styles/style.scss'), {
  syntax: 'scss'
});

console.log(logTitle('CSS'));
console.log(css);
console.log(logTitle('Less'));
console.log(less);
console.log(logTitle('Sass'));
console.log(sass);
console.log(logTitle('SCSS'));
console.log(scss);
