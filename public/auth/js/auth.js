function showPassword(){
    const passwordInput = document.querySelector('input[name=password]')

    if ( passwordInput.type == 'password' ) {
        passwordInput.type = 'text'
    }else{
        passwordInput.type = 'password'
    }
}

function redirect(url) {
    throwMessage('Redirecionando...', {ok: true})
    setTimeout(() => {
        window.location.href = url
    }, 500)
}