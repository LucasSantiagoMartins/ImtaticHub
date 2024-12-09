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

    if (form.action == 'http://localhost:8080/auth/login'){
        var redirectUrl = 'http://localhost:8080/'
    }
    if (form.action == 'http://localhost:8080/auth/register') {
        var redirectUrl = 'http://localhost:8080/auth/add-details'
    }

    requestHandler(form, redirectUrl)
})