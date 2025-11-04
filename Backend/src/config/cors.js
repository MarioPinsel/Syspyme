export const corsConfig = {
    // en dev permitir cualquier origen; en prod usar la variable FRONTEND_URL
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
    credentials: true,
    optionsSuccessStatus: 200
}