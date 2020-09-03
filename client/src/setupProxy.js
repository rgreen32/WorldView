const { createProxyMiddleware } = require('http-proxy-middleware')

if (process.env.REACT_APP_PROXY_TARGET) {
    module.exports = (app) => {
        app.use("/worldview/images",
            createProxyMiddleware({
                target: process.env.REACT_APP_PROXY_TARGET,
            })
        )
        app.use("/worldview/download",
            createProxyMiddleware({
                target: process.env.REACT_APP_PROXY_TARGET,
            })
        )
    }
}
