# 测试 WebAssembly

用 AssemblyScript，因为熟悉 ts，所以用这个方案来测试。

1. 用 AssemblyScript 写代码，可以理解成 ts 的超集
2. 用 `asc` 编译，对应 `assemblyscript` 包
3. 用 `WebAssembly.instantiateStreaming/instantiate` 加载编译后的 wasm 文件
4. js 引用加载之后的代码
