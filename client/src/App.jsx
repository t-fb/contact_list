import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const ContactsList = ({ contacts, deleteContact }) => {
  return contacts.map((contact) => (
    <li key={contact.id}>
      {contact.name} - ({contact.phone})
      <button
        type="button"
        className="delete-btn"
        onClick={() => deleteContact(contact.id)}
      >
        Delete
      </button>
    </li>
  ));
};

const ColourList = ({ colours, deleteColour }) => {
  return colours.map((colour) => (
    <li key={colour._id}>
      {colour.name}
      <button
        type="button"
        className="delete-btn"
        onClick={() => deleteColour(colour._id)}
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

  const [colours, setColours] = useState([]);
  const [newColour, setNewColour] = useState("");
  useEffect(() => {
    fetchAllContacts();
    fetchAllColours();
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

  // =======
  async function fetchAllColours() {
    try {
      let response = await axios.get("/api/colours");
      setColours(response.data);
    } catch (error) {
      console.error("Could not retrieve colours.");
    }
  }
  async function addColour(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/api/colours", { name: newColour });
      setColours((prev) => prev.concat(response.data));
      setNewColour("");
    } catch (error) {
      console.error("Could not add colour");
    }
  }

  async function deleteColour(id) {
    try {
      await axios.delete(`/api/colours/${id}`);
      setColours((prev) => prev.filter((colour) => colour._id !== id));
    } catch (error) {
      console.error("Could not delete colour.");
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
      <div className="container">
        <h3>Add Colour</h3>
        <form onSubmit={addColour} className="contact-form">
          <label>
            Colour:
            <input
              onChange={(event) => setNewColour(event.target.value)}
              value={newColour}
              type="text"
              name="colour"
              required
            />
          </label>

          <button type="submit">Save</button>
        </form>
        <ul className="contact-list">
          <ColourList colours={colours} deleteColour={deleteColour} />
        </ul>
      </div>
    </>
  );
}

export default App;
