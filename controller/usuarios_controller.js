const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); 
const crypto = require('crypto');
const bcrypt = require('bcrypt');
var formidable = require('formidable');

const modelusuario = require("../model/usuarios");
const modelanimal = require("../model/animais");

module.exports = {

    dados: function (req, res) {
        if (req.session.loggedin) {
            const filtro = req.query.filtro;
    
            let buscaDados;
    
            if (filtro === 'adocao') {
                buscaDados = modelanimal.buscaAdocao(req.session.Id); 
            } else if (filtro === 'desaparecidos') {
                buscaDados = modelanimal.buscaDesaparecidos(req.session.Id);
            } else if (filtro === 'encontrados') {
                buscaDados = modelanimal.buscaEncontrados(req.session.Id); 
            } else {
                buscaDados = modelanimal.busca2(req.session.Id); 
            }
    
            Promise.all([
                modelusuario.busca(req.session.Id),
                buscaDados
            ])
                .then(results => {
                    const Usuario = results[0];
                    const Adocao = results[1];
    
                    res.render('perfil', { dadosUsuario: Usuario, dadosAdocao: Adocao, alerta: '', logado: req.session.loggedin, admin: req.session.admin });
                })
                .catch(error => {
                    if (error) throw error;
                });
    
        } else {
            res.render('login', { alerta: 'Faça login para acessar a página.', logado: req.session.loggedin, admin: req.session.admin });
            return;
        }
    },
    

    logar: function (req, res) {
        var senha = req.body['senha'];
        var email = req.body['email'];
        var sql = "SELECT * FROM usuarios WHERE email = ?";
        var sql2 = "SELECT * FROM admin WHERE email = ?";
    
        con.query(sql, [email], function (err, result) {
            if (err) throw err;
    
            if (result.length) {
                bcrypt.compare(senha, result[0]['senha'], function (err, resultado) {
                    if (err) throw err;
                    if (resultado) {
                        req.session.Id = result[0]['id'];
                        req.session.nome = result[0]['nome'];
                        req.session.loggedin = true;
                        req.session.admin = false;
    
                        res.render('home', { alerta: "Login realizado com sucesso.", logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome});
                    } else {
                        res.render('login', { alerta: "Senha inválida", logado: req.session.loggedin, admin: req.session.admin });
                    }
                });
            } else {
                con.query(sql2, [email], function (err, result) {
                    if (err) throw err;
    
                    if (result.length) {
                        if (err) throw err;
                        if (senha == result[0]['senha']) {
                            req.session.loggedin = true;
                            req.session.admin = true;
    
                            res.render('home', { alerta: "Administrador logado com sucesso.", logado: req.session.loggedin, admin: req.session.admin});
                        } else {
                            res.render('login', { alerta: "Senha inválida", logado: req.session.loggedin, admin: req.session.admin });
                        }
                        
                    } else {
                        res.render('login', { alerta: "E-mail não cadastrado ou foi digitado incorretamente.", logado: req.session.loggedin, admin: req.session.admin });
                    }
                });
            }
        });
    },
    

    cadastrar: function (req, res) {

        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) throw err;
    
            var sql = "SELECT * FROM usuarios where email = ?";
    
            con.query(sql, fields['email'][0], function (err, result) {
                if (err) throw err;
    
                if (result.length > 0) {
                    res.render('cadastro', { alerta: "E-mail já cadastrado.", logado: req.session.loggedin, admin: req.session.admin });
                    return;
                } else {
                    var oldpath = files.pfp[0].filepath;
                    var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                    var ext = path.extname(files.pfp[0].originalFilename);
                    var nomeimg = hash + ext;
                    var newpath = path.join(__dirname, '../public/usuarios/', nomeimg);
    
  
                    sharp(oldpath)
                        .resize({ width: 280, height: 280, fit: 'cover' }) 
                        .toFile(newpath, (err, info) => {
                            if (err) throw err;
    
                            const senha = fields['senha'][0];
                            const saltRounds = 10;
    
                            bcrypt.hash(senha, saltRounds, function (err, hash) {
                                if (err) throw err;
                                modelusuario.inserir(fields['nome'][0], fields['email'][0], hash, 55 + fields['telefone'][0], nomeimg);
                                res.render('login', { alerta: 'Usuário cadastrado com sucesso, faça login.', logado: req.session.loggedin, admin: req.session.admin });
                            });
                        });
                }
            });
        });

    },

    deletar: function (req, res) {
        if (req.session.loggedin) {

            if (req.params.id == req.session.Id) {
                var id = req.params.id;

                modelanimal.deletarComUser(id);

                modelusuario.busca(id)
                    .then(result => {
                        var img = path.join(__dirname, '../public/usuarios/', result[0]['pfp']);
                        fs.unlink(img, (err) => { });
                    })
                    .catch(err =>
                        console.error(err)
                    );

                
                modelusuario.deletar(id);

                req.session.destroy(function (err) {
                })
                res.redirect('/');

            }else if(req.session.admin == true){
                var id = req.params.id;

                modelanimal.deletarComUser(id);

                modelusuario.busca(id)
                    .then(result => {
                        var img = path.join(__dirname, '../public/usuarios/', result[0]['pfp']);
                        fs.unlink(img, (err) => { });
                    })
                    .catch(err =>
                        console.error(err)
                    );

                modelusuario.deletar(id);

                res.redirect('/gerenciamento?tipo=usuarios');


            }else{
                res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome })
            }

        } else {
            res.render('login', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin })
        }
    },

    editar: function (req, res) {
        if (req.session.loggedin) {
            modelusuario.busca(req.session.Id).then(result => res.render('editar_perfil', { dadosUsuario: result, alerta: '', logado: req.session.loggedin, admin: req.session.admin})).catch(err => console.error(err));
        } else {
            res.render('login', { alerta: 'É precisa fazer login para editar.', logado: req.session.loggedin, admin: req.session.admin })
        }


    },

    alterar: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            
            if (files.pfp) {
                modelusuario.busca(req.session.Id)
                    .then(result => {
                        var img = path.join(__dirname, '../public/usuarios/', result[0]['pfp']);
                        fs.unlink(img, (err) => {
                            if (err) console.error(err);
                        });
                    })
                    .catch(err => console.error(err));
    
                var oldpath = files.pfp[0].filepath;
                var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
                var ext = path.extname(files.pfp[0].originalFilename);
                var nomeimg = hash + ext;
                var newpath = path.join(__dirname, '../public/usuarios/', nomeimg);
    

                sharp(oldpath)
                    .resize({ width: 280, height: 280, fit: 'cover' }) 
                    .toFile(newpath, (err, info) => {
                        if (err) throw err;
                    });

                modelusuario.update(fields['nome'][0], 55 + fields['telefone'][0], nomeimg, req.session.Id);
                
            } else {
                modelusuario.updateSempfp(fields['nome'][0], 55 + fields['telefone'][0], req.session.Id);
            }
        });

        res.redirect('/perfil')
        return

    },


    all: function (req, res) {
        if (req.session.loggedin ) {
            if (req.session.admin == true){
                const tipo = req.query.tipo;
    
                let dados;
                let tipo2;
        
                if (tipo === 'usuarios') {
                    dados = modelusuario.todos(); 
                    tipo2 = "usuarios"
                } else if (tipo === 'animais') {
                    dados = modelanimal.todos();
                    tipo2 = "animais"
                } else {
                    dados = modelanimal.todos();
                    tipo2 = "validacao"
                }
            
                Promise.all([
                    dados
                ])
                    .then(result => {
                        res.render('gerenciamento', { dados: result[0], tipo: tipo2, logado: req.session.loggedin, admin: req.session.admin });

                    });

            }else{
                res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome })
            }

        }else{
            res.render('login', { alerta: 'faça login para acessar a página.', logado: req.session.loggedin, admin: req.session.admin }) 
        }
    },

    

    

}



