const fs = require('fs');
const path = require('path');

// lee los contactos desde contacts.json y los devuelve como un array de objetos
const readContacts = () => {
  const filePath = path.join(__dirname, '..', 'contacts.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// sobreescribe el archivo contacts.json con los datos nuevos
const saveContacts = (newData) => {
  const filePath = path.join(__dirname, '..', 'contacts.json');
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
}

// agrega un nuevo contacto
const addContact = (newContact) => {
  const contacts = readContacts();
  // se busca si ya existe un contacto con el mismo id
  // el metodo .some() devuelve true si al menos un elemento cumple la condicion
  const existingContact = contacts.some(contact => contact.id === newContact.id);
  if (existingContact) throw new Error('Contact already exists');
  const newContacts = [...contacts, newContact];
  saveContacts(newContacts);
  return {
    message: 'Contacto añadido exitosamente',
    contact: newContact
  };
}

// actualizar un contacto existente
const updateContact = (id, updatedContact) => {
  const contacts = readContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) return null;
  // mantener el id original y actualizar el resto de campos
  contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact, id };
  saveContacts(contacts);
  return { message: 'Contacto actualizado exitosamente', contact: contacts[contactIndex] };
}

// eliminar un contacto por id
const deleteContact = (id) => {
  const contacts = readContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) return null;

  const allOtherContacts = contacts.filter(contact => contact.id !== id);
  saveContacts(allOtherContacts);
  return { message: 'Contacto eliminado exitosamente' };
}

module.exports = {
  readContacts,
  addContact,
  updateContact,
  deleteContact
};