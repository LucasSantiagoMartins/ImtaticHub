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

    requestHandler(form)
})



 async function logout() {

 const overlaySpinloaderDiv = document.querySelector('.overlay');
overlaySpinloaderDiv.style.display = 'flex'; 

  try {
    const response = await fetch('/usuarios/logout', {
      method: 'POST',
      credentials: 'include'
    });

    const result = await response.json();

    if (result.success) {
      showToast('success', ` ${result.message}`);

      setTimeout(() => {
        if (result.redirectTo) {
          window.location.href = result.redirectTo;
        }
      }, 2000);
    } else {
      showToast('error', result.message);
    }
  } catch (err) {
    console.log(err);
    showToast('error', 'Erro ao processar logout.');
  } finally {
    setTimeout(() => {
      $('.overlay').fadeOut(500);
    }, 500);
  }
}
