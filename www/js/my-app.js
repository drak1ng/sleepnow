// Initialize app
var app = new Framework7({
    routes: [
        {
            path: '/',
            url: 'index.html',
        },{
            path: '/home/',
            url: 'home.html',
        },{
            path: '/login/',
            url: 'login.html',
        },{
            path: '/login-cadastro/',
            url: 'login-cadastro.html',
        },{
            path: '/login-cadastro-ficha/',
            url: 'login-cadastro-ficha.html',
        },{
            path: '/login-esqueci-senha/',
            url: 'login-esqueci-senha.html',
        },{
            path: '/login-esqueci-senha-obrigado/',
            url: 'login-esqueci-senha-obrigado.html',
        },{
            path: '/central-ajuda/',
            url: 'central-ajuda.html',
        },{
            path: '/historico-pagamento/',
            url: 'historico-pagamento.html',
        },{
            path: '/termos-uso/',
            url: 'termos-uso.html',
        },{
            path: '/minha-carteira/',
            url: 'minha-carteira.html',
        },{
            path: '/minha-carteira-novo/',
            url: 'minha-carteira-novo.html',
        },
        
    ],
    statusbar: {
      iosOverlaysWebView: false,
      iosBackgroundColor: '#4c359c',
      androidBackgroundColor: '#4c359c',
      iosTextColor: 'white',
      androidTextColor: 'white',
    },
  });

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    var app_usuario_id = window.localStorage.getItem('app_usuario_id');
    var app_usuario_nome = window.localStorage.getItem('app_usuario_nome');
    var app_usuario_imagem = window.localStorage.getItem('app_usuario_imagem');
    var app_usuario_email = window.localStorage.getItem('app_usuario_email');

    console.log("Device is ready!");
    console.log("Id user: "+app_usuario_id);
    loadIndex();

    setTimeout(() => {
    
        if(app_usuario_id=="" || app_usuario_id==null){
            mainView.router.navigate("/login/");
        }else{
            $$(".lateral-usuario-info-nome").html(app_usuario_nome);
            $$(".lateral-usuario-info-email").html(app_usuario_email);
            mainView.router.navigate("/home/");
            $('#toolbar-home').show();
        }
    }, 3100);
    
});

function loadIndex(){
    $$('#bt-lateral-sair').on('click', function (e) {
        window.localStorage.setItem('app_usuario_id','');
        app.panel.close();
        mainView.router.navigate("/login/");
    });

    $$('.sidebar-botton').on('click', function (e) {
        app.panel.open();
    });

    $$('#bt-scan-qrcode').on('click', function (e) {
        QRScanner.prepare(onDone);
    });

    $$('.qrcode-container-caixa-sair').on('click', function (e) {
        $('.qrcode-container').hide();
        $('.view').show();
        $('body').css('background','#7cdcfb');
        QRScanner.disableLight();
        QRScanner.cancelScan();
        QRScanner.hide();
        QRScanner.destroy();
    });
}
    
function onDone(err, status){
    if(err){ app.dialog.alert(err,"Aviso"); }
    if(status.authorized){
        QRScanner.scan(displayContents);
        QRScanner.show();
        $('.qrcode-container').show();
        $('.view').hide();
        $('body').css('background','transparent');
    }else if(status.denied){
        app.dialog.alert("Sem acesso a camera do celular!","Aviso");
    }else{
        app.dialog.alert("Sem acesso a camera do celular!","Aviso");
    }
}

