const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = require("chai").assert;
const server = "http://localhost:3000";

require("dotenv").config();
chai.use(chaiHttp);

suite("API routing for /notes", () => {
  suite("GET", () => {
    test("GET all notes", done => {
      chai
        .request(server)
        .get("/notes")
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isObject(res.body[0]);
          done();
        });
    });
    test("GET a single note by ID", done => {
      const id = "5cbf9c62907a0352241520f5";
      chai
        .request(server)
        .get(`/notes/${id}`)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.equal(res.body._id, id);
          assert.isString(res.body.text);
          done();
        });
    });
  });
});
