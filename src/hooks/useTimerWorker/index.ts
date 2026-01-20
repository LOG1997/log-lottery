import { onUnmounted } from 'vue'
import TimerWorker from './timerworker.worker?worker'

export function useTimerWorker(interval: number) {
    let timerWorker: Worker | null = null
    const init = (callback: () => void) => {
        close()
        timerWorker = new TimerWorker()
        timerWorker.postMessage({ interval })
        if (timerWorker.onmessage)
            return
        timerWorker.addEventListener('message', () => callback())
    }

    function close() {
        timerWorker?.terminate()
        timerWorker = null
    }

    onUnmounted(() => {
        close()
    })

    return {
        init,
        close,
    }
}
