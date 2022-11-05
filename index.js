const express = require('express')
const res = require('express/lib/response')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const port = 3000

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
let count = 0
const testSchema = new mongoose.Schema({ test: String })
const testModel = new mongoose.model('testSchema', testSchema)

const SchoolSalarySchema = new mongoose.Schema({
  schoolDistrictName: [String],
  salaries: { BA: [Number], 'BA+': [Number], 'BA++': [Number], MA: [Number], 'MA+': [Number], 'MA++': [Number], PHD: [Number] }
})

const SchoolSalaryModel = new mongoose.model('schoolDistrictSalaries', SchoolSalarySchema)

app.get('/all', async (req, res) => {
  // res.send('Hello World!')
  let allSchools = await SchoolSalaryModel.find({})
  console.log(allSchools)
  res.send(allSchools)
})

app.get('/', async (req, res) => {
  // res.send('Hello World!')
  let allItems = await testModel.find({})
  console.log(allItems)
  res.send(allItems)
})

app.get('/addOne/:text', (req, res) => {
  console.log(req.params)
  let makeObj = (text) => { return { test: `${text}` } }
  let obj = makeObj(req.params.text)
  const examp = new testModel(obj)

  examp.save().then(
    (item) => {
      console.log(item + ' has been added to the db')
      res.send(item)
    },
    (err) => {
      console.log(err)
      res.send(err)
    }
  )
})

app.delete('/deleteAll', async (req, res) => {
  try {
    const deleted = await testModel.deleteMany({})
    console.log(deleted)
    res.send(`you deleted everything here is what is left ${(deleted.stringify())}`)
  } catch (e) {
    res.send(e)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
