import express from 'express'
import productRouter from './routes/product.js'

const app = express()

app.use(express.json())

app.use('/product', productRouter)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
