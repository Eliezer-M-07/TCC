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
    var sql = "CREATE TABLE favoritos (id INT AUTO_INCREMENT PRIMARY KEY, fk_usuario INT, fk_animal INT, FOREIGN KEY (fk_usuario) REFERENCES usuarios(id), FOREIGN KEY (fk_animal) REFERENCES animais(id))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Tabela favoritos criada");
    });
    con.end();
});
