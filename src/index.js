import express from 'express'
import productRouter from './routes/product.js'
import categoryRouter from './routes/category.js'
import brandRouter from './routes/brand.js'

const app = express()

app.use(express.json())

app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/brand', brandRouter)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
