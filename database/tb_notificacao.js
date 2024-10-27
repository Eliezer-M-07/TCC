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
  
var sql = "CREATE TABLE tb_notificacao (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NOT NULL, animal_id INT, tipo VARCHAR(50), mensagem VARCHAR(255), data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE, FOREIGN KEY (animal_id) REFERENCES tb_animal(id) ON DELETE CASCADE);";  
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tabela notificacoes criada");
  });
  
  con.end();
});
