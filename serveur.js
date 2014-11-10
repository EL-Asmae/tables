var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Répertoire contenant les données statiques
app.use(express.static(__dirname + '/public'));

// Réponse à la requête permettant d'obtenir la liste des tables
app.get('/listeTables', function(req, res){
	
	// envoi des données au format JSON
	res.json(tables);
});

// Réponse à la requête permettant de changer l'état d'une tables
app.post('/modifierTable/etat/:t/:e', function(req, res){
	var id = req.params.t;
	var etat = req.params.e;
	console.log('************'+etat+'***********');
	console.log('************'+id+'***********');
	tables[id].etat = etat;
	console.log('************fin***********');
	res.json(tables[id]);
});


// Réponse à la requête permettant d'obtenir les données d'une table
app.get('/data/:table', function(req, res){
	// chargement des données
	var table = tables[req.params.table];

	// envoi des données au format JSON
	res.json(table);
});

// Démarrage du serveur
http.listen(3030, function(){
  console.log('listening on *:3030');
});













//---------SOCKET--------------
io.on('connection', function(socket){
	
  socket.on('changerEtat', function(data){
	//modifier une table
    var id = data[0];
    var etat = data[1];
    tables[id].etat = etat;
    //console.log('la table: ' + data[0] +' = '+data[1]);
    console.log(JSON.stringify(tables[id]));
	//envoyer la table modifiée
    io.emit('miseAJour', data);
  });


});












// Les données des tables 
// (typiquement ces données seraient enregistrées en base de données)
var table = function(_id,_nom,_addresse,_etat,_img,_details,_lieu) {
  this.id = _id;
  this.nom = _nom;
  this.addresse = _addresse;
  this.etat = _etat;
  this.img = _img;
  this.details = _details;
  this.lieu=_lieu;
};
var lieu = function(_id,_nom,_position) {
  this.id = _id;
  this.nom = _nom;
  this.position = _position;
};
var fut = function(_id,_volume,_boisson,_table) {
  this.id = _id;
  this.volume = _volume;
  this.boisson = _boisson;
  this.table = _table;
};
var boisson = function(_id,_fabricant,_logo,_type,_description) {
  this.id = _id;
  this.fabricant = _fabricant;
  this.logo = _logo;
  this.type = _type;
  this.description = _description;
};
var prix_lieu = function(_lieu,_boisson,_prix) {
  this.lieu = _lieu;
  this.boisson = _boisson;
  this.prix = _prix;
};

var lieux = [
      new lieu(0,'brest','a'),
      new lieu(1,'paris','b')

    ];

  var tables = [
      new table(0,'Annick','54:25:36:j5','OFF','images/table.png',false,lieux[0]),
      new table(1,'Annegrete','f4:58:4g:fz','OFF','images/table.png',false,lieux[1])

    ];
  var boissons= [
      new boisson(0,'DOSI','logo1','boisson chaud','café'),
      new boisson(1,'DOSI','logo2','boisson froid','coca-cola')

  ];
  var futs = [
      new fut(0,'10l',boissons[0],tables[0]),
      new fut(1,'50l',boissons[1],tables[1])

  ];

  var prix_lieux = [
      new prix_lieu(lieux[0],boissons[0],'1$'),
      new prix_lieu(lieux[1],boissons[1],'2$')

  ];
