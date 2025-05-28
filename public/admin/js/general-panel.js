document.addEventListener('DOMContentLoaded', function() {
            var ctxProdutividade = document.getElementById('chartProdutividade').getContext('2d');
            var chartProdutividade = new Chart(ctxProdutividade, {
                type: 'line', 
                data: {
                    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'], 
                    datasets: [{
                        label: 'Tarefas Concluídas', 
                        data: [5, 7, 6, 8, 9, 10], 
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)', 
                        fill: true, 
                        tension: 0.4, 
                        pointBackgroundColor: '#007bff', 
                        pointBorderColor: '#fff', 
                        pointBorderWidth: 2,
                        pointRadius: 5 
                    }, {
                        label: 'Média da Turma/Equipe', 
                        data: [6, 6, 7, 7, 8, 8],
                        borderColor: '#28a745', 
                        backgroundColor: 'rgba(40, 167, 69, 0.05)', 
                        fill: false, 
                        tension: 0.4,
                        pointBackgroundColor: '#28a745',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top', 
                            labels: {
                                font: {
                                    size: 14
                                },
                                usePointStyle: true,
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleFont: {
                                size: 16
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 10,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y + ' Tarefas';
                                    }
                                    return label;
                                }
                            }
                        },
                        title: {
                            display: false,
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Período (Semanas)',
                                font: {
                                    size: 14
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            title: {
                                display: true,
                                text: 'Nº de Tarefas Concluídas',
                                font: {
                                    size: 14
                                }
                            },
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });

            


             
        });