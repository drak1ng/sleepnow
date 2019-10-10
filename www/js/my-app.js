// Initialize app
var app = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = app.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    var id_usuarios = window.localStorage.getItem('id_usuarios');

    $$('#bt-lateral-sair').on('click', function (e) {
        window.localStorage.setItem('id_usuarios','');
        app.closePanel();
        mainView.router.loadPage("login.html");
    });

    console.log("Device is ready!");
    console.log("Id user: "+id_usuarios);

    if(id_usuarios=="" || id_usuarios==null){
        mainView.router.loadPage("login.html");
    }


    
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
app.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    console.log(page.name);

    // Script Tela - Login Manual
    if(page.name=="login"){
        $$('.login-bt-google').on('click', function (e) {
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.loadPage("index.html");
        });
        $$('.login-bt-facebook').on('click', function (e) {
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.loadPage("index.html");
        });
    }

    // Script Tela - Login Manual
    if(page.name=="login-cadastro"){
        $$('#bt-login-acessar').on('click', function (e) {
            var email = $$('#login-email').val();
            var senha = $$('#login-senha').val();
            if(email=="" || senha==""){
                app.alert("Os campos E-mail e Senha devem ser preenchidos!","Aviso");
                return false;
            }
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.loadPage("index.html");
        });
    }

    // Script Tela - Login Cadastro
    if(page.name=="login-cadastro-ficha"){
        $$('#login-cadastro-ficha-bt-continuar').on('click', function (e) {
            var nome = $$('#login-cadastro-ficha-nome').val();
            var celular = $$('#login-cadastro-ficha-celular').val();
            var email = $$('#login-cadastro-ficha-email').val();
            var senha = $$('#login-cadastro-ficha-senha').val();
            if(nome==""){
                app.alert("O campo NOME deve ser preenchido!","Aviso");
                return false;
            }
            if(celular==""){
                app.alert("O campo CELULAR deve ser preenchido!","Aviso");
                return false;
            }
            if(email==""){
                app.alert("O campo E-MAIL deve ser preenchido!","Aviso");
                return false;
            }
            if(senha==""){
                app.alert("O campo SENHA deve ser preenchido!","Aviso");
                return false;
            }
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.loadPage("index.html");
        });
    }

    // Script Tela - Esqueci minha senha
    if(page.name=="login-cadastro-esqueci"){
        $$('#bt-recuperar-senha').on('click', function (e) {
            var email = $$('#recuperar-senha-email').val();
            if(email==""){
                app.alert("Você deve informar um e-mail válido!","Aviso");
                return false;
            }
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.loadPage("login-esqueci-senha-obrigado.html");
        });
    }

})