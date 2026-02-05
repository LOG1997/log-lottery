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

self.currentClient = null
// 监听页面消息
self.addEventListener('message', async (event) => {
    // 处理来自页面的消息
    self.currentClient = event.source
    if (event.data && event.data.type) {
        console.log('处理来自页面的消息:', event.data)
        switch (event.data.type) {
            case 'CONNECT_WS':
                console.log('连接的URL:', event.data.payload.url, self.webSocketConnection)
                if (!self.webSocketConnection || self.webSocketConnection.readyState !== WebSocket.OPEN) {
                    self.webSocketConnection = new WebSocket(event.data.payload.url)
                }
                console.log('新连接：', self.webSocketConnection)
                self.webSocketConnection.onopen = () => {
                    console.log('连接成功了，可以发消息')
                    if (self.currentClient) {
                        self.currentClient.postMessage({
                            type: 'WS_OPEN',
                            success: true,
                            payload: {
                                message: '连接成功',
                                data: null
                            }
                        })
                    }
                }
                // 接收到消息推送给客户端
                self.webSocketConnection.onmessage = (message) => {
                    const formatMsg = JSON.parse(message.data)

                    console.log('服务器的消息', formatMsg)
                    if (self.currentClient) {
                        self.currentClient.postMessage({
                            type: 'WS_MESSAGE',
                            success: true,
                            payload: formatMsg,
                        })
                    }
                    // else {
                    //     event.source.postMessage({
                    //         type: 'WS_MESSAGE',
                    //         success: true,
                    //         payload: {
                    //             data: message.data,
                    //         },
                    //     })
                    // }

                }
                // 连接错误
                self.webSocketConnection.onerror = (error) => {
                    console.error('WebSocket error:', error)
                    if (self.currentClient) {
                        self.currentClient.postMessage({
                            type: 'WS_ERROR',
                            success: true,
                            payload: {
                                message: '连接错误',
                                data: error,
                            }
                        })
                    }
                }
                // 连接关闭
                self.webSocketConnection.onclose = () => {
                    console.log('WebSocket connection closed')
                    if (self.currentClient) {
                        self.currentClient.postMessage({
                            type: 'WS_CLOSE',
                            success: true,
                            payload: {
                                message: '已断开连接',
                                data: null
                            }
                        })
                    }
                }
                break
            case 'SEND_WS_MESSAGE':
                const user_msg = event.data.payload.message
                console.log('发送信号改哦西:', user_msg, self.webSocketConnection)
                self.webSocketConnection.send(user_msg)
                break
            case 'DISCONNECT_WS':
                console.log('Disconnecting from WebSocket')
                self.webSocketConnection.close()
                event.source.postMessage({
                    type: 'WS_CLOSE',
                    success: true,
                    payload: {
                        message: '已断开连接',
                        data: null
                    }
                })
                break
            case 'PING':
                console.log('Ping from page')
                self.webSocketConnection.send('PING')
                event.source.postMessage({
                    type: 'PONG',
                    success: true,
                    payload: {
                        message: 'Service Worker is alive',
                    },
                })
                break
            case 'GET_WS_STATUS':
                // 返回WebSocket连接状态（如果有的话）
                event.source.postMessage({
                    type: 'WS_STATUS',
                    success: true,
                    payload: {
                        status: self.webSocketConnection ? self.webSocketConnection.readyState : null,
                        connected: self.webSocketConnection && self.webSocketConnection.readyState === WebSocket.OPEN,
                    }
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
