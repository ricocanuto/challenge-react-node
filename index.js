const express = require('express')
const cors = require('cors')

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const port = 3000
const app = express()
app.use(express.json())
app.use(cors())

const checkOrderId = async (request, response, next) => {
    const { id } = request.params

    const order = await prisma.order.findUnique({ where: { id } })

    if (!order) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.order = order
    next()
}

app.get('/orders', async (request, response) => {
    const orders = await prisma.order.findMany()
    return response.json(orders)
})

app.post('/orders', async (request, response) => {
    const { order, clientName, price } = request.body

    const newOrder = await prisma.order.create({
        data: {
            order,
            clientName,
            price,
        }
    })

    return response.status(201).json(newOrder)
})

app.put('/orders/:id', checkOrderId, async (request, response) => {
    const { order, clientName, price } = request.body;
    const { id } = request.params;

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: { order, clientName, price }
    });

    return response.json(updatedOrder);
});

app.delete('/orders/:id', checkOrderId, async (request, response) => {
    const { id } = request.params

    await prisma.order.delete({ where: { id } })

    return response.status(204).json()
})

app.patch('/orders/:id/status', checkOrderId, async (request, response) => {
    const { id } = request.params

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: 'ready' }
    })

    return response.json(updatedOrder)
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})




//mongoDB
//usuário: ricardocanuto
//senha: il4wB0ksEBVb8Q6j

//mongodb+srv://ricardocanuto:<password>@orders.5fs2bxf.mongodb.net/?retryWrites=true&w=majority&appName=Ordersnpx prisma

