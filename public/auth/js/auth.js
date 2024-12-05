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
    const dataJson = JSON.stringify(data)
    
    try {
        await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: dataJson
        }).then(async (response) => {
            const result = await response.json()
        
            if ( response.ok ) {
                throwMessage( result.message, { ok: true } )
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



function redirect(url) {
    throwMessage('Redirecionando...', {ok: true})
    setTimeout(() => {
        window.location.href = url
    }, 500);
}