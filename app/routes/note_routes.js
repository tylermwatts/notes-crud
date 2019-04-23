// MongoDB requires not just an ID as a string, but as an ID object or, as they call it, an ObjectID.
var ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

module.exports = function(app, db) {
  app.get("/", (req, res) => {
    res.send(
      `Go to https://localhost:${process.env.PORT}/notes to see all notes.`
    );
  });

  app.get("/notes", (req, res) => {
    db.collection("notes")
      .find({})
      .toArray((err, notes) => {
        if (err) {
          res.send(`${err}`);
        } else {
          res.send(notes);
        }
      });
  });

  app.get("/notes/:id", (req, res) => {
    const id = req.params.id; // get the ID from the request parameters
    const details = { _id: new ObjectID(id) }; // pass the id string into the ObjectID function to create an ID object
    db.collection("notes").findOne(details, (err, note) => {
      if (err) {
        return res.send(`${err}`);
      }
      if (!note) {
        return res.send("Error: No note exists with that ID.");
      }
      return res.send(note);
    });
  });

  app.post("/notes", (req, res) => {
    if (!req.body.body || !req.body.title) {
      return res.send("Error: Your note is missing a title or body.");
    }
    const note = { text: req.body.body, title: req.body.title };
    db.collection("notes").insert(note, (err, result) => {
      if (err) {
        return res.send(`${err}`);
      }
      return res.send(result.ops[0]);
    });
  });

  app.delete("/notes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    db.collection("notes").findOne(details, (err, item) => {
      if (err) return res.send(`${err}`);
      if (!item) return res.send(`Error: Note with ID ${id} was not found.`);
      db.collection("notes").remove(details, (err, note) => {
        if (err) {
          return res.send(`${err}`);
        }
        return res.send(`Note ${id} deleted.`);
      });
    });
  });

  app.put("/notes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection("notes").findOne(details, (err, item) => {
      if (err) return res.send(`${err}`);
      if (!item) return res.send(`Note with ID ${id} was not found.`);
      db.collection("notes").update(details, note, (err, result) => {
        if (err) {
          res.send(`${err}`);
        } else {
          res.send(note);
        }
      });
    });
  });
};
