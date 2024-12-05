const form = document.querySelector('form')

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

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const overlaySpinloaderDiv = document.querySelector('.overlay')
    overlaySpinloaderDiv.style = 'display: flex;'

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    
    try {
        await fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data)
        }).then(async (response) => {
            const result = await response.json()
        
            if ( response.ok ) {
                throwMessage( result.message, { ok: true } )

                setTimeout(() => {
                    authRedirect(form)
                }, 2000);

            } else {
                throwMessage( result.message, { ok: false } )
            }


        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setTimeout(() => {
                $('.overlay').fadeOut(500)
            }, 500)
        })
    } catch(err) {
        console.log(err)
    }
})


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