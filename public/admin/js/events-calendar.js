document.addEventListener('DOMContentLoaded', function() {
    const calendarGrid = document.getElementById('calendar-grid');
            const currentMonthYear = document.getElementById('currentMonthYear');
            const prevMonthBtn = document.getElementById('prevMonth');
            const nextMonthBtn = document.getElementById('nextMonth');
            const addEventForm = document.getElementById('addEventForm');
            const upcomingEventsList = document.getElementById('upcomingEventsList');

            let currentDate = new Date(); 
            let events = [
                { title: 'Apresentação do Projeto Final', description: 'Revisão final do projeto', date: '2025-05-28', time: '14:00', category: 'reuniao' },
                { title: 'Prazo: Relatório Mensal', description: 'Entrega do relatório de atividades', date: '2025-05-31', time: '', category: 'tarefa' },
                { title: 'Feriado: Dia da Independência', description: 'Feriado nacional', date: '2025-11-11', time: '', category: 'feriado' },
                { title: 'Reunião de equipe', description: 'Reunião semanal de planejamento', date: '2025-06-03', time: '10:00', category: 'reuniao' }
            ];

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

                    const eventsOnThisDay = events.filter(event => event.date === fullDate);
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

                        dayElement.title = eventsOnThisDay.map(e => `${e.title} (${e.time ? e.time : 'Dia Todo'})`).join('\n');
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
                upcomingEventsList.innerHTML = ''; 

                const now = new Date(); 
                const futureEvents = events.filter(event => new Date(event.date) >= now);
                futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

                if (futureEvents.length === 0) {
                    upcomingEventsList.innerHTML = '<p class="text-muted text-center mt-3">Nenhum evento próximo.</p>';
                    return;
                }

                futureEvents.forEach((event, index) => {
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
                    const eventTime = event.time ? `, ${event.time}` : '';
                    let badgeClass = 'bg-secondary';
                    if (event.category === 'tarefa') badgeClass = 'bg-warning text-dark';
                    if (event.category === 'reuniao') badgeClass = 'bg-info text-dark';
                    if (event.category === 'feriado') badgeClass = 'bg-success';

                    const listItem = document.createElement('div');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                    listItem.innerHTML = `
                        <div>
                            <h6 class="mb-1">${event.title}</h6>
                            <p class="mb-1 text-muted">${formattedDate}${eventTime}</p>
                            <small class="badge ${badgeClass}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-event-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                    `;
                    upcomingEventsList.appendChild(listItem);
                });

                document.querySelectorAll('.delete-event-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const eventIndex = parseInt(this.dataset.index);
                        events.splice(eventIndex, 1); 
                        renderCalendar(); 
                        renderUpcomingEvents();
                    });
                });
            }


            addEventForm.addEventListener('submit', function(e) {
                e.preventDefault();
            });


            renderCalendar();
});