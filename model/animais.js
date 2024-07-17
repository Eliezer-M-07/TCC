con = require("../config/db.js").pool;


module.exports = {


    buscaTodos: function (filters) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM animais WHERE status = 'adocao'";
            let queryParams = [];

            if (filters.estado) {
                sql += " AND estado = ?";
                queryParams.push(filters.estado);
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


    inserir_adocao(fk_ani, status, estado, nome, especie, raca, sexo, porte, peso, caracteristicas, foto) {
        var sql = "INSERT INTO animais (fk_ani, status, estado, nome, especie, raca, sexo, porte, peso, caracteristicas, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [fk_ani, status, estado, nome, especie, raca, sexo, porte, peso, caracteristicas, foto];
    
        con.query(sql, values, function (err, result) {
            if (err) throw err;
            console.log("Registro inserido com sucesso!");
        });
    },
    
    


    update(estado, nome, especie, raca, sexo, porte, peso, personalidade, foto, id) {
        var sql = "UPDATE animais SET estado = ?, especie = ?, raca = ?, sexo = ?, porte = ?, peso = ?, personalidade = ?, foto = ? WHERE id = ?";
        var values = [
            [estado], [nome], [especie], [raca], [sexo], [porte], [peso], [personalidade], [foto], [id]];
        con.query(sql, values, function (err, result) {
            if (err) throw err;
        });
    },


    updateSemFoto(estado, nome, especie, raca, sexo, porte, peso, personalidade, id) {
        var sql = "UPDATE animais SET estado = ?, especie = ?, raca = ?, sexo = ?, porte = ?, peso = ?, personalidade = ? WHERE id = ?";
        var values = [
            [estado], [nome], [especie], [raca], [sexo], [porte], [peso], [personalidade], [id]];
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







}