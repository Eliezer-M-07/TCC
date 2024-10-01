const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); 
const crypto = require('crypto');
const bcrypt = require('bcrypt');
var formidable = require('formidable');

const modelanimais = require("../model/animais");
const modelusuario = require("../model/usuarios");

module.exports = {

    listagem_adocao: function (req, res) {
        const { estado, cidade, especie, sexo } = req.query;

        Promise.all([
            modelanimais.buscaTodosAdocao({ estado, cidade, especie, sexo }),
            modelusuario.buscaNotificacoes(req.session.Id),

        ]).then(results => {
            const buscaDados = results[0];
            const notificacoes = results[1];

            res.render('adocao', { all: buscaDados, logado: req.session.loggedin, alerta: '' , admin: req.session.admin, Notificacoes: notificacoes});
        })
        .catch(error => {
            if (error) throw error;
        });
        
    },

    listagem_desaparecidos: function (req, res) {
        const { estado, cidade, especie, sexo } = req.query;

        Promise.all([
            modelanimais.buscaTodosDesaparecidos({ estado, cidade, especie, sexo }),
            modelusuario.buscaNotificacoes(req.session.Id),

        ]).then(results => {
            const buscaDados = results[0];
            const notificacoes = results[1];
            
            res.render('desaparecidos', { all: buscaDados, logado: req.session.loggedin, alerta: '' , admin: req.session.admin, Notificacoes: notificacoes});
        })
        .catch(error => {
            if (error) throw error;
        });

    },

    listagem_encontrados: function (req, res) {
        const { estado, cidade, especie, sexo } = req.query;

        Promise.all([
            modelanimais.buscaTodosEncontrados({ estado, cidade, especie, sexo }),
            modelusuario.buscaNotificacoes(req.session.Id),

        ]).then(results => {
            const buscaDados = results[0];
            const notificacoes = results[1];
            res.render('encontrados', { all: buscaDados, logado: req.session.loggedin, alerta: '' , admin: req.session.admin, Notificacoes: notificacoes});

        })
        .catch(error => {
            if (error) throw error;
        });


    },

    dados: function(req, res){
        var id = req.params.id;
        Promise.all([
            modelanimais.buscaDados(id),
            modelusuario.buscaNotificacoes(req.session.Id),

        ]).then(results => {
            const result = results[0];
            const notificacoes = results[1];

            res.render('dados_animal', {informacoes: result, logado: req.session.loggedin, alerta: '' , admin: req.session.admin, Notificacoes: notificacoes})
        })
        .catch(err => {
            if (err) throw err;
        });
    },


    cadastrar_adocao: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {

            var oldpath = files.foto[0].filepath;
            var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

            var ext = path.extname(files.foto[0].originalFilename)
            var nomefoto = hash + ext
            var newpath = path.join(__dirname, '../public/animais/', nomefoto);

            sharp(oldpath)
                .resize({ width: 250, height: 250, fit: 'cover' }) 
                .toFile(newpath, (err, info) => {
                    if (err) throw err;

                    modelanimais.inserir_adocao(
                        req.session.Id,
                        'adocao',
                        fields['estado'][0],
                        fields['cidade'][0],
                        fields['nome'][0],
                        fields['especie'][0],
                        fields['raca'][0],
                        fields['sexo'][0],
                        fields['porte'][0],
                        fields['peso'][0],
                        fields['personalidade'][0],
                        nomefoto,
                        'Pendente'
                    );
                });

        });

        res.redirect('/perfil');
    },

    cadastrar_desaparecido: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {

            var oldpath = files.foto[0].filepath;
            var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

            var ext = path.extname(files.foto[0].originalFilename)
            var nomefoto = hash + ext
            var newpath = path.join(__dirname, '../public/animais/', nomefoto);

            sharp(oldpath)
                .resize({ width: 250, height: 250, fit: 'cover' }) 
                .toFile(newpath, (err, info) => {
                    if (err) throw err;

                    modelanimais.inserir_desaparecido(
                        req.session.Id,
                        'desaparecido',
                        fields['estado'][0],
                        fields['cidade'][0],
                        fields['bairro'][0],
                        fields['rua'][0],
                        fields['nome'][0],
                        fields['especie'][0],
                        fields['raca'][0],
                        fields['sexo'][0],
                        fields['porte'][0],
                        fields['data'][0],
                        fields['caracteristicas'][0],
                        nomefoto,
                        'Pendente'
                    );
                });

        });

        res.redirect('/perfil');
    },

    cadastrar_encontrado: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {

            var oldpath = files.foto[0].filepath;
            var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

            var ext = path.extname(files.foto[0].originalFilename)
            var nomefoto = hash + ext
            var newpath = path.join(__dirname, '../public/animais/', nomefoto);

            sharp(oldpath)
                .resize({ width: 250, height: 250, fit: 'cover' }) 
                .toFile(newpath, (err, info) => {
                    if (err) throw err;

                    modelanimais.inserir_encontrado(
                        req.session.Id,
                        'encontrado',
                        fields['estado'][0],
                        fields['cidade'][0],
                        fields['bairro'][0],
                        fields['rua'][0],
                        fields['nome'][0],
                        fields['especie'][0],
                        fields['raca'][0],
                        fields['sexo'][0],
                        fields['porte'][0],
                        nomefoto,
                        'Pendente'
                    );
                });

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
                    
                    modelusuario.buscaNotificacoes(req.session.Id).then(result =>{
                        if(result.length > 0){
                            modelusuario.excluirNotificacoes(id);
                            modelanimais.deletar(id);
                            res.redirect('/perfil');
                        }else{

                            modelanimais.deletar(id);
                            res.redirect('/perfil');
                        }
                    });

                }else if(req.session.admin == true){
                    const img = path.join(__dirname, '../public/animais/', animal.foto);
                    fs.unlink(img, (err) => {
                        if (err) console.error(err);
                    });

                    modelusuario.buscaNotificacoes(req.session.Id).then(result =>{
                        if(result.length > 0){
                            modelusuario.excluirNotificacoes(id);
                            modelanimais.deletar(id);
                            res.redirect('/gerenciamento?tipo=animais');
                        }else{

                            modelanimais.deletar(id);
                            res.redirect('/gerenciamento?tipo=animais');
                        }
                    });
                    

                    

                }else{
                    res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome});
                }
            });
            
        } else {
            res.render('login', { alerta: 'Esta ação não é possivel sem estar logado.', logado: req.session.loggedin , admin: req.session.admin})
        }
    },


    editar_adocao: function (req, res) {
        if (req.session.loggedin) {
            if(req.session.admin == false){
                id = req.params.id
                Promise.all([
                    modelanimais.buscaDados(id),
                    modelusuario.buscaNotificacoes(req.session.Id),
        
                ]).then(results => {
                    const result = results[0];
                    const notificacoes = results[1];
                
                    res.render('editar_adocao', { dadosAnimal: result, alerta: '', logado: req.session.loggedin , admin: req.session.admin, Notificacoes: notificacoes});
                }).catch(err => {
                    if (err) throw err;
                });
            }else{
                res.redirect('/gerenciamento');
            }
        } else {
            res.render('login', { alerta: 'É precisa fazer login para editar um animal.', logado: req.session.loggedin, admin: req.session.admin })
        }

    },

    editar_desaparecido: function (req, res) {
        if (req.session.loggedin) {
            if(req.session.admin == false){
                id = req.params.id
                Promise.all([
                    modelanimais.buscaDados(id),
                    modelusuario.buscaNotificacoes(req.session.Id),
        
                ]).then(results => {
                    const result = results[0];
                    const notificacoes = results[1];
                    res.render('editar_desaparecido', { dadosAnimal: result, alerta: '', logado: req.session.loggedin , admin: req.session.admin, Notificacoes: notificacoes});

                }).catch(err => {
                    if (err) throw err;
                });
            }else{
                res.redirect('/gerenciamento');            
            }
        } else {
            res.render('login', { alerta: 'É precisa fazer login para editar um animal.', logado: req.session.loggedin, admin: req.session.admin })
        }

    },

    alterarAdocao: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (files.foto) {
                modelanimais.busca(fields['id'][0])
                    .then(result => {
                        var img = path.join(__dirname, '../public/animais/', result[0]['foto']);
                        fs.unlink(img, (err) => {
                            if (err) console.error(err);
                        });
                    })
                    .catch(err => console.error(err));
    
                var oldpath = files.foto[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                var ext = path.extname(files.foto[0].originalFilename);
                var nomeimg = hash + ext;
                var newpath = path.join(__dirname, '../public/animais/', nomeimg);
    

                sharp(oldpath)
                    .resize({ width: 280, height: 280, fit: 'cover' }) 
                    .toFile(newpath, (err, info) => {
                        if (err) throw err;
    
                        modelanimais.updateAdocao(
                            fields['nome'][0],
                            fields['especie'][0],
                            fields['raca'][0],
                            fields['sexo'][0],
                            fields['porte'][0],
                            fields['peso'][0],
                            fields['estado'][0],
                            fields['cidade'][0],
                            fields['personalidade'][0],
                            nomeimg,
                            fields['id'][0]
                        );
                    });
            } else {
                modelanimais.updateAdocaoSemFoto(
                    fields['nome'][0],
                    fields['especie'][0],
                    fields['raca'][0],
                    fields['sexo'][0],
                    fields['porte'][0],
                    fields['peso'][0],
                    fields['estado'][0],
                    fields['cidade'][0],
                    fields['personalidade'][0],
                    fields['id'][0]
                );
            }
        });
        res.redirect('/perfil')

    },

    alterarDesaparecido: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (files.foto) {
                modelanimais.busca(fields['id'][0])
                    .then(result => {
                        var img = path.join(__dirname, '../public/animais/', result[0]['foto']);
                        fs.unlink(img, (err) => {
                            if (err) console.error(err);
                        });
                    })
                    .catch(err => console.error(err));
    
                var oldpath = files.foto[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                var ext = path.extname(files.foto[0].originalFilename);
                var nomeimg = hash + ext;
                var newpath = path.join(__dirname, '../public/animais/', nomeimg);
    

                sharp(oldpath)
                    .resize({ width: 280, height: 280, fit: 'cover' }) 
                    .toFile(newpath, (err, info) => {
                        if (err) throw err;
    
                        modelanimais.updateDesaparecido(
                            fields['nome'][0],
                            fields['especie'][0],
                            fields['raca'][0],
                            fields['sexo'][0],
                            fields['porte'][0],
                            fields['estado'][0],
                            fields['cidade'][0],
                            fields['bairro'][0],
                            fields['rua'][0],
                            fields['data'][0],
                            fields['caracteristicas'][0],
                            nomeimg,
                            fields['id'][0]
                        );
                    });
            } else {
                modelanimais.updateDesaparecidoSemFoto(
                            fields['nome'][0],
                            fields['especie'][0],
                            fields['raca'][0],
                            fields['sexo'][0],
                            fields['porte'][0],
                            fields['estado'][0],
                            fields['cidade'][0],
                            fields['bairro'][0],
                            fields['rua'][0],
                            fields['data'][0],
                            fields['caracteristicas'][0],
                            fields['id'][0]
                );
            }
        });
        
        res.redirect('/perfil')

    },

    aprovar:  function (req, res) {
        if(req.session.loggedin && req.session.admin == true){
            var id = req.params.id;
            var id_usuario = req.query.id_usuario;

            modelusuario.notificacao(id_usuario, id, 'Aprovado', 'Seu animal foi aceito na plataforma!');
            modelanimais.aprovar(id);

            res.redirect('/gerenciamento')
        }else{
            res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome});
        }
    },

    recusar:  function (req, res) {
        if(req.session.loggedin && req.session.admin == true){
            var id = req.params.id;
            var id_usuario = req.query.id_usuario;

            modelusuario.notificacao(id_usuario, id,  'Recusado', 'Seu animal foi recusado.');
            modelanimais.recusar(id);

            res.redirect('/gerenciamento')
        }else{
            res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome});
        }
    },


}

