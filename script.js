// Estado inicial predeterminado
const initialAppliances = [
    { id: 1, name: 'Nevera / Refrigerador', icon: '', connected: true, protected: true },
    { id: 2, name: 'Televisor', icon: '', connected: true, protected: false },
    { id: 3, name: 'Lavadora', icon: '', connected: false, protected: false },
    { id: 4, name: 'Microondas', icon: '', connected: true, protected: false },
    { id: 5, name: 'Cafetera', icon: '', connected: false, protected: false }
];

// Cargar desde LocalStorage o usar datos iniciales
let appliances = JSON.parse(localStorage.getItem('ecooo_appliances')) || initialAppliances;
let pendingToggleId = null;

// Elementos del DOM
const countOnEl = document.getElementById('count-on');
const countOffEl = document.getElementById('count-off');
const countTotalEl = document.getElementById('count-total');
const applianceListEl = document.getElementById('appliance-list');

const fabBtn = document.getElementById('fab-btn');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');
const addBtn = document.getElementById('add-btn');
const newNameInput = document.getElementById('new-name');
const newIconSelect = document.getElementById('new-icon');
const manageListEl = document.getElementById('manage-list');

const warningOverlay = document.getElementById('warning-overlay');
const warningCancelBtn = document.getElementById('warning-cancel');
const warningConfirmBtn = document.getElementById('warning-confirm');

// Guardar cambios en el almacenamiento local
function saveData() {
    localStorage.setItem('ecooo_appliances', JSON.stringify(appliances));
    render();
}

// Renderizar la aplicación
function render() {
    // 1. Actualizar contadores
    const onCount = appliances.filter(a => a.connected).length;
    const offCount = appliances.length - onCount;

    countOnEl.textContent = onCount;
    countOffEl.textContent = offCount;
    countTotalEl.textContent = appliances.length;

    // 2. Renderizar lista principal
    applianceListEl.innerHTML = '';
    appliances.forEach(app => {
        const item = document.createElement('div');
        item.className = 'appliance-item';
        item.innerHTML = `
            <div class="appliance-info">
                <div class="appliance-icon">${app.icon}</div>
                <div>
                    <div class="appliance-name">${app.name} ${app.protected ? '🔒' : ''}</div>
                    <div class="appliance-status ${app.connected ? 'on' : 'off'}">
                        ${app.connected ? 'Conectado' : 'Desconectado'}
                    </div>
                </div>
            </div>
            <label class="switch">
                <input type="checkbox" ${app.connected ? 'checked' : ''} data-id="${app.id}">
                <span class="slider"></span>
            </label>
        `;

        // Evento al presionar el interruptor
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', (e) => handleToggle(app, e.target.checked));

        applianceListEl.appendChild(item);
    });

    // 3. Renderizar lista de gestión
    renderManageList();
}

// Manejar el cambio de estado (Conectado / Desconectado)
function handleToggle(app, checkState) {
    // Si intenta desconectar un equipo protegido (Ej: Nevera)
    if (!checkState && (app.protected || app.name.toLowerCase().includes('nevera'))) {
        pendingToggleId = app.id;
        warningOverlay.classList.add('active');
        render(); // Revertir visualmente el switch hasta confirmar
        return;
    }

    app.connected = checkState;
    saveData();
}

// Modal de advertencia
warningCancelBtn.addEventListener('click', () => {
    pendingToggleId = null;
    warningOverlay.classList.remove('active');
});

warningConfirmBtn.addEventListener('click', () => {
    if (pendingToggleId !== null) {
        const app = appliances.find(a => a.id === pendingToggleId);
        if (app) app.connected = false;
        pendingToggleId = null;
        warningOverlay.classList.remove('active');
        saveData();
    }
});

// Menú Flotante (Abrir / Cerrar)
fabBtn.addEventListener('click', () => menuOverlay.classList.add('active'));
closeMenuBtn.addEventListener('click', () => menuOverlay.classList.remove('active'));

menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove('active');
});

// Agregar nuevo electrodoméstico
addBtn.addEventListener('click', () => {
    const name = newNameInput.value.trim();
    const icon = newIconSelect.value;

    if (!name) return alert('Por favor ingresa un nombre');

    const isProtected = name.toLowerCase().includes('nevera') || name.toLowerCase().includes('refrigerador');

    appliances.push({
        id: Date.now(),
        name: name,
        icon: icon,
        connected: true,
        protected: isProtected
    });

    newNameInput.value = '';
    saveData();
});

// Renderizar la lista dentro del menú para eliminar
function renderManageList() {
    manageListEl.innerHTML = '';
    appliances.forEach(app => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `
            <span>${app.icon} ${app.name}</span>
            <button class="btn-delete" data-id="${app.id}">Eliminar</button>
        `;

        div.querySelector('.btn-delete').addEventListener('click', () => {
            appliances = appliances.filter(a => a.id !== app.id);
            saveData();
        });

        manageListEl.appendChild(div);
    });
const fabBtn = document.getElementById('fab-btn');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');

// Abrir el menú de gestión al presionar el botón +
fabBtn.addEventListener('click', () => {
    menuOverlay.classList.add('active');
});

// Cerrar el menú con el botón de equis (✕)
closeMenuBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
});
}

// Inicializar la aplicación
render();