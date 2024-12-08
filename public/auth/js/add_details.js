studentCardBtn = document.querySelector('#student-card-btn')
teacherCardBtn = document.querySelector('#teacher-card-btn')
studentForm = document.querySelector('#student-form')
teacherForm = document.querySelector('#teacherForm')


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