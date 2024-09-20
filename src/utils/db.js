import mysql from 'mysql2/promise'

const db = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'ecommerce'
})

export default db
