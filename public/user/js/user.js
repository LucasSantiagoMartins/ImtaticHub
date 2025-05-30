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
    requestHandler(form, true)
})

