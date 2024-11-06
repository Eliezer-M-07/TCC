const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); 
const crypto = require('crypto');
const bcrypt = require('bcrypt');
var formidable = require('formidable');
const pdf = require('pdfkit')


const modelanimais = require("../model/animais");
const modelusuario = require("../model/usuarios");

module.exports = {

    listagem_adocao: function (req, res) {
        const { estado, cidade, especie, sexo } = req.query;
    
        Promise.all([
            modelanimais.buscaTodosAdocao({ estado, cidade, especie, sexo }),
            modelusuario.buscaNotificacoes(req.session.Id),
            modelusuario.buscaFavoritos(req.session.Id) 
        ]).then(results => {
            
            const buscaDados = results[0];
            const notificacoes = results[1];
            const favoritos = results[2] || []; 
    
            buscaDados.forEach(animal => {
                animal.favoritado = favoritos.includes(animal.id);
            });
            
            
            res.render('adocao', { all: buscaDados, logado: req.session.loggedin, alerta: '', admin: req.session.admin, Notificacoes: notificacoes, id: req.session.Id });
        })
        .catch(error => {
            console.error("Erro:", error);
            throw error;
        });
    },
    
    
    

    listagem_desaparecidos: function (req, res) {
        const { estado, cidade, especie, sexo } = req.query;

        Promise.all([
            modelanimais.buscaTodosDesaparecidos({ estado, cidade, especie, sexo }),
            modelusuario.buscaNotificacoes(req.session.Id),
            modelusuario.buscaFavoritos(req.session.Id)

        ]).then(results => {
            const buscaDados = results[0];
            const notificacoes = results[1];
            const favoritos = results[2] || [];

            buscaDados.forEach(animal => {
                animal.favoritado = favoritos.includes(animal.id);
            });
            
            
            res.render('desaparecidos', { all: buscaDados, logado: req.session.loggedin, alerta: '' , admin: req.session.admin, Notificacoes: notificacoes, id: req.session.Id});
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
            modelusuario.buscaFavoritos(req.session.Id)


        ]).then(results => {
            const buscaDados = results[0];
            const notificacoes = results[1];
            const favoritos = results[2] || [];

            buscaDados.forEach(animal => {
                animal.favoritado = favoritos.includes(animal.id);
            });

            res.render('encontrados', { all: buscaDados, logado: req.session.loggedin, alerta: '' , admin: req.session.admin, Notificacoes: notificacoes, id: req.session.Id});

        })
        .catch(error => {
            if (error) throw error;
        });


    },

    dados: function(req, res){
        var id = req.params.id;
        modelanimais.busca(id).then(result => {
            if(result.length > 0 ){
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
            }else{
                res.redirect('/')
            }
        })
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
                        fields['caracteristicas'],
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
            var id_usuario = req.query.id_usuario;

            modelanimais.busca(id).then(result => {
                const animal = result[0];

                if (animal.fk_usuario === req.session.Id) {
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

                    modelusuario.buscaNotificacoes(id_usuario).then(result =>{
                        if(result.length > 0){
                            modelusuario.excluirNotificacoes(id);
                            modelusuario.notificacao_exclusao(id_usuario, "Excluido", "Seu animal " + animal.nome + " foi excluido pelo administrador.");
                            modelanimais.deletar(id);
                            
                        }else{
                            modelusuario.notificacao_exclusao(id_usuario, "Excluido", "Seu animal " + animal.nome + " foi excluido pelo administrador.");
                            modelanimais.deletar(id);
                        }
                    });

                    res.redirect('/gerenciamento?tipo=animais');

                    

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
    

                    if (result.length > 0 && result[0]['fk_usuario'] === req.session.Id) {
                        res.render('editar_adocao', { dadosAnimal: result, alerta: '', logado: req.session.loggedin , admin: req.session.admin, Notificacoes: notificacoes});
                    }else{
                        res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome, Notificacoes: notificacoes});
                    }
                    
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
    

                    if (result.length > 0 && result[0]['fk_usuario'] === req.session.Id) {
                        res.render('editar_desaparecido', { dadosAnimal: result, alerta: '', logado: req.session.loggedin , admin: req.session.admin, Notificacoes: notificacoes});
                    }else{
                        res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome, Notificacoes: notificacoes});
                    }
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

    editar_encontrado: function (req, res) {
        if (req.session.loggedin) {
            if(req.session.admin == false){
                id = req.params.id
                Promise.all([
                    modelanimais.buscaDados(id),
                    modelusuario.buscaNotificacoes(req.session.Id),
                    
        
                ]).then(results => {
                    const result = results[0];
                    const notificacoes = results[1];
    

                    if (result.length > 0 && result[0]['fk_usuario'] === req.session.Id) {
                        res.render('editar_encontrado', { dadosAnimal: result, alerta: '', logado: req.session.loggedin , admin: req.session.admin, Notificacoes: notificacoes});
                    }else{
                        res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome, Notificacoes: notificacoes});
                    }
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

    alterarEncontrado: function (req, res) {
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
    
                        modelanimais.updateEncontrado(
                            fields['nome'][0],
                            fields['especie'][0],
                            fields['raca'][0],
                            fields['sexo'][0],
                            fields['porte'][0],
                            fields['estado'][0],
                            fields['cidade'][0],
                            fields['bairro'][0],
                            fields['rua'][0],
                            nomeimg,
                            fields['id'][0]
                        );
                    });
            } else {
                modelanimais.updateEncontradoSemFoto(
                            fields['nome'][0],
                            fields['especie'][0],
                            fields['raca'][0],
                            fields['sexo'][0],
                            fields['porte'][0],
                            fields['estado'][0],
                            fields['cidade'][0],
                            fields['bairro'][0],
                            fields['rua'][0],
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

            modelusuario.notificacao(id_usuario, id,  'Recusado', 'Seu animal não foi aceito na plataforma.');
            modelanimais.recusar(id);

            res.redirect('/gerenciamento')
        }else{
            res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin , admin: req.session.admin, nome: req.session.nome});
        }
    },

    gerarCartaz: function(req, res) {
        if (req.session.loggedin) {
            var id = req.params.id;
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            function formatarNumeroTelefone(numero) {
                let numeroLocal = numero.substring(2);
                let ddd = numeroLocal.substring(0, 2);
                let telefone = numeroLocal.substring(2);
                return `(${ddd}) ${telefone.substring(0, 5)}-${telefone.substring(5)}`;
            }
            modelusuario.busca(req.session.Id)
            .then(result => {
                modelanimais.busca(id).then(result2 => {
    
                    const doc = new pdf({ size: 'A4' });
                    const arquivo = `public/cartaz${randomNum}.pdf`;
                    const caminhoArquivo = path.join(__dirname, '../', arquivo); 
                    const stream = fs.createWriteStream(caminhoArquivo);
    
                    doc.pipe(stream);
    
                    doc.fillColor('#f0f0f0');
                    doc.rect(0, 0, doc.page.width, doc.page.height).fill();
    
                    const logo = path.join(__dirname, '../public/images/logo.png');
                    doc.image(logo, 30, 15, { width: 120 });
                    doc.moveDown(2);
    
                    const procuraSeY = doc.y;
                    doc.fillColor('black').fontSize(35).text('PROCURA-SE', { align: 'center' });
                    doc.moveDown(1);
    
                    const procuraSeWidth = doc.widthOfString('PROCURA-SE', { width: doc.page.width });
                    const lineY = procuraSeY + 25;
                    doc.strokeColor('black').lineWidth(2).moveTo((doc.page.width - procuraSeWidth) / 2, lineY).lineTo((doc.page.width + procuraSeWidth) / 2, lineY).stroke();
    
                    const imgPath = path.join(__dirname, '../public/animais/', result2[0]['foto']);
                    const imgX = (doc.page.width - 250) / 2;
    
                    doc.save();
                    doc.rect(imgX - 5, doc.y - 5, 260, 260)
                        .strokeColor('black')
                        .lineWidth(2)
                        .stroke();
                    doc.restore();
    
                    doc.image(imgPath, imgX, doc.y, { fit: [250, 250] });
    
                    doc.moveDown(8);
    
                    doc.fillColor('black').fontSize(25).text(result2[0]['nome']);
                    doc.moveDown(1);
                    doc.fillColor('black').fontSize(12).text(result2[0]['caracteristicas']);
                    doc.moveDown(1);
                    doc.fillColor('black').fontSize(12).text('Raça - ' + result2[0]['raca']);
                    doc.fillColor('black').fontSize(12).text('Sexo - ' + result2[0]['sexo']);
                    doc.fillColor('black').fontSize(12).text('Data de desaparecimento - ' + new Date(result2[0]['data']).toLocaleDateString('pt-BR'));
    
                    doc.moveDown(1);
                    var tel = result[0]['telefone'];
                    const telFormatado = formatarNumeroTelefone(tel);
                    const texto = `Você viu esse animal? Se sim, ajude a retorná-lo ao seu lar, entre em contato com o dono.`;
                    doc.fillColor('black').fontSize(13).text(texto, { align: 'justify' });
                    doc.moveDown(3);
                    doc.fillColor('black').fontSize(40).text(telFormatado, { align: 'center' });
    
                    doc.end();
    
                    stream.on('finish', () => {
                        
                        res.download(caminhoArquivo, (err) => {
                            if (err) {
                                console.error(err);
                            } else {
                                
                                fs.unlink(caminhoArquivo, (err) => {
                                    if (err) {
                                        console.error('Erro ao deletar o arquivo: ', err);
                                    } 
                                });
                            }
                        });
                    });
    
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
    
        } else {
            res.render('home', { alerta: 'Esta ação não é possivel.', logado: req.session.loggedin, admin: req.session.admin, nome: req.session.nome });
        }
    },

    favoritar: function(req, res){
        const animalId = req.params.id;
        const userId = req.session.Id;
        modelanimais.adicionarFavorito(userId, animalId);
        const previousPage = req.get('Referer');
        res.redirect(previousPage);
        
    },
    
    desfavoritar: function(req, res){
        const animalId = req.params.id;
        const userId = req.session.Id;
        modelanimais.removerFavorito(userId, animalId);
        const previousPage = req.get('Referer');
        res.redirect(previousPage);
        
    },
    
    

}

