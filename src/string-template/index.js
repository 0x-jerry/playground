console.log('hello')

/**
 *
 * @param {string[]} tplStrings
 * @param  {...any[]} keys
 */
function tagged(tplStrings, ...keys) {
  console.log(tplStrings, keys)

  return tplStrings.join(' - ')
}

console.log(tagged`Hello ${'world'}, and I am ${'Mike'}.`)
