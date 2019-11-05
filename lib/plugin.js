/**
 * CSS Darkmode Tools, Check examples and test.js to use.
 */

'use strict';

const Parser = require('gonzales-pe');
const fs = require('fs');
const path = require('path');

function readFile(filename) {
  filename = path.resolve(__dirname, filename);
  return fs.readFileSync(filename).toString();
}

function isDmComment(comment) {
  return comment.match(/ *dm\[(.*)\] */);
}

function getDeclarations(content) {
  const matches = isDmComment(content);
  return matches && matches[1];
}

function createNode(content, options) {
  const declas = getDeclarations(content);
  let declasNode = null;
  // 结构不完整的css无法parse
  if (options.syntax === 'css') {
    const cssDecals = 'a{' + declas + '}';
    declasNode = Parser.parse(cssDecals, options).first().get(1);
  } else {
    declasNode = Parser.parse(declas, options);
  }
  return declasNode;
}

function walk(node) {
  // eachFor 不会因为删除index而顺序错乱
  node.eachFor((n, i, p) => {
    if (
      !n.is('ruleset') && !n.is('multilineComment') && !n.is('space') ||
      // extract css :root case
      n.is('ruleset') && n.first().is('selector') && n.first().first().is('pseudoClass')
    ) {
      p.removeChild(i);
      if (p.get(i) && p.get(i).is('space')) {
        p.removeChild(i);
      }
    } else {
      n.eachFor((n2) => {
        if (n2.is('block')) {
          walk(n2);
        }
      });
    }
  });
}

function replaceComments(node, options) {
  node.traverseByType('multilineComment', (n, i, p) => {
    const content = n.content;
    if (!content) {
      return;
    } else if (isDmComment(content)) {
      const newNode = createNode(content, options);
      p.removeChild(i);
      // 抛除css外层结构
      if (options && options.syntax === 'css') {
        newNode.forEach((n2) => {
          p.content.push(n2);
        });
      } else {
        p.insert(i, newNode);
      }
    } else {
      p.removeChild(i);
    }
  });
}

function concatCss(origin, content) {
  const header = '\n\n/********** Added By CSS-Plugin-Darkmode **********/ \n\n';
  return origin + header + content;
}

function CSSDarkMode(css, options) {
  options = options || {
    syntax: 'css'
  };
  let dmTmpl;
  if (options.syntax === 'sass') {
    dmTmpl = readFile('dm-tmpl.sass');
  } else {
    dmTmpl = readFile('dm-tmpl.css');
  }
  const dmTmplTree = Parser.parse(dmTmpl, options);
  const parseTree = Parser.parse(css, options);
  walk(parseTree);
  // console.log(parseTree.toString());
  replaceComments(parseTree, options);
  // console.log(parseTree.toString());
  dmTmplTree.first().get(4).content.push(parseTree);
  return concatCss(css, dmTmplTree.toString());
}

module.exports = CSSDarkMode;