function displayContents(err, text){
    if(err){
        app.dialog.alert(err);
    }else{
        $('.qrcode-container').hide();
        $('.view').show();
        $('body').css('background','#7cdcfb');
        QRScanner.disableLight();
        QRScanner.cancelScan();
        QRScanner.hide();
        QRScanner.destroy();
    }
  }

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('page:init', function (e) {
    // Get page data from event data

    app.panel.close();

    console.log(e.detail.el.dataset.page)

    // Script Tela - Home
    if(e.detail.el.dataset.page=="index"){
        loadIndex();
    }

    // Script Tela - Home
    if(e.detail.el.dataset.page=="home"){
        $('#toolbar-home').show();
    }

    

    // Script Tela - Login Manual
    if(e.detail.el.dataset.page=="login"){

        /*
        $$('.login-bt-google').on('click', function (e) {
            window.localStorage.setItem('id_usuarios','1');
            mainView.router.navigate("/");
        });
        */

        $$('.login-bt-google').on('click', function (e) {
            window.plugins.googleplus.login(
            {
                'scopes': 'email profile', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                'webClientId': '559664173319-u04gf9i8p45e4bqnrsc57q3jfgppj978.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            },
            function (obj) {
                app.dialog.alert("Erro: " + JSON.stringify(obj),"Aviso");
            },
            function (msg) {
                app.dialog.alert("Erro: " + JSON.stringify(msg),"Aviso");
            }
        );
        });
        $$('.login-bt-facebook').on('click', function (e) {
            var fbLoginSuccess = function (userData) {
                console.log("UserInfo: ", userData);
                app.dialog.alert("UserInfo: "+JSON.stringify(userData),"Aviso");
                facebookConnectPlugin.getAccessToken(function(token) {
                    console.log("Token: " + token);
                    app.dialog.alert("Token: " + token,"Aviso");
                    facebookConnectPlugin.api("/me?fields=id,name,first_name,last_name,gender,picture,email", ["public_profile", "email"],
                        function onSuccess (result) {
                            console.log("Result: ", result);
                            
                            $.post('http://capsulas4u.com.br/app_api/login-cadastro.php', { opt:'facebook', nome:nome, celular:celular, email:result.email, senha:result.id, sexo:result.gender, imagem:result.picture.data.url }, function (data) {
                                console.log(data);
                
                                var retorno = data.split("#|#");
                
                                window.localStorage.setItem('app_usuario_id',retorno[0]);
                                window.localStorage.setItem('app_usuario_nome',retorno[1]);
                                window.localStorage.setItem('app_usuario_imagem',retorno[2]);
                                window.localStorage.setItem('app_usuario_email',retorno[3]);
                
                                $$(".lateral-usuario-info-nome").html(retorno[1]);
                                $$(".lateral-usuario-info-email").html(retorno[3]);
                                $('.lateral-usuario-imagem').css('background-image','url('+ retorno[2] +')');
                
                                mainView.router.navigate("/");
                
                            });

//nome:result.first_name, sobrenome:result.last_name, sexo:result.gender, email:result.email, imagem:result.picture.data.url, id_facebook:result.id

                        }, function onError (error) {
                            app.dialog.alert("Erro: " + JSON.stringify(error),"Aviso");
                        }
                    );
                });
            }

            facebookConnectPlugin.login(['public_profile','email'], fbLoginSuccess, function(error){ console.error(error); });
        });
    }

    // Script Tela - Login Manual
    if(e.detail.el.dataset.page=="login-cadastro"){

        $$('#bt-login-acessar').on('click', function (e) {
            var email = $$('#login-email').val();
            var senha = $$('#login-senha').val();
            if(email=="" || senha==""){
                app.dialog.alert("Os campos E-mail e Senha devem ser preenchidos!","Aviso");
                return false;
            }
            $.post('http://capsulas4u.com.br/app_api/login.php', { email:email, senha:senha }, function (data) {
                console.log(data);

                if(data=="ERRO1"){
                    app.dialog.alert("E-mail ou Senha incorreta!","Aviso");
                    return false;
                }

                var retorno = data.split("#|#");

                window.localStorage.setItem('app_usuario_id',retorno[0]);
                window.localStorage.setItem('app_usuario_nome',retorno[1]);
                window.localStorage.setItem('app_usuario_imagem',retorno[2]);
                window.localStorage.setItem('app_usuario_email',retorno[3]);

                $$(".lateral-usuario-info-nome").html(retorno[1]);
                $$(".lateral-usuario-info-email").html(retorno[3]);

                mainView.router.navigate("/");
            });
        });
    }

    // Script Tela - Login Cadastro
    if(e.detail.el.dataset.page=="login-cadastro-ficha"){

        $('#login-cadastro-ficha-celular').mask('(00) 00000-0000');

        $$('#login-cadastro-ficha-bt-continuar').on('click', function (e) {
            var nome = $$('#login-cadastro-ficha-nome').val();
            var celular = $$('#login-cadastro-ficha-celular').val();
            var email = $$('#login-cadastro-ficha-email').val();
            var senha = $$('#login-cadastro-ficha-senha').val();
            if(nome==""){
                app.dialog.alert("O campo NOME deve ser preenchido!","Aviso");
                return false;
            }
            if(celular==""){
                app.dialog.alert("O campo CELULAR deve ser preenchido!","Aviso");
                return false;
            }
            if(email==""){
                app.dialog.alert("O campo E-MAIL deve ser preenchido!","Aviso");
                return false;
            }
            if(senha==""){
                app.dialog.alert("O campo SENHA deve ser preenchido!","Aviso");
                return false;
            }
            $.post('http://capsulas4u.com.br/app_api/login-cadastro.php', { nome:nome, celular:celular, email:email, senha:senha }, function (data) {
                console.log(data);

                if(data=="ERRO1"){
                    app.dialog.alert("Esse e-mail já foi utilizado em outro cadastro!","Aviso");
                    return false;
                }

                var retorno = data.split("#|#");

                window.localStorage.setItem('app_usuario_id',retorno[0]);
                window.localStorage.setItem('app_usuario_nome',retorno[1]);
                window.localStorage.setItem('app_usuario_imagem',retorno[2]);
                window.localStorage.setItem('app_usuario_email',retorno[3]);

                $$(".lateral-usuario-info-nome").html(retorno[1]);
                $$(".lateral-usuario-info-email").html(retorno[3]);

                mainView.router.navigate("/");

            });
            
        });
    }

    // Script Tela - Esqueci minha senha
    if(e.detail.el.dataset.page=="login-cadastro-esqueci"){
        
        $$('#bt-recuperar-senha').on('click', function (e) {
            var email = $$('#recuperar-senha-email').val();
            if(email==""){
                app.dialog.alert("Você deve informar um e-mail válido!","Aviso");
                return false;
            }
            $.post('http://capsulas4u.com.br/app_api/esqueci-minha-senha.php', { email:email }, function (data) {
                console.log(data);

                if(data=="ERRO1"){
                    app.dialog.alert("Não encontramos um cadastro com esse e-mail!","Aviso");
                    return false;
                }

                mainView.router.navigate("/login-esqueci-senha-obrigado/");

            });
            
        });
    }

    // Script Tela - Esqueci minha senha
    if(e.detail.el.dataset.page=="login-cadastro-esqueci-obrigado"){
        
    }

    // Script Tela - Esqueci minha senha
    if(e.detail.el.dataset.page=="minha-carteira"){
        
    }

    // Script Tela - Esqueci minha senha
    if(e.detail.el.dataset.page=="minha-carteira-novo"){
        
    }


})