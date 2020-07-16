# 流程表单

尝试根据 JSON Schema，自动生成 ui 表单，串联起来

## 一些注意点

1. UI 无关，因为表单的表示形式有很多种，当也要有一定的约束
2. ~~在 JSON Schema 中添加 form 字段，添加 form 相关配置~~，form 的配置需要分开，因为 JSON Schema 中不应该嵌入任何其它数据
   1. 这里主要是考虑到，如果 JSON Schema 比较大，不可能手动去修改里面内容
   2. 一般来讲，也不大可能手动去写 JSON Schema，大多时候都是用工具自动生成
   3. 分开配置也不会特别复杂，根据对应的字段路径，匹配到即可，需要特殊考虑一下数组的匹配方式

## 设计思路

1. 根据 JSON Schema 生成 UI 配置
2. 根据 UI 配置生成 UI(UI 配置就是一串 JSON，与 UI 框架无关)

一些思考：

JSON Schema 的类型有：

- string
- number
- boolean
- object
- array

JSON Schema 的其它字段

- required: 是否必须
- type: 类型，可以是多个类型，例如可以是 ['number', 'string', 'boolean']，这里可以考虑后退一步，不能用多个类型。如果比较复杂，分开用多个配置选项
- enum: 设计成下拉框的形式
- anyOf, oneOf: 在父级提供一个下拉框，可选择其中一项，动态生成对应的 UI
- allOf: 组合起来即可
- pattern: 正则表达式验证

## 配置

可兼容两种配置，第一种就是 JSON Schema，第二种，就是根据 JSON Schema 生成的 UI 配置。

主要来讲，UI 配置才是核心，JSON Schema 只是一个需求，把 JSON Schema 转换成 UI 配置这个过程，可以抽离出来。

实际上，如果没有 JSON Schema，可以直接手写 UI 配置。

## 相关细节

例如，~~用 Vue 来实现 UI~~

按照组件划分，需要实现的组件有：

- Form: 表单组件， form 标签
- FormItem: 表单中的容器组件 div 标签
- FormInput: 输入组件，对应 string, number; input 标签
- FormCheckbox: 对应 boolean; input:checkbox 标签
- FormSelect: 对应 enum; select 标签
- FormArray: 对应 array; div 标签
- FormObject: 对应 object; div 标签
