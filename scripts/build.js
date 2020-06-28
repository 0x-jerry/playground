const fs = require('fs-extra')
const path = require('path')
const pug = require('pug')

const r = (...args) => path.join(__dirname, '..', ...args)

const config = {
  tplPath: r('src/index.pug')
}

start()

async function start() {
  const dirPath = r('src')
  const files = await fs.readdir(dirPath)

  const data = {
    links: []
  }

  const p = files.map(async (file) => {
    const stat = await fs.stat(path.join(dirPath, file))

    if (!stat.isDirectory()) {
      return
    }

    data.links.push({
      name: file,
      url: `./src/${file}/`
    })
  })

  await Promise.all(p)

  await compile(data)

  console.log('Build successful!')
}

async function compile(data) {
  const tpl = await fs.readFile(config.tplPath, { encoding: 'utf-8' })

  const compiler = pug.compile(tpl, {
    pretty: true
  })

  const result = compiler(data)

  await fs.writeFile(r('index.html'), result)
}
