import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import pug from 'pug';
const app = express()

import routers from './apis';
app.use(express.static(__dirname + '/views'));
// setting pug
app.set('view engine', 'pug')
app.set('views', './src/views')


app.use(bodyParser.json())

// basic route 
app.get('/', (req, res) => {
    res.send('Hello World!')
}
)

// read data with fs
app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.send('Error reading file', err)
            return
        }
        res.render('Home/users', {
            data: JSON.parse(data)
        })
    })
})

app.post('/data', (req, res) => { 
console.log(req.body)
const newUser = { //req.body luôn
    id: req.body.id,
    name: req.body.name
}
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
    res.send('error reading file', err);
    return;
    }
    console.log(data)
    const dataUsers = JSON.parse(data);
    const newData = [...dataUsers, newUser]
    // console.log('hi',newData)
    fs.writeFile('data.json', JSON.stringify(newData), (err) => {
    if (err) {
        res.send('error writing file', err)
        return
    }
    res.send('Data added')
    })
})

})

app.put('/data/:id', (req, res) => {
    const { id } = req.params
    const { name } = req.body
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.send('Error reading file', err)
            return
        }
        const newData = JSON.parse(data).map(item => {
            if (item.id === id) {
                return { id, name }
            }
            return item
        })
        fs.writeFile('data.json', JSON.stringify(newData), (err) => {
            if (err) {
                res.send('Error writing file', err)
                return
            }
            res.send('Data updated')
        })
    })
}
)
app.delete('/data/:id', (req, res) => {
    const { id } = req.params
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.send('Error reading file', err)
            return
        }
        const newData = JSON.parse(data).filter(item => item.id !== id)
        fs.writeFile('data.json', JSON.stringify(newData), (err) => {
            if (err) {
                res.send('Error writing file', err)
                return
            }
            res.send('Data deleted')
        })
    })
}
)

// app.use('/api', routers);

app.get('/login', (req, res) => {
    return res.render('login/login', {
        title: 'Login',
    }) 
})

app.get('/hello-pug', (req,res) => {
    res.render('Home/hello.pug', {name: 'Pug'})
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
