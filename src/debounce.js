export function debounce (fn, wait = 300) {
  let t
  return (...args) => {
    window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), wait)
  }
}
