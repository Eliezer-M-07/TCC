const express = require('express');
var session = require('express-session');
const app = express();


app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true
}));

const usuarioController = require("./controller/usuarios_controller");
const animaisController = require("./controller/animais_controller");


app.get('/', function(req, res){
    if (req.session.loggedin) {
        res.render('home', {alerta: '', logado:req.session.loggedin, admin: req.session.admin, nome: req.session.nome})
        return;
    }
    else{
        res.render('home', {alerta: '', logado:req.session.loggedin, admin: req.session.admin})
        return;
    }
});

app.get('/login', function(req, res){
    if (req.session.loggedin) {
        res.render('home', {alerta:'Faça logout para realizar o login.', logado: req.session.loggedin, admin: req.session.admin});
        return;
    }
    else{
        res.render('login', {alerta:"", logado: req.session.loggedin, admin: req.session.admin})
        return;
    }
});

app.get('/cadastro', function(req, res){
    if (req.session.loggedin) {
        res.render('home', {alerta:'Faça logout para realizar o cadastro.', logado: req.session.loggedin, admin: req.session.admin});
        return;
    }
    else{
       res.render('cadastro',{alerta:'', logado: req.session.loggedin, admin: req.session.admin})
       return;
    }
})

app.get('/cadastrar_adocao', function(req, res){
    if (req.session.loggedin) {
        res.render('cadastro_adocao',{alerta:'', logado: req.session.loggedin, admin: req.session.admin})
        return;
    }
    else{
        res.render('login', {alerta:'Faça login para cadastrar algum animal.', logado: req.session.loggedin, admin: req.session.admin});
        return;
    }
})
app.get('/cadastrar_desaparecido', function(req, res){
    if (req.session.loggedin) {
        res.render('cadastro_desaparecidos',{alerta:'', logado: req.session.loggedin, admin: req.session.admin})
        return;
    }
    else{
        res.render('login', {alerta:'Faça login para cadastrar algum animal.', logado: req.session.loggedin, admin: req.session.admin});
        return;
    }
})

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
    })  
    res.redirect('/')
    return;
});



app.listen(3000,function(){
    console.log("Executando na porta 3000");
}); 


app.post('/login', usuarioController.logar);
app.get('/perfil', usuarioController.dados);
app.get('/editar_perfil', usuarioController.editar);
app.post('/editar', usuarioController.alterar);
app.get('/deletar/:id', usuarioController.deletar)
app.post('/cadastrar', usuarioController.cadastrar);

app.get('/gerenciamento', usuarioController.all)
app.get('/aprovar/:id', animaisController.aprovar)
app.get('/recusar/:id', animaisController.recusar)

app.get('/editar_adocao/:id', animaisController.editar_adocao);
app.post('/alterar_adocao', animaisController.alterarAdocao);
app.get('/editar_desaparecido/:id', animaisController.editar_desaparecido);
app.get('/deletar_animal/:id', animaisController.deletar);
app.post('/cadastrar_adocao', animaisController.cadastrar_adocao);
app.post('/cadastrar_desaparecido', animaisController.cadastrar_desaparecido);
app.get('/adotar', animaisController.listagem_adocao);
app.get('/desaparecidos', animaisController.listagem_desaparecidos);
app.get('/animal/:id',animaisController.dados)