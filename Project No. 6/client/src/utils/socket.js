import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.DEV
  ? 'http://localhost:8000'
  : window.location.origin

class SocketManager {
  constructor() {
    this.socket = null
    this.listeners = new Map()
    this.isConnected = false
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      this.isConnected = true
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      this.isConnected = false
    })

    // Re-attach existing listeners
    for (const [event, callbacks] of this.listeners) {
      for (const callback of callbacks) {
        this.socket.on(event, callback)
      }
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected, cannot emit:', event)
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)

    if (this.socket?.connected) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
        if (this.socket?.connected) {
          this.socket.off(event, callback)
        }
      }
    }
  }

  // Activity tracking
  trackActivity(type, data) {
    this.emit('user-activity', {
      type, // 'view-post', 'like-post', 'create-post', etc.
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Post events
  onPostCreated(callback) {
    this.on('post-created', callback)
  }

  onLikeUpdated(callback) {
    this.on('like-updated', callback)
  }

  onUserActivity(callback) {
    this.on('user-activity', callback)
  }
}

// Create singleton instance
const socketManager = new SocketManager()

export default socketManager
export { SocketManager }
