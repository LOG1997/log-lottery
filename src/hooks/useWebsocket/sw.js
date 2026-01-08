/* eslint-disable no-restricted-globals */
// Service Worker 最小示例

// 安装事件
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed', event)
    // 跳过等待，立即激活
    self.skipWaiting()
})

// 激活事件
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated')
    // 立即控制所有页面
    event.waitUntil(self.clients.claim())
})

// 拦截 fetch 请求
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching', event.request.url)

    event.respondWith(
        caches.match(event.request).then((response) => {
            // 如果缓存中有，返回缓存
            if (response) {
                return response
            }
            // 否则发起网络请求
            return fetch(event.request)
        }),
    )
})

// 监听页面消息
self.addEventListener('message', async (event) => {
    console.log('Service Worker received message:', event.data)

    // 处理来自页面的消息
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'CONNECT_WS':
                // 连接到WebSocket
                self.webSocketConnection = new WebSocket(event.data.payload)

                // 监听WebSocket消息
                self.webSocketConnection.addEventListener('message', (message) => {
                    console.log('Received message from WebSocket:', message.data)

                    // 发送消息给页面
                    event.source.postMessage({
                        type: 'WS_MESSAGE',
                    })
                })
                break
            case 'PING':
                console.log('Ping from page')
                event.source.postMessage({
                    type: 'PONG',
                    message: 'Service Worker is alive',
                })
                break
            case 'NOTIFICATION': {
                const notificationData = event.data.payload
                const options = {
                    body: notificationData.body,
                    icon: notificationData.icon || '/favicon.ico',
                    badge: '/favicon.ico',
                }
                // 向外部发送通知
                self.registration.showNotification(notificationData.title, options)
                break
            }
            case 'GET_WS_STATUS':
                // 返回WebSocket连接状态（如果有的话）
                event.source.postMessage({
                    type: 'WS_STATUS',
                    connected: self.webSocketConnection && self.webSocketConnection.readyState === WebSocket.OPEN,
                })
                break
            default:
                console.log('Unknown message type:', event.data.type)
                break
        }
    }
})

// 监听通知点击事件
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification.title)

    event.notification.close()

    // 打开或聚焦到页面
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/'),
    )
})
