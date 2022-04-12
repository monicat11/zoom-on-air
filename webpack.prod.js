module.exports = {
    entry: ['./api/index.js'],
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    resolve: {
        modules: [
          'node_modules'
        ],
        extensions: ['.js', '.jsx', '.ts'],
        fallback: {
            "fs": false,
            "url":false,
            "util":false,
            "stream":false,
            "path":false,
            "buffer":false,
            "querystring":false,
            "http":false,
            "net":false,
            "crypto":false,
            "zlib":false,

        },
    }
}