export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
  let response = undefined

  if (!importObject) {
    importObject = {
      env: {
        abort: () => console.log('Abort!')
      }
    }
  }

  if (WebAssembly.instantiateStreaming) {
    response = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl), importObject)
  } else {
    const res = await fetch(wasmModuleUrl)
    const wasmArrayBuffer = await res.arrayBuffer()

    response = WebAssembly.instantiate(wasmArrayBuffer, importObject)
  }

  return response
}

const runWasmAdd = async () => {
  const wasmModule = await wasmBrowserInstantiate('./hello.wasm')

  console.log(wasmModule)

  const addResult = wasmModule.instance.exports.add(24, 24)

  document.body.innerHTML = `Calc from wasm module: 24 + 24 = ${addResult}<br><br>Open devtool to see the wasm object`
}

runWasmAdd()
