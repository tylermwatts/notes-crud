// MongoDB requires not just an ID as a string, but as an ID object or, as they call it, an ObjectID.
var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/notes", (req, res) => {
    db.collection("notes")
      .find({})
      .toArray((err, notes) => {
        if (err) {
          res.send({ error: err });
        } else {
          console.log(notes);
          res.send(notes);
        }
      });
  });

  app.get("/notes/:id", (req, res) => {
    const id = req.params.id; // get the ID from the request parameters
    const details = { _id: new ObjectID(id) }; // pass the id string into the ObjectID function to create an ID object
    db.collection("notes").findOne(details, (err, note) => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send(note);
      }
    });
  });

  app.post("/notes", (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    db.collection("notes").insert(note, (err, result) => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.delete("/notes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    db.collection("notes").remove(details, (err, note) => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send(`Note ${id} deleted.`);
      }
    });
  });

  app.put("/notes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection("notes").update(details, note, (err, result) => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send(note);
      }
    });
  });
};
