async function requestHandler(form, useJson = false) {
  const overlaySpinloaderDiv = document.querySelector('.overlay');
  overlaySpinloaderDiv.style.display = 'flex';

  let body;
  let headers = {};
  
  if (useJson) {
    // Envio como JSON
    const formData = new FormData(form);
    const jsonData = {};

    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    body = JSON.stringify(jsonData);
    headers['Content-Type'] = 'application/json';

  } else {
    // Envio como multipart/form-data
    const formData = new FormData(form);
    body = formData;

  }

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: body,
      headers: headers,
      credentials: 'include'
    });

    const result = await response.json();

    if (response.ok) {
      showToast('success', result.message);

      setTimeout(() => {
        if (result.redirectTo) {
          redirect(result.redirectTo);
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
