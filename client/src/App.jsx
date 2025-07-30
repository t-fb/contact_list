import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const ContactsList = (props) => {
  return props.contacts.map((contact) => (
    <li key={contact.id}>
      {contact.name} - ({contact.phone})
      <button
        type="button"
        className="delete-btn"
        onClick={() => props.deleteContact(contact.id)}
      >
        Delete
      </button>
    </li>
  ));
};

function App() {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    fetchAllContacts();
  }, []);

  async function fetchAllContacts() {
    try {
      let response = await axios.get("/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Could not retrieve contacts.");
    }
  }

  async function addContact(event) {
    event.preventDefault();
    try {
      let newContact = { name: newName, phone: newPhone };
      const response = await axios.post("/api/contacts", newContact);
      newContact = response.data;
      setContacts((prev) => prev.concat(newContact));

      setNewName("");
      setNewPhone("");
    } catch (error) {
      console.error("Could not add contact");
    }
  }

  async function deleteContact(id) {
    try {
      await axios.delete(`/api/contacts/${id}`);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Could not delete contact.");
    }
  }

  return (
    <>
      <div className="container">
        <h3>Add Contact</h3>
        <form onSubmit={addContact} className="contact-form">
          <label>
            Name:
            <input
              onChange={(event) => setNewName(event.target.value)}
              value={newName}
              type="text"
              name="name"
              required
            />
          </label>
          <label>
            Number:
            <input
              onChange={(event) => setNewPhone(event.target.value)}
              value={newPhone}
              type="text"
              name="phone"
              required
            />
          </label>
          <button type="submit">Save</button>
        </form>
        <div>
          <h3>Contacts</h3>
          <ul className="contact-list">
            <ContactsList contacts={contacts} deleteContact={deleteContact} />
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
