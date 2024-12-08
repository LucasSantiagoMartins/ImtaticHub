function showPassword(){
    const passwordInput = document.querySelector('input[name=password]')

    if ( passwordInput.type == 'password' ) {
        passwordInput.type = 'text'
    }else{
        passwordInput.type = 'password'
    }
}


function authRedirect(form) {
    throwMessage('Redirecionando...', {ok: true})
    
    if ( form.action == 'http://localhost:8080/auth/login' ) {
        successUrl = 'http://localhost:8080/auth/register'
    }
    if ( form.action == 'http://localhost:8080/auth/register'){
        successUrl = 'http://localhost:8080/auth/login'
    }

    setTimeout(() => {
        window.location.href = successUrl
    }, 500);
}

function redirect(url) {
    throwMessage('Redirecionando...', {ok: true})
    setTimeout(() => {
        window.location.href = url
    }, 500)
}