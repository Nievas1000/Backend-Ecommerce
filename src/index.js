import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import productRouter from './routes/product.js'
import categoryRouter from './routes/category.js'
import brandRouter from './routes/brand.js'
import userRouter from './routes/user.js'
import inventoryRouter from './routes/inventory.js'
import paymentRouter from './routes/payment.js'
import orderRouter from './routes/order.js'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/brand', brandRouter)
app.use('/user', userRouter)
app.use('/inventory', inventoryRouter)
app.use('/payment', paymentRouter)
app.use('/order', orderRouter)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
