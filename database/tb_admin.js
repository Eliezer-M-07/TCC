var mysql = require('mysql');
const bcrypt = require('bcrypt');

var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "safepet"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Conectado!");
    var sql = "CREATE TABLE tb_admin (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), email VARCHAR(255), senha VARCHAR(255))";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tabela admin criada");
    });
    
    const senha = "adminsafepet@24";
    const saltRounds = 10;

    bcrypt.hash(senha, saltRounds, function (err, hash) {
        if (err) throw err;
        var sql2 = "INSERT INTO tb_admin (nome, email, senha) VALUES (?, ?, ?)";
        con.query(sql2, ['Admin', 'safepetadmin@gmail.com', hash], function(err, result){
            if (err) throw err;
            console.log("Admin inserido.");
            
            con.end();
        });
    });

    
});