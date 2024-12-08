function throwMessage(message, status) {
    let messageDiv = document.querySelector('#message-div')
    
    if ( status.ok ) {
        messageDiv.classList.add('success')
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> `
    } else {
        messageDiv.classList.add('error')
        messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> `
    
    }
    messageDiv.innerHTML += message
    $('#message-div').fadeIn(4000)
    setTimeout(() => {
        $('#message-div').fadeOut(500)
        messageDiv.classList.remove('success')
        messageDiv.classList.remove('error')
    }, 5000);

}

function showPassowrd(){
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