/**
 * @type {HTMLCanvasElement}
 */
const c = document.getElementById('canvas')

const [w, h] = [c.width, c.height]
const [midW, midH] = [w / 2, h / 2]

const ctx = c.getContext('2d')
const max = 4

generateNewOne()

document.getElementById('new').addEventListener('click', generateNewOne)

function generateNewOne() {
  ctx.clearRect(0, 0, w, h)
  branch(0, h, randomDeg())
}

function branch(x, y, deg, len = 300, depth = 0) {
  line(x, y, deg, len)

  if (depth > max) return

  for (let i = 0; i < max - depth; i++) {
    const dl = Math.random() * len
    const dx = dl * Math.sin(deg)
    const dy = dl * Math.cos(deg)

    branch(x + dx, y + dy, randomDeg(), len * 0.6, depth + 1)
  }
}

function line(x, y, deg, len = 50) {
  ctx.beginPath()
  ctx.moveTo(x, y)

  const dx = len * Math.sin(deg)
  const dy = len * Math.cos(deg)

  ctx.lineTo(x + dx, y + dy)
  ctx.stroke()
}

function randomDeg() {
  return 0.5 * Math.PI + 0.5 * Math.PI * Math.random()
}
