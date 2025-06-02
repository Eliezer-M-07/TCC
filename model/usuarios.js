con = require("../config/db.js").pool;
    
module.exports = {

    
async todos() {
    var sql ="SELECT * FROM tb_usuario";
    return new Promise((resolve, reject) => {
        con.query(sql, (err, row) => {
        if (err) return reject(err);
            resolve(row);
        });
    });
},

async busca(id) {
    var sql ="SELECT * FROM tb_usuario where id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, row) => {
        if (err) return reject(err);
            resolve(row);
        });
    });
},

async busca2(id) {
    var sql = "SELECT tb_usuario.*, animais_adocao.* FROM tb_usuario LEFT JOIN animais_adocao ON tb_usuario.id = animais_adocao.fk_ado WHERE tb_usuario.id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, row) => {
        if (err) return reject(err);
            resolve(row);
        });
    });
},

    
inserir(nome, email, senha, telefone, pfp){
    var sql = "INSERT INTO tb_usuario (nome, email, senha, telefone, pfp) VALUES ?";
    var values = [
    [nome, email, senha, telefone, pfp]
    ];
    
    con.query(sql, [values], function (err, result) {
    if (err) throw err;

    });
},

update(nome, telefone, pfp, id){
    var sql = "UPDATE tb_usuario SET nome = ?, telefone = ?, pfp = ? WHERE id = ?";
    var values = [
    [nome], [telefone], [pfp], [id]
    ];
    con.query(sql, values, function (err, result) {
    if (err) throw err;
    });
},

updateSempfp(nome, telefone, id){
    var sql = "UPDATE tb_usuario SET nome = ?, telefone = ? WHERE id = ?";
    var values = [
    [nome], [telefone], [id]
    ];
    con.query(sql, values, function (err, result) {
    if (err) throw err;
    });
},

deletar(id){
    var sql = "DELETE FROM tb_usuario WHERE id = ?";
    con.query(sql, id, function (err, result) {
    if (err) throw err;
    });
},


notificacao(usuario_id, animal_id, tipo, mensagem){
    var sql = "INSERT INTO tb_notificacao (usuario_id, animal_id, tipo, mensagem) VALUES ?";
    var values = [[usuario_id, animal_id, tipo, mensagem]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
    
},

notificacao_exclusao(usuario_id, tipo, mensagem){
    var sql = "INSERT INTO tb_notificacao (usuario_id, tipo, mensagem) VALUES ?";
    var values = [[usuario_id, tipo, mensagem]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
    
},

buscaNotificacoes: function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT n.usuario_id, n.animal_id, n.mensagem, n.data_criacao, a.foto AS foto_animal, n.tipo AS tipo_notificacao FROM tb_notificacao n JOIN tb_usuario u ON n.usuario_id = u.id LEFT JOIN tb_animal a ON n.animal_id = a.id WHERE u.id = ?";
        con.query(sql, [userId], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},



excluirNotificacoes: function(animal_id){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM tb_notificacao WHERE animal_id = ?";
        con.query(sql, [animal_id], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });

},

excluirNotificacoes2: function(usuario_id){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM tb_notificacao WHERE usuario_id = ?";
        con.query(sql, [usuario_id], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},
   
buscaFavoritos: function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT fk_animal FROM tb_favorito WHERE fk_usuario = ?";
        
        con.query(sql, [userId], (err, rows) => {
            if (err) return reject(err);
            
            const favoriteIds = rows.map(row => row.fk_animal); 
            resolve(favoriteIds);
        });
    });
},

buscaFav: function (userId) {
    return new Promise((resolve, reject) => {
        
        const sql = "SELECT a.* FROM tb_animal a JOIN tb_favorito f ON a.id = f.fk_animal WHERE f.fk_usuario = ?";

        con.query(sql, [userId], (err, rows) => {
            if (err) return reject(err);
            
            
            resolve(rows);
        });
    });
},



}
