// Simple in-memory rate limiting middleware

const rateLimitStore = new Map()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > 900000) { // 15 minutes
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress
    const now = Date.now()

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 0,
        resetTime: now + windowMs
      })
    }

    const userData = rateLimitStore.get(key)

    // Reset if window has passed
    if (now > userData.resetTime) {
      userData.count = 0
      userData.resetTime = now + windowMs
    }

    // Check if limit exceeded
    if (userData.count >= maxRequests) {
      const resetIn = Math.ceil((userData.resetTime - now) / 1000)
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
        retryAfter: resetIn
      })
    }

    // Increment counter
    userData.count++

    // Add headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': Math.max(0, maxRequests - userData.count),
      'X-RateLimit-Reset': new Date(userData.resetTime).toISOString()
    })

    next()
  }
}

// Stricter rate limiting for write operations
export const strictRateLimit = rateLimit(10, 5 * 60 * 1000) // 10 requests per 5 minutes
export const generalRateLimit = rateLimit(100, 15 * 60 * 1000) // 100 requests per 15 minutes
