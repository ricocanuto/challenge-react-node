const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3000
const app = express()
app.use(express.json())
app.use(cors())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }
    
    request.orderIndex = index
    request.orderId = id

    next()
}

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.post('/orders', (request, response) => {
    const { order, clientName, price } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status: 'pending' }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put('/orders/:id', checkOrderId, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status: orders[index].status }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
    
})

app.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id/status', checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders[index].status = 'ready'

    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
