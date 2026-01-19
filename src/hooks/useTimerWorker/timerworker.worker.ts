/* eslint-disable no-restricted-globals */
let intervalId: number | null = null
self.addEventListener('message', (e) => {
    const { interval } = e.data
    if (!interval)
        throw new Error('invalid params')
    if (intervalId)
        clearInterval(intervalId)
    intervalId = setInterval(() => {
        self.postMessage(true)
    }, interval)
})
