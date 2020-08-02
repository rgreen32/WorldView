const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (app) => {
    app.use("/worldview/images",
        createProxyMiddleware({
            target: "http://localhost:5000",
        })
    )
}