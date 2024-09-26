const fs = require('fs');
const path = require('path');
con = require("../config/db.js").pool;

module.exports = {


    buscaTodosAdocao: function (filters) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM animais WHERE status = 'adocao'";
            let queryParams = [];

            if (filters.estado) {
                sql += " AND estado = ?";
                queryParams.push(filters.estado);
            }

            if (filters.cidade) {
                sql += " AND cidade = ?";
                queryParams.push(filters.cidade);
            }

            if (filters.especie) {
                sql += " AND especie = ?";
                queryParams.push(filters.especie);
            }

            if (filters.sexo) {
                sql += " AND sexo = ?";
                queryParams.push(filters.sexo);
            }

            con.query(sql, queryParams, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    
    buscaTodosDesaparecidos: function (filters) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM animais WHERE status = 'desaparecido'";
            let queryParams = [];

            if (filters.estado) {
                sql += " AND estado = ?";
                queryParams.push(filters.estado);
            }

            if (filters.cidade) {
                sql += " AND cidade = ?";
                queryParams.push(filters.cidade);
            }

            if (filters.especie) {
                sql += " AND especie = ?";
                queryParams.push(filters.especie);
            }

            if (filters.sexo) {
                sql += " AND sexo = ?";
                queryParams.push(filters.sexo);
            }

            con.query(sql, queryParams, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },


    async todos() {
        var sql = "SELECT * FROM animais";
        return new Promise((resolve, reject) => {
            con.query(sql, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    async busca(id) {
        var sql = "SELECT * FROM animais where id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    async busca2(id) {
        var sql = "SELECT * FROM animais where fk_ani = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    async buscaDados(id) {
        var sql = "SELECT animais.*, usuarios.nome AS anunciante_nome, usuarios.email AS anunciante_email, usuarios.telefone AS anunciante_tel FROM animais JOIN usuarios ON animais.fk_ani = usuarios.id WHERE animais.id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },



    buscaAdocao: function (userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM animais WHERE fk_ani = ? AND status = 'adocao'";
            con.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    buscaDesaparecidos: function (userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM animais WHERE fk_ani = ? AND status = 'desaparecido'";
            con.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    buscaEncontrados: function (userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM animais WHERE fk_ani = ? AND status = 'encontrado'";
            con.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },


    inserir_adocao(fk_ani, status, estado, cidade, nome, especie, raca, sexo, porte, peso, caracteristicas, foto, aprovado) {
        var sql = "INSERT INTO animais (fk_ani, status, estado, cidade, nome, especie, raca, sexo, porte, peso, caracteristicas, foto, aprovado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [fk_ani, status, estado, cidade, nome, especie, raca, sexo, porte, peso, caracteristicas, foto, aprovado];
    
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    inserir_desaparecido(fk_ani, status, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, data, caracteristicas, foto, aprovado) {
        var sql = "INSERT INTO animais (fk_ani, status, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, data, caracteristicas, foto, aprovado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [fk_ani, status, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, data, caracteristicas, foto, aprovado];
    
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },
    
    


    updateAdocao(nome, especie, raca, sexo, porte, peso, estado, cidade, personalidade, foto, id) {
        var sql = "UPDATE animais SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, peso = ?, estado = ?, cidade = ?, caracteristicas = ?, foto = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [peso], [estado], [cidade], [personalidade], [foto], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    updateAdocaoSemFoto(nome, especie, raca, sexo, porte, peso, estado, cidade,  personalidade, id) {
        var sql = "UPDATE animais SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, peso = ?, estado = ?, cidade = ?, caracteristicas = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [peso], [estado], [cidade], [personalidade], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    updateDesaparecido(nome, especie, raca, sexo, porte, estado, cidade, bairro, rua, data, caracteristicas, foto, id) {
        var sql = "UPDATE animais SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, data = ?, caracteristicas = ?, foto = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [estado], [cidade], [bairro], [rua], [data], [caracteristicas], [foto], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    updateDesaparecidoSemFoto(nome, especie, raca, sexo, porte, estado, cidade, bairro, rua, data, caracteristicas, id) {
        var sql = "UPDATE animais SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, data = ?, caracteristicas = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [estado], [cidade], [bairro], [rua], [data], [caracteristicas], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    deletar(id) {
        var sql = "DELETE FROM animais WHERE id = ?";
        con.query(sql, id, function (err, result) {
            if (err) throw err;
        });
    },

    deletarComUser(id){
        var sql = "SELECT foto FROM animais WHERE fk_ani = ?"

        con.query(sql, id, (err, result) => {

            if (err) throw(err);

            result.forEach(animal => {
                const imgPath = path.join(__dirname, '../public/animais/', animal.foto);
                fs.unlink(imgPath, (err) => {
                   if (err) throw err;
                });
            });

            var sql2 = "DELETE FROM animais WHERE fk_ani = ?";

            con.query(sql2, id, function (err, result) {
                if (err) throw err;
            });

        })
    },


    async aprovar(id) {
        var sql = "UPDATE animais SET aprovado = ? WHERE id = ?";
        var values = ['Aprovado', id];

        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    async recusar(id) {
        var sql = "UPDATE animais SET aprovado = ? WHERE id = ?";
        var values = ['Recusado', id];

        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


}