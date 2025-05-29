flatpickr("#dataEntregaTarefa", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            locale: "pt"
        });

        flatpickr("#date-input", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            locale: "pt"
        });

       document.getElementById('btnSendMaterial').addEventListener('click', function() {
    document.getElementById('send-study-material-form').scrollIntoView({
        behavior: 'smooth'
    });

    setTimeout(function() {
        document.getElementById('tituloMaterial').focus();
    }, 500); 
});

        

       const uploadArea = document.getElementById('uploadArea');
const materialFileInput = document.getElementById('materialFile');
const fileNameSpan = document.getElementById('fileName');

uploadArea.addEventListener('click', () => {
    materialFileInput.click();
});

materialFileInput.addEventListener('change', () => {
    if (materialFileInput.files.length > 0) {
        fileNameSpan.textContent = materialFileInput.files[0].name;
    } else {
        fileNameSpan.textContent = "Nenhum arquivo selecionado.";
    }
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    uploadArea.classList.add('dragover'); 
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        materialFileInput.files = files; 
        fileNameSpan.textContent = files[0].name;
    }
});


      const turmasContainer = document.getElementById('turmasContainer');
const classesInputs = document.querySelectorAll('.classesInput');

const selectedClasses = new Set(); 

turmasContainer.addEventListener('click', (event) => {
    const cardTurma = event.target.closest('.card-turma');
    if (cardTurma) {
        const turmaId = cardTurma.dataset.turmaId;

        cardTurma.classList.toggle('selected');

        if (cardTurma.classList.contains('selected')) {
            selectedClasses.add(turmaId);
        } else {
            selectedClasses.delete(turmaId);
        }

        const selected = Array.from(selectedClasses).join(',');

        classesInputs.forEach(input => {
            input.value = selected;
        });
    }
});



document.querySelector('#add-task-form').addEventListener('submit', (e) => {
    e.preventDefault()
    requestHandler(document.querySelector('#add-task-form'), true)
})

document.querySelector('#add-exam-form').addEventListener('submit', (e) => {
    e.preventDefault()
    requestHandler(document.querySelector('#add-exam-form'), true)
})

document.querySelector('#send-study-material-form').addEventListener('submit', (e) => {
    e.preventDefault()
    requestHandler(document.querySelector('#send-study-material-form'), false)
})
