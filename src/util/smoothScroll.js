import { sinerp } from './lerp'

export default function smoothScroll (element, to, time) {
  let start
  const animate = () => {
    if (!start) start = Date.now()
    const progress = Date.now() - start
    const target = sinerp(element.scrollTop, to, progress / time)
    element.scrollTo({ top: target })
    if (progress < time && Math.abs(element.scrollTop - to) > 1) {
      window.requestAnimationFrame(animate)
    }
  }
  animate()
  return {
    clear: () => {
      window.cancelAnimationFrame(animate)
    }
  }
}
