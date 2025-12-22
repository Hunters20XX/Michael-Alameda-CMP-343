// Request logging middleware

export const requestLogger = (req, res, next) => {
  const start = Date.now()
  const timestamp = new Date().toISOString()

  // Log incoming request
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip || req.connection.remoteAddress}`)

  // Log request body for POST/PUT/PATCH (but not passwords or sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const logBody = { ...req.body }
    // Remove sensitive fields if they exist
    delete logBody.password
    delete logBody.token
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(logBody, null, 2))
  }

  // Override res.json to log responses
  const originalJson = res.json
  res.json = function(data) {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`)

    // Log response data for error responses
    if (res.statusCode >= 400 && data) {
      console.log(`[${new Date().toISOString()}] Error Response:`, JSON.stringify(data, null, 2))
    }

    return originalJson.call(this, data)
  }

  next()
}

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString()
  console.error(`[${timestamp}] ERROR ${req.method} ${req.originalUrl}:`, err.message)
  console.error(`[${timestamp}] Stack:`, err.stack)

  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production'

  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  })
}
