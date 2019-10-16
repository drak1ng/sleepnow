// Initialize app
var app = new Framework7({
    statusbar: {
      iosOverlaysWebView: true,
      iosBackgroundColor: '#7cdcfb',
      androidBackgroundColor: '#7cdcfb',
      iosTextColor: 'black',
      androidTextColor: 'black',
    },
  });

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = app.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    var app_usuario_id = window.localStorage.getItem('app_usuario_id');
    var app_usuario_nome = window.localStorage.getItem('app_usuario_nome');
    var app_usuario_imagem = window.localStorage.getItem('app_usuario_imagem');
    var app_usuario_email = window.localStorage.getItem('app_usuario_email');

    StatusBar.backgroundColorByName("white");
    StatusBar.overlaysWebView(true);
    StatusBar.show();

    $$('#bt-lateral-sair').on('click', function (e) {
        window.localStorage.setItem('app_usuario_id','');
        app.closePanel();
        mainView.router.loadPage("login.html");
    });

    console.log("Device is ready!");
    console.log("Id user: "+app_usuario_id);

    if(app_usuario_id=="" || app_usuario_id==null){
        mainView.router.loadPage("login.html");
    }else{
        $$(".lateral-usuario-info-nome").html(app_usuario_nome);
        $$(".lateral-usuario-info-email").html(app_usuario_email);
    }

    $$('#bt-scan-qrcode').on('click', function (e) {
        QRScanner.prepare(onDone);
    });
    
    function onDone(err, status){
        if(err){ app.alert(err); }
        if(status.authorized){
            app.alert("Parou Etapa 1!");
            QRscanner.show();
        }else if(status.denied){
            app.alert("Parou Etapa 2!");
            QRScanner.openSettings();
        }else{
            app.alert("Sem acesso a camera do celular!");
        }
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

    app.closePanel();

    // Script Tela - Login Manual
    if(page.name=="login"){

        $$('.login-bt-google').on('click', function (e) {
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.loadPage("index.html");
        });
        $$('.login-bt-facebook').on('click', function (e) {
            var fbLoginSuccess = function (userData) {
                console.log("UserInfo: ", userData);
                app.alert(userData);
                facebookConnectPlugin.getAccessToken(function(token){ console.log("Token: " + token); app.alert(token); });
            }

            facebookConnectPlugin.login(['public_profile','email'], fbLoginSuccess, function(error){ console.error(error) });

           
            //window.localStorage.setItem('id_usuarios','1');
            //mainView.router.loadPage("index.html");
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
            $$.post('http://capsulas4u.com.br/app_api/login.php', { email:email, senha:senha }, function (data) {
                console.log(data);

                if(data=="ERRO1"){
                    app.alert("E-mail ou Senha incorreta!","Aviso");
                    return false;
                }

                var retorno = data.split("#|#");

                window.localStorage.setItem('app_usuario_id',retorno[0]);
                window.localStorage.setItem('app_usuario_nome',retorno[1]);
                window.localStorage.setItem('app_usuario_imagem',retorno[2]);
                window.localStorage.setItem('app_usuario_email',retorno[3]);

                $$(".lateral-usuario-info-nome").html(retorno[1]);
                $$(".lateral-usuario-info-email").html(retorno[3]);

                mainView.router.loadPage("index.html");
            });
        });
    }

    // Script Tela - Login Cadastro
    if(page.name=="login-cadastro-ficha"){

        $('#login-cadastro-ficha-celular').mask('(00) 00000-0000');

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
            $$.post('http://capsulas4u.com.br/app_api/login-cadastro.php', { nome:nome, celular:celular, email:email, senha:senha }, function (data) {
                console.log(data);

                if(data=="ERRO1"){
                    app.alert("Esse e-mail já foi utilizado em outro cadastro!","Aviso");
                    return false;
                }

                var retorno = data.split("#|#");

                window.localStorage.setItem('app_usuario_id',retorno[0]);
                window.localStorage.setItem('app_usuario_nome',retorno[1]);
                window.localStorage.setItem('app_usuario_imagem',retorno[2]);
                window.localStorage.setItem('app_usuario_email',retorno[3]);

                $$(".lateral-usuario-info-nome").html(retorno[1]);
                $$(".lateral-usuario-info-email").html(retorno[3]);

                mainView.router.loadPage("index.html");

            });
            
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
            $$.post('http://capsulas4u.com.br/app_api/esqueci-minha-senha.php', { email:email }, function (data) {
                console.log(data);

                if(data=="ERRO1"){
                    app.alert("Não encontramos um cadastro com esse e-mail!","Aviso");
                    return false;
                }

                mainView.router.loadPage("login-esqueci-senha-obrigado.html");

            });
            
        });
    }

})