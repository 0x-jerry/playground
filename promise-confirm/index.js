function html(str) {
  const $el = document.createElement('div')

  $el.innerHTML = str

  return $el.firstChild
}

function getPromise() {
  const p = {
    raw: null,
    resolve: null,
    reject: null
  }

  p.raw = new Promise((resolve, reject) => {
    p.resolve = resolve
    p.reject = reject
  })

  return p
}

function getUI(onConfirm, onCancel) {
  const $confirm = html`<button>确认</button>`
  const $cancel = html`<button>取消</button>`

  const remove = () => {
    $confirm.remove()
    $cancel.remove()
  }

  $confirm.addEventListener('click', () => {
    onConfirm()
    remove()
  })

  $cancel.addEventListener('click', () => {
    onCancel()
    remove()
  })

  document.getElementById('app').appendChild($confirm)
  document.getElementById('app').appendChild($cancel)

  return $confirm
}

function confirm() {
  const p = getPromise()

  getUI(p.resolve, p.reject)

  return p.raw
}

window.onload = () => {
  const $el = html`<button>测试</button>`

  $el.addEventListener('click', async () => {
    console.log('start')
    try {
      await confirm()
      console.warn('yes')
    } catch (error) {
      console.error('no')
    } finally {
      console.log('end')
    }
  })

  document.getElementById('app').appendChild($el)
}
