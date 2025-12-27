const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.xr4jtjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

// Schema for persons
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Model for persons
const Person = mongoose.model('Person', personSchema)

// Add a new person with arguments
const name = process.argv[3]
const number = process.argv[4]

// If name and number are provided, add the new person
if (name && number) {
  const person = new Person({
    name,
    number,
  })

  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
    })
    .finally(() => {
      mongoose.connection.close()
    })
  return
}

// List all persons
Person.find({})
  .then((result) => {
    console.log('phonebook:')

    // Print each person in the database
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
  })
  .finally(() => {
    mongoose.connection.close()
  })