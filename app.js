const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const {
  readContacts,
  addContact,
  updateContact,
  deleteContact
} = require('./utils/fileUtils');

const app = express();
const PORT = 3000;

// handlebars instance
const hbsInstance = hbs.create();

// hbs configuration
app.engine('handlebars', hbsInstance.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// static files
app.use(express.static('public'));

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// ruta front - pagina principal
// esta es la unica vista, aca se listan los contactos
// se puede agregar, editar y eliminar contactos mediante un modal
app.get('/', (req, res) => {
  const contacts = readContacts();
  res.render('home', { 
    title: 'Home Page',
    contacts
  });
});

// ruta backend - crear contacto
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.redirect('/');
  }
  // Generar id simple
  const id = Date.now().toString();
  try {
    addContact({ id, name, email, phone });
  } catch (err) { 
    // Si el id existe, ignorar
  }
  res.redirect('/');
});

// ruta backend - editar contacto
// se usa post por limitacion de formularios html
app.post('/contacts/:id/edit', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.redirect('/');
  }
  updateContact(id, { name, email, phone });
  res.redirect('/');
});

// ruta backend - eliminar contacto
app.post('/contacts/:id/delete', (req, res) => {
  const { id } = req.params;
  deleteContact(id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});