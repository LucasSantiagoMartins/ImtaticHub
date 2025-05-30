document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventCardsContainer = document.getElementById('eventCardsContainer');
    const noEventsMessage = document.getElementById('noEventsMessage');
    const submissionFormsContainer = document.getElementById('submissionFormsContainer');
    const formTitle = document.getElementById('formTitle');
    const dynamicFormContent = document.getElementById('dynamicFormContent');
    const backToEventsBtn = document.getElementById('backToEventsBtn');
    const upcomingActivityTitle = document.getElementById('upcomingActivityTitle');
    const overlaySpinloaderDiv = document.querySelector('.overlay');

    let currentDate = new Date(); 

    const eventDetails = {
        'tarefa': { translation: 'Tarefa', icon: '<i class="fas fa-clipboard-list"></i>', badgeClass: 'bg-info' },
        'trabalho': { translation: 'Trabalho', icon: '<i class="fas fa-file-alt"></i>', badgeClass: 'bg-success' },
        'prova': { translation: 'Prova', icon: '<i class="fas fa-user-graduate"></i>', badgeClass: 'bg-danger' }
    };

    function showSpinner() {
        if (overlaySpinloaderDiv) {
            overlaySpinloaderDiv.style.display = 'flex';
        }
    }

    function hideSpinner() {
        if (overlaySpinloaderDiv) {
            overlaySpinloaderDiv.style.display = 'none';
        }
    }

    function getEventTypeInfo(type) {
        return eventDetails[type] || { translation: type, icon: '', badgeClass: 'bg-secondary' };
    }

    function renderCalendar() {
        Array.from(calendarGrid.children).forEach(child => {
            if (!child.classList.contains('day-name')) {
                child.remove();
            }
        });

        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        currentMonthYear.textContent = `${new Date(year, month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const numDaysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay(); 

        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty-day');
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= numDaysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'current-month');
            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.dataset.fullDate = fullDate; 

            dayElement.innerHTML = `<span class="day-number">${day}</span>`;

            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            const allEvents = Array.isArray(window.allEvents) ? window.allEvents : [];

            const eventsOnThisDay = allEvents.filter(event => event.dueDate === fullDate);

            if (eventsOnThisDay.length > 0) {
                dayElement.classList.add('has-event');
                const eventInfoDiv = document.createElement('div');
                eventInfoDiv.classList.add('event-info');

                eventsOnThisDay.forEach(event => {
                    const eventDot = document.createElement('div');
                    eventDot.classList.add('event-dot');
                    eventInfoDiv.appendChild(eventDot);
                });

                const eventCountSpan = document.createElement('span');
                eventCountSpan.classList.add('event-count');
                eventCountSpan.textContent = `${eventsOnThisDay.length} atividade(s)`;
                eventInfoDiv.appendChild(eventCountSpan);
                dayElement.appendChild(eventInfoDiv);

                const tooltipContent = eventsOnThisDay.map(e => {
                    const typeInfo = getEventTypeInfo(e.type);
                    return `${typeInfo.translation}: ${e.title} (${e.discipline}) - ${e.dueTime ? e.dueTime : 'Dia Todo'}`;
                }).join('\n');

                dayElement.setAttribute('data-bs-toggle', 'tooltip');
                dayElement.setAttribute('data-bs-placement', 'top');
                dayElement.setAttribute('data-bs-custom-class', 'custom-tooltip');
                dayElement.setAttribute('data-bs-title', tooltipContent);
            }
            calendarGrid.appendChild(dayElement);
        }

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        renderUpcomingEvents(); 
    }

    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar();
    }

    function renderUpcomingEvents() {
        eventCardsContainer.innerHTML = ''; 

        const allEvents = Array.isArray(window.allEvents) ? window.allEvents : [];

        const sortedEvents = allEvents.sort((a, b) => {
            const [yearA, monthA, dayA] = a.dueDate.split('-').map(Number);
            const [hourA, minuteA] = a.dueTime ? a.dueTime.split(':').map(Number) : [23, 59];
            const dateA = new Date(yearA, monthA - 1, dayA, hourA, minuteA);

            const [yearB, monthB, dayB] = b.dueDate.split('-').map(Number);
            const [hourB, minuteB] = b.dueTime ? b.dueTime.split(':').map(Number) : [23, 59];
            const dateB = new Date(yearB, monthB - 1, dayB, hourB, minuteB);

            return dateA - dateB;
        });

        if (sortedEvents.length === 0) {
            noEventsMessage.textContent = 'Nenhuma atividade encontrada.'; 
            noEventsMessage.style.display = 'block';
        } else {
            noEventsMessage.style.display = 'none';
            sortedEvents.forEach((event, index) => { 
                const eventCardCol = document.createElement('div');
                eventCardCol.classList.add('col');
                eventCardCol.style.animationDelay = `${index * 0.08}s`; 

                const typeInfo = getEventTypeInfo(event.type);

                eventCardCol.innerHTML = `
                    <div class="card h-100 event-card animate__animated animate__fadeInUp" data-event-id="${event.id}" data-event-type="${event.type}">
                        <div class="card-body">
                            <h5 class="card-title">${typeInfo.icon} ${event.title}</h5>
                            <p class="card-text"><strong>Disciplina:</strong> ${event.discipline}</p>
                            <p class="card-text"><strong>Entrega:</strong> ${new Date(event.dueDate).toLocaleDateString('pt-BR')} ${event.dueTime ? `às ${event.dueTime}` : ''}</p>
                            <p class="card-text description">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                            <span class="badge ${typeInfo.badgeClass}">${typeInfo.translation}</span>
                        </div>
                    </div>
                `;
                eventCardsContainer.appendChild(eventCardCol);
            });

            document.querySelectorAll('.event-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const eventId = e.currentTarget.dataset.eventId;
                    const eventType = e.currentTarget.dataset.eventType;
                    const allEvents = Array.isArray(window.allEvents) ? window.allEvents : [];
                    const selectedEvent = allEvents.find(event => event.id == eventId && event.type === eventType);
                    if (selectedEvent) {
                        displaySubmissionForm(selectedEvent);
                    }
                });
            });
        }
    }

    function displaySubmissionForm(eventData) {
        eventCardsContainer.style.display = 'none';
        noEventsMessage.style.display = 'none';
        upcomingActivityTitle.style.display = 'none';

        submissionFormsContainer.style.display = 'block';
        backToEventsBtn.style.display = 'block';

        const typeInfo = getEventTypeInfo(eventData.type);
        formTitle.textContent = `Submeter ${typeInfo.translation}: ${eventData.title}`;

        let formHtml = '';
        if (eventData.type === 'trabalho' || eventData.type === 'tarefa') {
            formHtml = `
                <div class="card submission-form-card shadow-sm">
                    <div class="card-body">
                        <form id="submitAssignmentForm" action="/estudante/submeter-tarefa-trabalho" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="academicTaskId" value="${eventData.id}">
                            <div class="mb-3">
                                <label for="submissionDescription" class="form-label">Descrição da ${typeInfo.translation} (opcional)</label>
                                <textarea class="form-control" name="description" name="submissionDescription" rows="4" placeholder="Adicione uma descrição para sua submissão"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Anexar Arquivo</label>
                                <div class="drag-drop-area" id="dragDropArea">
                                    <i class="fas fa-cloud-upload-alt fa-3x mb-2"></i>
                                    <p class="mb-1">Arraste e solte o arquivo aqui ou</p>
                                    <button type="button" class="btn btn-outline-primary btn-sm mt-2" id="selectFileBtn">Selecione um arquivo</button>
                                    <input type="file" id="submissionFile" name="file" accept=".pdf, .doc, .docx, .zip, .rar, .txt" class="d-none">
                                    <span class="file-name mt-2 d-block" id="fileName">Nenhum arquivo selecionado</span>
                                    <div class="form-text">Tipos de arquivo aceitos: PDF, DOC, DOCX, ZIP, RAR, TXT.</div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary mt-3 py-2 px-4">Enviar ${typeInfo.translation}</button>
                        </form>
                    </div>
                </div>
            `;
        } else if (eventData.type === 'prova') {
            formHtml = `
                <div class="alert alert-info text-center" role="alert">
                    <i class="fas fa-info-circle me-2"></i>Esta é uma prova e não requer submissão de arquivo por este painel. Verifique as instruções do professor para detalhes sobre como realizar a prova.
                </div>
                <div class="card submission-form-card shadow-sm mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Detalhes da Prova</h5>
                        <p class="card-text"><strong>Título:</strong> ${eventData.title}</p>
                        <p class="card-text"><strong>Disciplina:</strong> ${eventData.discipline}</p>
                        <p class="card-text"><strong>Data:</strong> ${new Date(eventData.dueDate).toLocaleDateString('pt-BR')} ${eventData.dueTime ? `às ${eventData.dueTime}` : ''}</p>
                        <p class="card-text"><strong>Descrição:</strong> ${eventData.description}</p>
                    </div>
                </div>
            `;
        }

        dynamicFormContent.innerHTML = formHtml;
        submissionFormsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const dragDropArea = document.getElementById('dragDropArea');
        const submissionFile = document.getElementById('submissionFile');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const fileNameSpan = document.getElementById('fileName');

        if (dragDropArea && submissionFile && selectFileBtn && fileNameSpan) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dragDropArea.addEventListener(eventName, preventDefaults, false);
                document.body.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                dragDropArea.addEventListener(eventName, () => dragDropArea.classList.add('dragover'), false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dragDropArea.addEventListener(eventName, () => dragDropArea.classList.remove('dragover'), false);
            });

            dragDropArea.addEventListener('drop', handleDrop, false);

            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length > 0) {
                    submissionFile.files = files;
                    fileNameSpan.textContent = files[0].name;
                } else {
                    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
                }
            }

            selectFileBtn.addEventListener('click', () => {
                submissionFile.click();
            });

            submissionFile.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileNameSpan.textContent = e.target.files[0].name;
                } else {
                    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
                }
            });
        }

        const form = document.getElementById('submitAssignmentForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                requestHandler(form)
                backToEvents(); 
            })
        }
    }

    function backToEvents() {
        submissionFormsContainer.style.display = 'none';
        backToEventsBtn.style.display = 'none';
        upcomingActivityTitle.style.display = 'block';
        eventCardsContainer.style.display = 'flex';
        dynamicFormContent.innerHTML = ''; 
        renderUpcomingEvents(); 
        renderCalendar(); 
    }

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    backToEventsBtn.addEventListener('click', backToEvents);

    showSpinner();
    setTimeout(() => {
        renderCalendar();
        hideSpinner();
    }, 100);
});