var mysql = require('mysql');
var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "safepet"
});


con.connect(function(err) {
    if (err) throw err;
    console.log("Conectado!");
    var sql = "CREATE TABLE animais (id INT AUTO_INCREMENT PRIMARY KEY, fk_ani INT, status VARCHAR(30) NOT NULL, estado VARCHAR(50), cidade VARCHAR(50), data DATE, rua VARCHAR(255), nome VARCHAR(255), especie VARCHAR(255), raca VARCHAR(255), sexo VARCHAR(255), porte VARCHAR(255), peso DECIMAL(10,2), caracteristicas VARCHAR(255), foto VARCHAR(255), FOREIGN KEY (fk_ani) REFERENCES usuarios(id))";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tabela animais criada");
    });
    con.end();
});