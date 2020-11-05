const fs = require('fs-extra')
const path = require('path')
const pug = require('pug')

const r = (...args) => path.join(__dirname, '..', ...args)
const htmlFolderName = 'html'

const config = {
  tplPath: r(`${htmlFolderName}/index.pug`)
}

start()

async function start() {
  const dirPath = r(htmlFolderName)
  const files = await fs.readdir(dirPath)

  const data = {
    links: []
  }

  files.forEach((file) => {
    const stat = fs.statSync(path.join(dirPath, file))

    if (!stat.isDirectory() || /^_/.test(file)) {
      return
    }

    data.links.push({
      name: file,
      url: `./${htmlFolderName}/${file}/`
    })
  })

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
