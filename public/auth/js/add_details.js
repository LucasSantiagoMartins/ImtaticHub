const studentCardBtn = document.querySelector('#student-card-btn')
const teacherCardBtn = document.querySelector('#teacher-card-btn')
const studentForm = document.querySelector('#student-form')
const teacherForm = document.querySelector('#teacher-form')


studentCardBtn.addEventListener('click', () => {
    hide('.cards')
    setTimeout(() => {
        show('#add-details-forms')
        show('#student-form-div')
    }, 200)
})

teacherCardBtn.addEventListener('click', () => {
    hide('.cards')
    setTimeout(() => {
        show('#add-details-forms')
        show('#teacher-form-div')
    }, 200)
})

studentForm.addEventListener('submit', (event) => {
    event.preventDefault()
    requestHandler(studentForm, redirectUrl = '/')
})
teacherForm.addEventListener('submit', (event) => {
    event.preventDefault()
    requestHandler(teacherForm, redirectUrl = '/')
})

// form data validations
const studentFormInputs = studentForm.querySelectorAll('input')
const studentFormSelects = studentForm.querySelectorAll('select')

const teacherFormInputs = teacherForm.querySelectorAll('input')
const teacherFormSelects = teacherForm.querySelectorAll('select')

const formSelects = Array.from(studentFormSelects).concat(Array.from(teacherFormSelects))
const formInputs = Array.from(studentFormInputs).concat(Array.from(teacherFormInputs))

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

const path = window.location.pathname
const segments = path.split('/')
const userId = segments[segments.length - 1]
const userIdHiddenInput = document.querySelector('input[type="hidden"]')
userIdHiddenInput.value = userId
