import express from 'express';
import bodyParser from "body-parser";
import 'dotenv/config';
import mysql from "mysql";
const app = express();
app.set('view engine', 'pug')
app.use(bodyParser.json());

// PUG
app.get('/', (req, res) => {
  connection.query('SELECT * FROM kirjat', function(err, rows, fields){
    res.render('index', { title:  process.env.nimi, kirjat: rows})
  })
})

// Yhdistää tietokantaan
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  socketPath: process.env.SOCKET_PATH
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Yhdistetty tietokantaan: ${process.env.DATABASE}`);
});

app.get('/kirjat/:id', function(req, res) {
  connection.query('SELECT * FROM kirjat', function(err, rows, fields, ){
    res.render('details', {kirja: rows[0]})
  })
});

app.get('/admin/', function(req, res) {
    res.render('admin')
  })

  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/admin/add-book', function(req, res){

    // data
    var Nimi = req.body.Nimi;
    var Tekija = req.body.Tekija;
    var Vuosi = req.body.Vuosi;
    var Sivumaara = req.body.Sivumaara;

    // lisää datan tietokantaan
    console.log(req.body)
    connection.query(`INSERT INTO kirjat (Nimi, Tekija, Vuosi, Sivut) VALUES ("${Nimi}", "${Tekija}", ${Vuosi}, ${Sivumaara})`);

    console.log(`Kirja on lisätty tietokantaan \n Kirjan tiedot:\n --------------------- \n Nimi: ${Nimi} \n Tekija: ${Tekija} \n Vuosi: ${Vuosi} \n Sivumäärä: ${Sivumaara} \n ---------------------`);
    res.send("Kirja on lisätty tietokantaan!");
  });
