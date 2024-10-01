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


notificacao(usuario_id, tipo, mensagem){
    var sql = "INSERT INTO notificacoes (usuario_id, tipo, mensagem) VALUES ?";
    var values = [[usuario_id, tipo, mensagem]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
    
},

buscaNotificacoes: function (userId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT notificacoes.*, animais.* 
            FROM notificacoes 
            INNER JOIN animais ON notificacoes.usuario_id = animais.fk_ani
            WHERE notificacoes.usuario_id = ? 
            AND notificacoes.lida = 0
        `;
        con.query(sql, [userId], function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
},
   
}
