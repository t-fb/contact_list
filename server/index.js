import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to PostgreSQL
const pool = new pg.Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Connect to MongdoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// define colour schema
const colourSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Colour = mongoose.model("Colour", colourSchema);

// colours routes +++++++
// Get all colours
app.get("/api/colours", async (req, res) => {
  try {
    const colours = await Colour.find({});
    res.json(colours);
  } catch (err) {
    console.error("Error fetching colours:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new colour
app.post("/api/colours", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Colour name required" });
  }

  try {
    const newColour = new Colour({ name });
    const savedColour = await newColour.save();
    res.status(201).json(savedColour);
  } catch (err) {
    console.error("Error adding colour:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a colour by ID
app.delete("/api/colours/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Colour.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Colour not found" });
    res.json({ message: "Colour deleted" });
  } catch (err) {
    console.error("Error deleting colour:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// contacts routes ++++++++++++++
// Add a new contact
app.post("/api/contacts", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone)
    return res.status(400).json({ error: "Name and phone required" });

  try {
    const result = await pool.query(
      "INSERT INTO contacts (name, phone) VALUES ($1, $2) RETURNING *",
      [name, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting contact:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a contact by ID
app.delete("/api/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("DELETE FROM contacts WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
