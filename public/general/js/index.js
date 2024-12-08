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

function hide(element) {
    $(element).fadeOut(200)
}
function show(element) {
    $(element).fadeIn(200)
}
