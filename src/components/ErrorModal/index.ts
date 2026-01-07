import { createVNode, render } from 'vue'
import ErrorModalVue from './index.vue'

// 定义弹窗调用函数
function openModal(options = {}) {
    // 默认配置
    const defaultOptions = {
        title: '提示',
        desc: '',
        // 确认按钮回调
        onConfirm: () => {},
        // 关闭按钮回调
        onClose: () => {},
    }

    // 合并配置
    const finalOptions = { ...defaultOptions, ...options }

    // 创建容器
    const container = document.createElement('div')

    // 创建虚拟节点
    const vnode = createVNode(ErrorModalVue, {
        'title': finalOptions.title,
        'desc': finalOptions.desc,
        'modelValue': true, // 默认打开
        'onUpdate:modelValue': (val: any) => {
            if (!val) {
                // 关闭时销毁组件
                render(null, container)
                document.body.removeChild(container)
            }
        },
        'onConfirm': () => {
            finalOptions.onConfirm()
        },
        'onClose': () => {
            finalOptions.onClose()
        },
    })

    // 渲染组件到容器
    render(vnode, container)

    // 将容器添加到body
    document.body.appendChild(container)

    // 返回关闭方法（可选）
    return {
        close: () => {
            render(null, container)
            document.body.removeChild(container)
        },
    }
}

export default openModal
