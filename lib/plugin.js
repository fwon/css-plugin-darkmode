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

function removeAfterSpace(i, p) {
  if (p.get(i) && p.get(i).is('space')) {
    p.removeChild(i);
  }
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
      removeAfterSpace(i, p);
    } else if (n.is('space') && p.is('block') && p.length === 1) {
      p.removeChild(i);
    } else if (n.is('multilineComment') || n.is('space')) {
      return;
    } else {
      n.eachFor((n2) => {
        if (n2.is('block')) {
          walk(n2);
        }
      });
    }
  });
}

function removeEmptyRuleset(node) {
  node.traverseByType('ruleset', (n, i, p) => {
    const block = n.first('block');
    if (block && block.length === 0) {
      p.removeChild(i);
      removeAfterSpace(i - 1, p);
    }
  });
}

function replaceComments(node, options) {
  let count = 0;
  node.traverseByType('multilineComment', (n, i, p) => {
    count++;
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
  return count;
}

function appendHeader(content) {
  const header = '\n\n/********** Added By CSS-Plugin-Darkmode **********/ \n\n';
  return header + content;
}

function CSSDarkMode(css, options) {
  options = options || {
    syntax: 'css'
  };
  let dmTmpl;
  let mediaStr = '';
  if (options.syntax === 'sass') {
    dmTmpl = readFile('dm-tmpl.sass');
  } else {
    dmTmpl = readFile('dm-tmpl.css');
  }
  const dmTmplTree = Parser.parse(dmTmpl, options);
  const parseTree = Parser.parse(css, options);
  walk(parseTree);
  // console.log(parseTree.toString());
  removeEmptyRuleset(parseTree);
  const count = replaceComments(parseTree, options);
  // console.log(parseTree.toString());
  if (count) {
    dmTmplTree.first().get(4).content.push(parseTree);
    mediaStr = appendHeader(dmTmplTree.toString());
  }
  return css + mediaStr;
}

module.exports = CSSDarkMode;

