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
            if (req.session.admin == false){

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
                    buscaDados,
                    modelusuario.buscaNotificacoes(req.session.Id)
                ])
                .then(results => {
                    const Usuario = results[0];
                    const Adocao = results[1];
                    const notificacoes = results[2];
                    
                    res.render('perfil', { dadosUsuario: Usuario, dadosAdocao: Adocao, alerta: '', logado: req.session.loggedin, admin: req.session.admin , Notificacoes: notificacoes});
                })
                .catch(error => {
                    if (error) throw error;
                });
            }else{
                res.redirect('/gerenciamento');
            }
        } else {
            res.render('login', { alerta: 'Faça login para acessar a página.', logado: req.session.loggedin, admin: req.session.admin, email: "" });
            return;
        }
    },
    

    logar: function (req, res) {
        var senha = req.body['senha'];
        var email = req.body['email'];
        var sql = "SELECT * FROM tb_usuario WHERE email = ?";
        var sql2 = "SELECT * FROM tb_admin WHERE email = ?";
    
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

                        res.redirect('/')

                    } else {
                        res.render('login', { alerta: "Senha inválida", logado: req.session.loggedin, admin: req.session.admin, email: email });
                    }
                });
            } else {
                con.query(sql2, [email], function (err, result) {
                    if (err) throw err;
    
                    if (result.length) {
                        bcrypt.compare(senha, result[0]['senha'], function (err, resultado) {
                            if (err) throw err;
                            
                            if (resultado) {
                                req.session.loggedin = true;
                                req.session.admin = true;

                                res.redirect('/gerenciamento');
                            
                            } else {
                                res.render('login', { alerta: "Senha inválida", logado: req.session.loggedin, admin: req.session.admin, email: email});
                            }
                        
                        });
                    } else {
                        res.render('login', { alerta: "E-mail não cadastrado ou foi digitado incorretamente.", logado: req.session.loggedin, admin: req.session.admin , email: email});
                    }
                });
            }
        });
    },
    

    cadastrar: function (req, res) {

        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) throw err;
    
            var sql = "SELECT * FROM tb_usuario where email = ?";
    
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
                                res.render('login', { alerta: 'Usuário cadastrado com sucesso, faça login.', logado: req.session.loggedin, admin: req.session.admin, email: fields['email'][0] });
                            });
                        });
                }
            });
        });

    },

    deletar: function (req, res) {
        var id = req.params.id;
        if (req.session.loggedin) {
            if (id == req.session.Id) {

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
                Promise.all([
                    modelusuario.buscaNotificacoes(req.session.Id),
                ])
                .then(results => {
                    const notificacoes = results[0];
                    res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome, Notificacoes: notificacoes })
                });
            }

        } else {
            res.render('login', { alerta: 'Faça login para deletar.', logado: req.session.loggedin, admin: req.session.admin, email: ""})
        }
    },

    editar: function (req, res) {
        if (req.session.loggedin) {
            Promise.all([
                modelusuario.busca(req.session.Id),
                modelusuario.buscaNotificacoes(req.session.Id),

            ]).then(results => {
                const result = results[0];
                const notificacoes = results[1];
                res.render('editar_perfil', { dadosUsuario: result, alerta: '', logado: req.session.loggedin, admin: req.session.admin, Notificacoes: notificacoes});
            })
            .catch(error => {
                if (error) throw error;
            });
        } else {
            res.render('login', { alerta: 'É preciso fazer login para editar.', logado: req.session.loggedin, admin: req.session.admin, email: ""})
        }

    },

    alterar: function (req, res) {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            const novoNome = fields['nome'][0];

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

            req.session.nome = novoNome;
            res.redirect('/perfil')
        });

        
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
                Promise.all([
                    modelusuario.buscaNotificacoes(req.session.Id)
                ]).then(results => {
                    const notificacoes = results[0];
                    res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome, Notificacoes: notificacoes })
                })
                .catch(error => {
                    if (error) throw error;
                });
            }

        }else{
            res.render('login', { alerta: 'Faça login para acessar a página.', logado: req.session.loggedin, admin: req.session.admin, email: ""}) 
        }
    },


    marcarLidas: function(req, res){
        if(req.session.loggedin){
            modelusuario.excluirNotificacoes2(req.session.Id);
            const previousPage = req.get('Referer');
            res.redirect(previousPage);
        }else{
            res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome})
        }

    },

    favoritos: function (req, res) {
        if (req.session.loggedin) {
            if (req.session.admin == false){
                
                Promise.all([
                    modelusuario.busca(req.session.Id),
                    modelusuario.buscaFav(req.session.Id),
                    modelusuario.buscaNotificacoes(req.session.Id)
    
                ])
                .then(results => {
                    const Usuario = results[0];
                    const favoritos = results[1];
                    const notificacoes = results[2];
                    
                    res.render('favoritos', { dadosUsuario: Usuario, animaisFav: favoritos, alerta: '', logado: req.session.loggedin, admin: req.session.admin , Notificacoes: notificacoes});
                })
                .catch(error => {
                    if (error) throw error;
                });
            }else{
                res.redirect('/gerenciamento');
            }
        } else {
            res.render('login', { alerta: 'Faça login para acessar a página.', logado: req.session.loggedin, admin: req.session.admin, email: "" });
            return;
        }
    },
    
}



