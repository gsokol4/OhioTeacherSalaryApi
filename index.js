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

const salarySchema = mongoose.Schema({
  BA: [Number],
  'BA+': [Number],
  'BA++': [Number],
  MA: [Number],
  'MA+': [Number],
  'MA++': [Number],
  PHD: [Number]
})
const testSchema = new mongoose.Schema({ test: String })
const testModel = new mongoose.model('testSchema', testSchema)
const schools = require('./schoolsInfo/schoolsInfo.js')

const SchoolSalarySchema = new mongoose.Schema({
  schoolDistrictName: [String],
  baseSalary: Number,
  rando: String,
  salaries: salarySchema
})
SchoolSalarySchema.index({ '$**': 'text' })

console.log(schools)
const SchoolSalaryModel = new mongoose.model('schoolDistrictSalaries', SchoolSalarySchema)

app.get('/all', async (req, res) => {
  // res.send('Hello World!')
  const allSchools = await SchoolSalaryModel.find({})
  console.log(allSchools)
  res.send(allSchools)
})

app.get('/addSchool', async (req, res) => {
  let schoolInfo = SchoolSalaryModel(schools.WestG)
  let modified = await schoolInfo.save()
  res.send(modified)
})

app.get('/find/:schoolName', async (req, res) => {
  try {
    console.log('hello I am working :)')
    console.log(req.params.schoolName)
    const found = await SchoolSalaryModel.find(
      { $text: { $search: req.params.schoolName } }
    )
    console.log(found)
    res.send(found)
  } catch (e) {
    res.send(e)
    console.log(e)
  }
})

app.get('/delById/:id', async (req, res) => {
  try {
    const deleted = await SchoolSalaryModel.deleteOne({ _id: req.params.id })
    res.send(deleted)
  } catch (e) {
    res.send(e)
  }
})

app.get('/delSchool', async (req, res) => {
  try {
    const deleted = await SchoolSalaryModel.deleteMany({})
    console.log(deleted)
    res.send(`you deleted everything here is what is left ${(deleted.stringify())}`)
  } catch (e) {
    res.send(e)
  }
})

app.get('/', async (req, res) => {
  // res.send('Hello World!')
  const allItems = await testModel.find({})
  console.log(allItems)
  res.send(allItems)
})

app.get('/addOne/:text', (req, res) => {
  console.log(req.params)
  const makeObj = (text) => { return { test: `${text}` } }
  const obj = makeObj(req.params.text)
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
