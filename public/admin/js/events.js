document.addEventListener('DOMContentLoaded', function() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const addEventForm = document.getElementById('addEventForm');
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    const noUpcomingEventsMessage = document.querySelector('.no-upcoming-events-message'); 

    let currentDate = new Date(); 
    
    let events = allEventsData; 

    const allEventElements = document.querySelectorAll('#upcomingEventsList .list-group-item[data-event-id]');
    allEventElements.forEach(el => el.style.display = 'none');


    function renderCalendar() {
        calendarGrid.querySelectorAll('.calendar-day').forEach(day => day.remove()); 
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        currentMonthYear.textContent = `${new Date(year, month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const numDaysInMonth = lastDayOfMonth.getDate();

        const firstDayOfWeek = firstDayOfMonth.getDay(); 
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day');
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= numDaysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'current-month');
            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            dayElement.innerHTML = `<span class="day-number">${day}</span>`;

            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            const eventsOnThisDay = events.filter(event => {
                const eventDate = new Date(event.event_date);
                return eventDate.toISOString().split('T')[0] === fullDate;
            }); 

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
                eventCountSpan.textContent = `${eventsOnThisDay.length} evento(s)`;
                eventInfoDiv.appendChild(eventCountSpan);
                dayElement.appendChild(eventInfoDiv);

                dayElement.title = eventsOnThisDay.map(e => `${e.name} (${e.event_time ? e.event_time.substring(0, 5) : 'Dia Todo'})`).join('\n');
            }

            calendarGrid.appendChild(dayElement);
        }
        renderUpcomingEvents(); 
    }

    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar();
    }

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    function renderUpcomingEvents() {
        allEventElements.forEach(el => el.style.display = 'none');
        
        const now = new Date(); 
        const futureEvents = events.filter(event => {
            const eventDateTime = new Date(event.event_date + (event.event_time ? `T${event.event_time}` : ''));
            return eventDateTime >= now;
        });

        futureEvents.sort((a, b) => {
            const dateA = new Date(a.event_date + (a.event_time ? `T${a.event_time}` : ''));
            const dateB = new Date(b.event_date + (b.event_time ? `T${b.event_time}` : ''));
            return dateA - dateB;
        });

        if (futureEvents.length === 0) {
            if (noUpcomingEventsMessage) { 
                noUpcomingEventsMessage.style.display = 'block';
            }
            return;
        } else {
            if (noUpcomingEventsMessage) { 
                noUpcomingEventsMessage.style.display = 'none';
            }
        }

        futureEvents.forEach(event => {
            const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
            if (eventElement) {
                eventElement.style.display = 'flex'; 
            }
        });
        
        attachDeleteEventListeners();
    }

    function attachDeleteEventListeners() {
        document.querySelectorAll('.delete-event-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteEvent);
            button.addEventListener('click', handleDeleteEvent);
        });
    }

    async function handleDeleteEvent(e) {
        const eventId = this.dataset.eventId;
        console.log('Tentando excluir evento com ID:', eventId);

        if (!confirm('Tem certeza que deseja excluir este evento?')) {
            return;
        }

        try {
            const response = await fetch(`/api/events/${eventId}`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                events = events.filter(event => event.id != eventId);
                
                const elementToRemove = document.querySelector(`[data-event-id="${eventId}"]`);
                if (elementToRemove) {
                    elementToRemove.remove();
                }

                console.log('Evento excluído com sucesso!');
                renderCalendar(); 
                renderUpcomingEvents(); 

            } else {
                const errorData = await response.json();
                console.error('Erro ao excluir evento:', errorData.message);
                alert('Erro ao excluir evento: ' + errorData.message);
            }
        } catch (error) {
            console.error('Erro na requisição de exclusão:', error);
            alert('Erro de conexão ao excluir evento.');
        }
    }

    addEventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        requestHandler(addEventForm); 
    });

    renderCalendar(); 
    attachDeleteEventListeners(); 
});

const inputFile = document.getElementById('eventFile');
const fileNameSpan = document.getElementById('file-name');

if (inputFile && fileNameSpan) { 
    inputFile.addEventListener('change', () => {
        const fileName = inputFile.files.length > 0 ? inputFile.files[0].name : 'Nenhum arquivo selecionado';
        fileNameSpan.textContent = fileName;
    });
}
