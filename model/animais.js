const fs = require('fs');
const path = require('path');
con = require("../config/db.js").pool;

module.exports = {


    buscaTodosAdocao: function (filters) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_animal WHERE tipo = 'adocao'";
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
            let sql = "SELECT * FROM tb_animal WHERE tipo = 'desaparecido'";
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

    buscaTodosEncontrados: function (filters) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_animal WHERE tipo = 'encontrado'";
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
        var sql = "SELECT * FROM tb_animal";
        return new Promise((resolve, reject) => {
            con.query(sql, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    async busca(id) {
        var sql = "SELECT * FROM tb_animal where id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    async busca2(id) {
        var sql = "SELECT * FROM tb_animal where fk_usuario = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    async buscaDados(id) {
        var sql = "SELECT tb_animal.*, tb_usuario.nome AS anunciante_nome, tb_usuario.email AS anunciante_email, tb_usuario.telefone AS anunciante_tel FROM tb_animal JOIN tb_usuario ON tb_animal.fk_usuario = tb_usuario.id WHERE tb_animal.id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },



    buscaAdocao: function (userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tb_animal WHERE fk_usuario = ? AND tipo = 'adocao'";
            con.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    buscaDesaparecidos: function (userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tb_animal WHERE fk_usuario = ? AND tipo = 'desaparecido'";
            con.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    buscaEncontrados: function (userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tb_animal WHERE fk_usuario = ? AND tipo = 'encontrado'";
            con.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },


    inserir_adocao(fk_usuario, tipo, estado, cidade, nome, especie, raca, sexo, porte, peso, caracteristicas, foto, status) {
        var sql = "INSERT INTO tb_animal (fk_usuario, tipo, estado, cidade, nome, especie, raca, sexo, porte, peso, caracteristicas, foto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [fk_usuario, tipo, estado, cidade, nome, especie, raca, sexo, porte, peso, caracteristicas, foto, status];
    
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    inserir_desaparecido(fk_usuario, tipo, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, data, caracteristicas, foto, status) {
        var sql = "INSERT INTO tb_animal (fk_usuario, tipo, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, data, caracteristicas, foto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [fk_usuario, tipo, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, data, caracteristicas, foto, status];
    
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    inserir_encontrado(fk_usuario, tipo, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, caracteristicas, foto, status) {
        var sql = "INSERT INTO tb_animal (fk_usuario, tipo, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, caracteristicas, foto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [fk_usuario, tipo, estado, cidade, bairro, rua, nome, especie, raca, sexo, porte, caracteristicas, foto, status];
    
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },
    
    


    updateAdocao(nome, especie, raca, sexo, porte, peso, estado, cidade, personalidade, foto, id) {
        var sql = "UPDATE tb_animal SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, peso = ?, estado = ?, cidade = ?, caracteristicas = ?, foto = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [peso], [estado], [cidade], [personalidade], [foto], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    updateAdocaoSemFoto(nome, especie, raca, sexo, porte, peso, estado, cidade,  personalidade, id) {
        var sql = "UPDATE tb_animal SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, peso = ?, estado = ?, cidade = ?, caracteristicas = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [peso], [estado], [cidade], [personalidade], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    updateDesaparecido(nome, especie, raca, sexo, porte, estado, cidade, bairro, rua, data, caracteristicas, foto, id) {
        var sql = "UPDATE tb_animal SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, data = ?, caracteristicas = ?, foto = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [estado], [cidade], [bairro], [rua], [data], [caracteristicas], [foto], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    updateDesaparecidoSemFoto(nome, especie, raca, sexo, porte, estado, cidade, bairro, rua, data, caracteristicas, id) {
        var sql = "UPDATE tb_animal SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, data = ?, caracteristicas = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [estado], [cidade], [bairro], [rua], [data], [caracteristicas], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    updateEncontrado(nome, especie, raca, sexo, porte, estado, cidade, bairro, rua, foto, id) {
        var sql = "UPDATE tb_animal SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, foto = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [estado], [cidade], [bairro], [rua], [foto], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    updateEncontradoSemFoto(nome, especie, raca, sexo, porte, estado, cidade, bairro, rua, id) {
        var sql = "UPDATE tb_animal SET nome = ?, especie = ?, raca = ?, sexo = ?, porte = ?, estado = ?, cidade = ?, bairro = ?, rua = ? WHERE id = ?";
        var values = [[nome], [especie], [raca], [sexo], [porte], [estado], [cidade], [bairro], [rua], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    deletar(id) {
        var sql = "DELETE FROM tb_animal WHERE id = ?";
        con.query(sql, id, function (err, result) {
            if (err) throw err;
        });
    },

    async aprovar(id) {
        var sql = "UPDATE tb_animal SET status = ? WHERE id = ?";
        var values = ['Aprovado', id];

        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },

    async recusar(id) {
        var sql = "UPDATE tb_animal SET status = ? WHERE id = ?";
        var values = ['Recusado', id];

        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    adicionarFavorito: (userId, animalId) => {
        const sql = 'INSERT INTO tb_favorito (fk_usuario, fk_animal) VALUES (?, ?)';
        con.query(sql, [userId, animalId], (err, result) => {
            if (err) throw err;
        });
    },

    removerFavorito: (userId, animalId) => {
        const sql = 'DELETE FROM tb_favorito WHERE fk_usuario = ? AND fk_animal = ?';
        con.query(sql, [userId, animalId], (err, result) => {
            if (err) throw err;
        });
    },

    removerTodosFavorito: (userId) => {
        const sql = 'DELETE FROM tb_favorito WHERE fk_usuario = ?';
        con.query(sql, [userId], (err, result) => {
            if (err) throw err;
        });
    }

}