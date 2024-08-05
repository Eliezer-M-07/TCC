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
    var sql = "CREATE TABLE admin (nome VARCHAR(255), email VARCHAR(255), senha VARCHAR(255))";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tabela admin criada");
    });
    

    var sql2 = "INSERT INTO admin (nome, email, senha) VALUES ('Admin', 'safepetadmin@gmail.com', 'adminsafepet@24')";
    con.query(sql2, function(err, result){
        if (err) throw err;
        console.log("Admin inserido.");
    })

    con.end();
});