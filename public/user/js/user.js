function showPassword(){
    const passwordInput = document.querySelector('input[name=password]')

    if ( passwordInput.type == 'password' ) {
        passwordInput.type = 'text'
    }else{
        passwordInput.type = 'password'
    }
}

form = document.querySelector('form')

form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (form.action == 'http://localhost:8080/usuarios/iniciar-sessao'){
        var redirectUrl = 'http://localhost:8080/'
    }
    if (form.action == 'http://localhost:8080/usuarios/criar-conta') {
        var redirectUrl = 'http://localhost:8080/usuarios/selecionar-perfil'
    }

    requestHandler(form, redirectUrl)
})