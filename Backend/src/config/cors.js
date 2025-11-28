export const corsConfig = {
    origin: function (origin, callback) {
        const whitelist = [origin]

        if (process.argv[2] === '--api') {
            whitelist.push(undefined)
        }

        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
} 