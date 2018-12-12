const http = require('http')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')


app.use(cors())

// Middleware otetaan käyttöön (ennen routeja )
app.use(bodyParser.json())

// JavaScript -olio notes
let notes = [
    {
      id: 1,
      content: 'HTML on helppoa',
      date: '2017-12-10T17:30:31.098Z',
      important: true
    },
    {
      id: 2,
      content: 'Selain pystyy suorittamaan vain javascriptiä',
      date: '2017-12-10T18:39:34.091Z',
      important: false
    },
    {
      id: 3,
      content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
      date: '2017-12-10T19:20:14.298Z',
      important: true
    }
  ]
  

  // http-get -pyyntö, vastataan response-olion send-metodilla
  
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  // Vastaus: json-muotoinen _merkkijono_ (vrt. notes-olio yllä)
  // express hoitaa muunnoksen json-muotoon (ei tarvita JSON.stringify)
  app.get('/notes', (req, res) => {
    res.json(notes)
  })

  // poluille parametri käyttämällä kaksoispistesyntaksia :id
  // request-olio kertoo pyynnön tiedot
  app.get('/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
  
    if ( note ) {
        // ikä tahansa Javascript-olio on truthy
        response.json(note)
    } else {
        // Id:llä ei löydy muistiinpanoa
        // undefined on falsy eli epätosi
        //end: pyyntöön vastataan ilman dataa
        response.status(404).end()
    }
  })


  // Resurssin poistava route
  app.delete('/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    // Poisto onnistuu:  204 no content, sillä ei lähetetä dataa
    // epäonnistuessa palautuu sama 204
    response.status(204).end()
  })


  const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 1
    return maxId + 1
  }

  //Tapahtumankäsittelijäfunktio dataan käsiksi viittaamalla request.body.
  app.post('/notes', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId()
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })
  
  app.delete('/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })
  
  // middleware: JSON-muotoinen virheilmoitus käsittelemättömistä virheistä
  const error = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
  }
  app.use(error)
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })