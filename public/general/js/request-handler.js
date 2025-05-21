async function requestHandler(form, redirectUrl) {
  const overlaySpinloaderDiv = document.querySelector('.overlay');
  overlaySpinloaderDiv.style.display = 'flex';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(form.action, {
      method: form.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    const result = await response.json();

    if (response.ok) {
      showToast('success', result.message);

      setTimeout(() => {
        if (result.args) {
          redirect(redirectUrl, result.args);
        } else {
          redirect(redirectUrl);
        }
      }, 2000);
    } else {
      showToast('error', result.message);
    }
  } catch (err) {
    console.log(err);
    showToast('error', 'Erro ao processar a requisição.');
  } finally {
    setTimeout(() => {
      $('.overlay').fadeOut(500);
    }, 500);
  }
}
