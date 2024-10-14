con = require("../config/db.js").pool;
    
module.exports = {

    
async todos() {
    var sql ="SELECT * FROM usuarios";
    return new Promise((resolve, reject) => {
        con.query(sql, (err, row) => {
        if (err) return reject(err);
            resolve(row);
        });
    });
},

async busca(id) {
    var sql ="SELECT * FROM usuarios where id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, row) => {
        if (err) return reject(err);
            resolve(row);
        });
    });
},

async busca2(id) {
    var sql = "SELECT usuarios.*, animais_adocao.* FROM usuarios LEFT JOIN animais_adocao ON usuarios.id = animais_adocao.fk_ado WHERE usuarios.id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, row) => {
        if (err) return reject(err);
            resolve(row);
        });
    });
},

    
inserir(nome, email, senha, telefone, pfp){
    var sql = "INSERT INTO usuarios (nome, email, senha, telefone, pfp) VALUES ?";
    var values = [
    [nome, email, senha, telefone, pfp]
    ];
    
    con.query(sql, [values], function (err, result) {
    if (err) throw err;

    });
},

update(nome, telefone, pfp, id){
    var sql = "UPDATE usuarios SET nome = ?, telefone = ?, pfp = ? WHERE id = ?";
    var values = [
    [nome], [telefone], [pfp], [id]
    ];
    con.query(sql, values, function (err, result) {
    if (err) throw err;
    });
},

updateSempfp(nome, telefone, id){
    var sql = "UPDATE usuarios SET nome = ?, telefone = ? WHERE id = ?";
    var values = [
    [nome], [telefone], [id]
    ];
    con.query(sql, values, function (err, result) {
    if (err) throw err;
    });
},

deletar(id){
    var sql = "DELETE FROM usuarios WHERE id = ?";
    con.query(sql, id, function (err, result) {
    if (err) throw err;
    });
},


notificacao(usuario_id, animal_id, tipo, mensagem){
    var sql = "INSERT INTO notificacoes (usuario_id, animal_id, tipo, mensagem) VALUES ?";
    var values = [[usuario_id, animal_id, tipo, mensagem]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
    
},

notificacao_exclusao(usuario_id, tipo, mensagem){
    var sql = "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES ?";
    var values = [[usuario_id, tipo, mensagem]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
    
},

buscaNotificacoes: function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT n.*, a.*, u.nome AS usuario_nome, u.email AS usuario_email FROM notificacoes n JOIN usuarios u ON n.usuario_id = u.id LEFT JOIN animais a ON n.animal_id = a.id WHERE u.id = ?";
        con.query(sql, [userId], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},

buscaNotificacoesExcluidas: function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM notificacoes WHERE usuario_id = ?";
        con.query(sql, [userId], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},

excluirNotificacoes: function(animal_id){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM notificacoes WHERE animal_id = ?";
        con.query(sql, [animal_id], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });

},

excluirNotificacoes2: function(usuario_id){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM notificacoes WHERE usuario_id = ?";
        con.query(sql, [usuario_id], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},
   
buscafav: function(usuario_id){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM favoritos WHERE ";
        con.query(sql, [usuario_id], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},

buscaFavoritos: function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT fk_animal FROM favoritos WHERE fk_usuario = ?";
        
        con.query(sql, [userId], (err, rows) => {
            if (err) return reject(err);
            
            const favoriteIds = rows.map(row => row.fk_animal); 
            resolve(favoriteIds);
        });
    });
},

buscaFav: function (userId) {
    return new Promise((resolve, reject) => {
        
        const sql = "SELECT a.* FROM animais a JOIN favoritos f ON a.id = f.fk_animal WHERE f.fk_usuario = ?";

        con.query(sql, [userId], (err, rows) => {
            if (err) return reject(err);
            
            
            resolve(rows);
        });
    });
},



}
