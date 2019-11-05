## css-plugin-darkmode

A Preprocessor Plugin for CSS DSL(Less, Sass, SCSS).
Write darkmode css as comments in one place, will be transformed to darkmode media;
### Basic
Write comments using `dm[]` in css which you want to add darkmode media, like
```css
.selector {
  /* dm[color: #fff] */
}
```
can be transformed into media like
```css
@media (prefers-color-scheme: dark) {
  .selector {
    color: #fff
  }
}
```
### Examples
#### 1. CSS
**Before**
```css
:root {
  --color1: #987786;
  --dm__color1: #fff;
}

body {
  font-size: 14px;
  /* dm[color: #888;background-color: #fff;] */
}
.class1 {
  width: 100px;
  color: var(--color1);
  /* dm[color: var(--dm__color1);] */
}
.class1 .class2, .class1 .class3 {
  background-color: #ddd;
  /* dm[ background-color: #888;] */
}
```
**After**
```css
:root {
  --color1: #987786;
  --dm__color1: #fff;
}

body {
  font-size: 14px;
}
.class1 {
  width: 100px;
  color: var(--color1);
}
.class1 .class2, .class1 .class3 {
  background-color: #ddd;
}
/********** Added By CSS-Plugin-Darkmode **********/
@media (prefers-color-scheme: dark) {
  body {
    color: #888;
    background-color: #fff;
  }
  .class1 {
    color: var(--dm__color1);
  }
  .class1 .class2,
  .class1 .class3 {
    background-color: #888;
  }
}
```
#### 2. Less
**Before**
```less
@color1: #987786;
@__dm__color1: #fff;

body {
  font-size: 14px;
  /* dm[color: #888;background-color: #fff;] */
}
.class1 {
  width: 100px;
  color: @color1;
  /* dm[color: @__dm__color1;] */
  .class2, .class3 {
    background-color: #ddd;
    /* dm[background-color: #888;] */
    /* dm[background-image:url('base64:abcd');] */
  }
}
```
**After**
```less
@color1: #987786;
@__dm__color1: #fff;

body {
  font-size: 14px;
}
.class1 {
  width: 100px;
  color: @color1;
  .class2, .class3 {
    background-color: #ddd;
  }
}
/********** Added By CSS-Plugin-Darkmode **********/
@media (prefers-color-scheme: dark) {
  body {
    color: #888;
    background-color: #fff;
  }
  .class1 {
    color: @__dm__color1;
  }
  .class1 .class2,
  .class1 .class3 {
    background-color: #888;
    background-image: url('base64:abcd');
  }
}

```

### Usage
#### Webpack
```js
const CSSDarkModePlugin = require('css-plugin-darkmode');
...
rules: [
  {
    test: /\.less$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'less-loader',
        options: {
          plugins: [
            new CSSDarkModePlugin() // Use plugin here
          ]
        }
      }
    ]
  }
]
...
```
#### Grunt
```js
const CSSDarkModePlugin = require('css-plugin-darkmode');
...
less: {
  production: {
    options: {
      paths: ['styles/'],
      plugins: [
        new CSSDarkModePlugin() // Use plugin here
      ]
    },
    files: {
      '../dist/style.css': 'styles/style.less'
    }
  }
}
...
```
#### Node (API)
```js
const CSSDarkModeParser = require('css-plugin-darkmode').Parser;
const cssDarkmode = CSSDarkModeParser(css, {
  syntax: 'less' // less|css|sass|scss
})
```