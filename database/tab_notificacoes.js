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
  
var sql = "CREATE TABLE notificacoes (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NOT NULL, animal_id INT, tipo VARCHAR(50), mensagem VARCHAR(255), data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (usuario_id) REFERENCES usuarios(id), FOREIGN KEY (animal_id) REFERENCES animais(id));";  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tabela notificacoes criada");
  });
  
  con.end();
});
