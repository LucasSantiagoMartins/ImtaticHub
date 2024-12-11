


const forms = document.querySelectorAll('form')

forms.forEach(form => {

    const formInputs = form.querySelectorAll('input')
    const formSelects = form.querySelectorAll('select')
        
        
    formInputs.forEach(input => {
    
        input.addEventListener('change', () => {
            if (input.value != '') {
                input.classList.add('is-valid')
            }else{
                input.classList.remove('is-valid')
                input.classList.add('is-invalid')
            }
        })
    })
        
    formSelects.forEach(select => {
        select.addEventListener('change', () => {
            if (select.value != '') {
                select.classList.add('is-valid')
            }else{
                select.classList.remove('is-valid')
                select.classList.add('is-invalid')
            }
        })
    })
})
    
