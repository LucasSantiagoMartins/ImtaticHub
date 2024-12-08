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