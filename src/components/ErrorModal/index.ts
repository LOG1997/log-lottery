// e:\t\log-lottery\src\components\ErrorModal\index.ts
import { defineComponent, h, ref, Teleport } from 'vue'

const ErrorModal = defineComponent({
    name: 'ErrorModal',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '错误提示',
        },
    },
    emits: ['update:visible', 'close'],
    setup(props, { emit, slots }) {
        const closeModal = () => {
            emit('update:visible', false)
            emit('close')
        }

        return () => {
            if (!props.visible)
                return null

            return h(Teleport, { to: 'body' }, [
                h('div', {
                    class: 'modal-overlay',
                    onClick: closeModal,
                }, [
                    h('div', {
                        class: 'modal-content',
                        onClick: (e: Event) => e.stopPropagation(),
                    }, [
                        h('div', { class: 'modal-header' }, [
                            h('h3', {}, props.title),
                            h('button', {
                                class: 'close-btn',
                                onClick: closeModal,
                            }, '×'),
                        ]),
                        h('div', { class: 'modal-body' }, [
                            slots.default?.() || [],
                        ]),
                    ]),
                ]),
            ])
        }
    },
})

export default ErrorModal
