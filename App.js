const express = require('express');
const {PrismaClient} = require('@prisma/client');

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();
const app =  express();

app.use(express.json());

app.get('/events', async (req,res) =>{
    const events = await prisma.event.findMany();
    res.json(events);
})

app.get('/events/:id', async (req,res) =>{
    const {id} = req.params;

    try{
        const event = await prisma.event.findUnique({
            where: {id:parseInt(id)}
        });
        if(event){
            res.json(event);
        }else{
            res.status(404).json({error: 'Evento não encontrado'});
        }
    }catch(error){
        res.status(400).json({error: error.message});
    }
} )

app.post('/events', async (req,res) =>{
    const {name,description,date,location} = req.body;

    try{
        const event = await prisma.event.create({
            data:{
                name,
                description,
                date: new Date(date),
                location,
            },
        });
        res.json(event);
    } catch(error) {
        res.status(400).json({error: error.message})
    }
} )

app.delete('/events/:id', async (req,res) =>{
    const {id} = req.params;
    try{
        await prisma.event.delete({
            where: {id:parseInt(id)},
        });
        res.json({message: 'Evento deletado!'});
        
    }catch(error){
        res.status(400).json({error: error.message});
    }
})

app.put('/events/:id', async (req,res) =>{
    const {id} = req.params;
    const {name, description,date,location} = req.body;

    try{
        const event = await prisma.event.update({
            where:{id:parseInt(id)},
            data:{name,description,date,location}
        })
        res.json(event);
    }catch(error){
        res.status(400).json({error: error.message});
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

