// appel de express
const express = require("express");

// utilisation de cors pour autoriser la connexion entre les deux projets
var cors = require("cors");

// connection a la base de donnees
var mongodb = require("mongodb");
const { connectToDb, getDb } = require("./db");


// initialisation de l'api
const app = express();
app.use(cors(), express.json());

//creation de l'instance qui me permettra d'interroger la base de donnees
let db;

//definition du port a utiliser 
const PORT = 8000;

// connection effective a la base de donnee
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log("Server listening on port " + PORT);
    });
    db = getDb();
  } else {
    return err;
  }
});


// retourner la liste des etudiants
app.get("/etudiants", (req, res) => {
  let etudiants = [];

  db.collection("etudiants")
    .find()
    .forEach((book) => etudiants.push(book))
    .then(() => {
      res.status(200).json(etudiants);
    });
});



//enregistrer un nouvel etudiant
app.post("/etudiants", (req, res) => {
  db.collection("etudiants").insertOne(req.body);
});


//supprimer un etudiant
app.delete("/etudiant/:id", (req, res) => {
  db.collection("etudiants").deleteOne({
    _id: new mongodb.ObjectId(req.params.id),
  });
});



//modifier les informations d'un etudiant
app.put("/etudiants", (req, res) => {
  db.collection("etudiants").updateOne(
    {
      _id: new mongodb.ObjectId(req.body.id)
    },
    {
      $set:{
        nom:req.body.nom,
        age:req.body.age,
        filiere: req.body.filiere 
      }
    }
  );
});


// rechercher un etudiant
app.get('/rechercher/:searched',(req,res)=>{
  var searchResult=[]

  db.collection('etudiants')
  .find( { nom : { $regex :new RegExp(req.params.searched,"i") } } )
  .forEach((book) => searchResult.push(book))
  .then(() => {
    res.status(200).json(searchResult);
  });
})