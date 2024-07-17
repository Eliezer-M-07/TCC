const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require('bcrypt');
var formidable = require('formidable');

const modelanimais = require("../model/animais");

module.exports = {

    listagem: function (req, res) {
        const { estado, especie, sexo } = req.query;

        let buscaDados = modelanimais.buscaTodos({ estado, especie, sexo });

        buscaDados
            .then(results => {
                res.render('adocao', { all: results, logado: req.session.loggedin, alerta: '' });
            })
            .catch(err => {
                if (err) throw err;
            });
    },

    dados: function(req, res){
        var id = req.params.id;
        modelanimais.buscaDados(id).then(result=> {''
            res.render('dados_animal', {informacoes: result, logado: req.session.loggedin, alerta: '' })
        })
        .catch(err => {
            if (err) throw err;
        });
    },


    cadastrar: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {

            var oldpath = files.foto[0].filepath;
            var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

            var ext = path.extname(files.foto[0].originalFilename)
            var nomefoto = hash + ext
            var newpath = path.join(__dirname, '../public/animais/', nomefoto);

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
            });

            modelanimais.inserir_adocao(
                req.session.Id,
                'adocao',
                fields['estado'][0],
                fields['nome'][0],
                fields['especie'][0],
                fields['raca'][0],
                fields['sexo'][0],
                fields['porte'][0],
                fields['peso'][0],
                fields['personalidade'][0],
                nomefoto
            );

        });

        res.redirect('/perfil');
    },


    deletar: function (req, res) {
        if (req.session.loggedin) {

            var id = req.params.id;
            modelanimais.busca(id).then(result => {
                const animal = result[0];

                if (animal.fk_ani === req.session.Id) {
                    const img = path.join(__dirname, '../public/animais/', animal.foto);
                    fs.unlink(img, (err) => {
                        if (err) console.error(err);
                    });

                    modelanimais.deletar(id);

                    res.redirect('/perfil');
                }else{
                    res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin });
                }
            });
            
        } else {
            res.render('login', { alerta: 'Esta ação não é possivel estando deslogado.', logado: req.session.loggedin })
        }
    },


    editar: function (req, res) {
        if (req.session.loggedin) {
            id = req.params.id
            modelanimais.busca(id).then(result => res.render('editar_animal', { dadosAnimal: result, alerta: '', logado: req.session.loggedin })).catch(err => console.error(err));
        } else {
            res.render('login', { alerta: 'É precisa fazer login para editar um animal.', logado: req.session.loggedin })
        }

    },




}

