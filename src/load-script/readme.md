# 加载 Script 的几种方式

简单试试 script 几种加载方式，看看脚本执行的时机

## innerHtml 写入

```js
document.body.innerHtml += '<script src="..."/>'
```

这样是不会生效的，通过查找文档 [innerHTML#Security_considerations] 发现，由于安全原因，用 innerHtml 添加的 script 是不会执行的。

[innerhtml#security_considerations]: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#Security_considerations

## document.write

```js
document.write('<script src="..."/>)
```

如果在 window.load 之前执行，会在 html 之后添加 write 的文本。如果在 window.load 之后执行，这会情况 html 的内容，重新写入 write 的内容。

这是因为，如果对一个已经加载的 html 执行 `document.write` 会自动调用 `document.open/close`。从而导致浏览器重新解析 html 文档

## createElement

```js
const $el = document.createElement('script')
$el.src = '...'
```

正常异步加载方式，也是比较正确的加载方式

## import

ES6 出现之后的新的加载方式，天生支持异步，简直不要太好用。

不考虑 IE 的化，直接上
