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
    var sql = "CREATE TABLE tb_favorito (id INT AUTO_INCREMENT PRIMARY KEY, fk_usuario INT, fk_animal INT, FOREIGN KEY (fk_usuario) REFERENCES tb_usuario(id) ON DELETE CASCADE, FOREIGN KEY (fk_animal) REFERENCES tb_animal(id) ON DELETE CASCADE)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Tabela favoritos criada");
    });
    con.end();
});
