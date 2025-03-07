// Armazenar os dados dos assistidos
let attendees = [];

const addBtn = document.querySelector(".add");
const input = document.querySelector(".inp");

function addInput() {
    // Criando os campos de input para nome e número de sessões
    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Nome do assistido";

    const sessions = document.createElement("input");
    sessions.type = "number";
    sessions.placeholder = "Número de sessões";

    // Criando o select para tipo de sessão
    const sessions_type = document.createElement("select"); 
    const option1 = document.createElement("option");
    option1.value = "Relacional";
    option1.textContent = "Relacional";
    const option2 = document.createElement("option");
    option2.value = "Funcional";
    option2.textContent = "Funcional";
    const option3 = document.createElement("option");
    option3.value = "Aquatica";
    option3.textContent = "Aquática";

    // Adicionando as opções ao select
    sessions_type.appendChild(option1);
    sessions_type.appendChild(option2);
    sessions_type.appendChild(option3);

    // Criando o botão de excluir (a tag <a>)
    const btn = document.createElement("a");
    btn.className = "delete";
    btn.innerHTML = "&times";  // Representa o "×" para deletar

    // Adicionando um evento de clique ao botão de deletar (a tag <a>)
    btn.addEventListener("click", function(event) {
        // Evitar o comportamento padrão do <a> (não redirecionar a página)
        event.preventDefault();
        
        // Remover a div.flex (a div que contém todos os campos)
        const flex = btn.parentElement; // A div.flex é o elemento pai do botão
        flex.remove();  // Remove a div.flex do DOM
    });

    // Criando a div flex para organizar os campos
    const flex = document.createElement("div");
    flex.className = "flex";

    // Adicionando os elementos criados à div flex
    flex.appendChild(name);
    flex.appendChild(sessions);
    flex.appendChild(sessions_type);
    flex.appendChild(btn);

    // Adicionando a div flex ao input (onde os campos são inseridos)
    input.appendChild(flex);
}

// Evento de clique no botão para adicionar novos campos
addBtn.addEventListener("click", addInput);

// Seleção dos elementos do DOM
const nameInput = document.getElementById('name');
const sessionsInput = document.getElementById('sessions');
const sessionTypeSelect = document.getElementById('session-type');
const absentCheckbox = document.getElementById('absent');
const attendeesList = document.getElementById('attendees');
const totalSessionsEl = document.getElementById('total-sessions');
const totalAbsencesEl = document.getElementById('total-absences');
const sessionsByTypeEl = document.getElementById('sessions-by-type');
const filterInput = document.getElementById('filter-name');

// Função para atualizar a lista de assistidos
function updateAttendanceList() {
    // Limpar a lista
    attendeesList.innerHTML = '';

    // Atualizar a lista com os assistidos
    attendees.forEach((attendee, index) => {
        const li = document.createElement('li');
        li.textContent = `${attendee.name} - ${attendee.sessions} sessões - ${attendee.sessionType} - ${attendee.absent ? 'Faltou' : 'Presente'}`;
        attendeesList.appendChild(li);
    });

    // Atualizar o resumo
    updateSummary();
}

// Função para atualizar o resumo
function updateSummary() {
    const totalSessions = attendees.reduce((total, attendee) => total + parseInt(attendee.sessions), 0);
    const totalAbsences = attendees.filter(attendee => attendee.absent).length;

    totalSessionsEl.textContent = totalSessions;
    totalAbsencesEl.textContent = totalAbsences;

    const sessionTypeCounts = attendees.reduce((counts, attendee) => {
        counts[attendee.sessionType] = (counts[attendee.sessionType] || 0) + parseInt(attendee.sessions);
        return counts;
    }, {});

    // Atualizar sessões por tipo
    sessionsByTypeEl.innerHTML = '';
    for (const [type, count] of Object.entries(sessionTypeCounts)) {
        const li = document.createElement('li');
        li.textContent = `${type}: ${count} sessões`;
        sessionsByTypeEl.appendChild(li);
    }
}

// Função para filtrar assistidos pelo nome
function filterAttendance() {
    const filterName = filterInput.value.toLowerCase();
    const filteredAttendees = attendees.filter(attendee => attendee.name.toLowerCase().includes(filterName));
    updateFilteredAttendance(filteredAttendees);
}

// Função para atualizar a lista filtrada
function updateFilteredAttendance(filteredAttendees) {
    attendeesList.innerHTML = '';
    filteredAttendees.forEach((attendee, index) => {
        const li = document.createElement('li');
        li.textContent = `${attendee.name} - ${attendee.sessions} sessões - ${attendee.sessionType} - ${attendee.absent ? 'Faltou' : 'Presente'}`;
        attendeesList.appendChild(li);
    });
}

// Lógica para adicionar assistido
document.getElementById('attendance-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Coletando dados dos inputs principais (do formulário)
    const newAttendee = {
        name: nameInput.value,
        sessions: sessionsInput.value,
        sessionType: sessionTypeSelect.value,
        absent: absentCheckbox.checked,
    };

    // Adicionando os dados à lista de assistidos
    attendees.push(newAttendee);

    // Agora, pegar os dados dos campos adicionais que foram criados dinamicamente
    const additionalInputs = document.querySelectorAll('.flex');
    additionalInputs.forEach((flex) => {
        const name = flex.querySelector('input[type="text"]').value;
        const sessions = flex.querySelector('input[type="number"]').value;
        const sessionType = flex.querySelector('select').value;

        const attendee = {
            name,
            sessions,
            sessionType,
            absent: false,  // Assumir como 'não faltou', já que não há checkbox nesse campo
        };

        attendees.push(attendee);
    });

    // Limpar os campos principais
    nameInput.value = '';
    sessionsInput.value = '';
    absentCheckbox.checked = false;

    // Limpar os campos dinâmicos (campos extras que foram criados)
    const dynamicFields = document.querySelectorAll('.flex');
    dynamicFields.forEach((flex) => {
        flex.querySelector('input[type="text"]').value = '';
        flex.querySelector('input[type="number"]').value = '';
        flex.querySelector('select').value = "Relacional"; // Ou qualquer valor padrão que você queira
    });

    // Manter o botão "+" visível
    const inpContainer = document.querySelector('.inp'); // Onde os campos dinâmicos estão
    inpContainer.querySelectorAll('.flex').forEach(flex => flex.remove()); // Limpa apenas os campos dinâmicos

    // Re-adiciona o botão "+" no final
    inpContainer.appendChild(addBtn);

    // Atualizar a lista e resumo
    updateAttendanceList();
});

// Evento para filtro ao digitar
filterInput.addEventListener('input', filterAttendance);
