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
    var sql = "CREATE TABLE tb_usuario (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), email VARCHAR(255), senha VARCHAR(255), telefone VARCHAR(255) , pfp VARCHAR(255))";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tabela usuários criada");
    });
    con.end();
});