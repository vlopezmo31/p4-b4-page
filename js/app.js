
/**
 * Aquesta funció serveix per gestionar la persistència de dades.
 * @param {*} key 
 * @param {*} defaultValue 
 * @returns 
 */
function loadFromLocalStorage(key, defaultValue) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Aquesta funció aplica el fons, tal i com el seu nom indica
 */
function applyBackground() {
  const selectedBackgroundId = loadFromLocalStorage('selectedBackground', 1);
  const rewards = [
    { id: 1, name: 'DopaTask', cost: 0, type: 'background', class: 'bg-default', palette: {
      primary: '#84a6f0', secondary: '#6d88c4', tertiary: '#d1dafa', quartet: '#d0edeb', quinary: '#dcdbd2', Senate: '#2e364a'
    }},
    { id: 2, name: 'Fons fosc 2', cost: 10, type: 'background', class: 'bg-dark2', palette: {
      primary: '#758483', secondary: '#566866', tertiary: '#dbdfde', quartet: '#6f7e74', quinary: '#c2c2ab', Senate: '#292d2d'
    }},
    { id: 3, name: 'Fons fosc 3', cost: 50, type: 'background', class: 'bg-dark3', palette: {
      primary: '#643b46', secondary: '#461927', tertiary: '#bfacb0', quartet: '#865a5c', quinary: '#b6b69c', Senate: '#332125'
    }},
    { id: 4, name: 'Fons clar 1', cost: 150, type: 'background', class: 'bg-light', palette: {
      primary: '#538094', secondary: '#395460', tertiary: '#e2e9ec', quartet: '#558b8b', quinary: '#d3d3c7', Senate: '#202c31'
    }},
    { id: 5, name: 'Jirafa', cost: 20, type: 'mascot', image: 'img/mascots/giraffe.jpg' },
    { id: 6, name: 'Zebra', cost: 30, type: 'mascot', image: 'img/mascots/zebra.jpg' },
    { id: 7, name: 'Porc', cost: 40, type: 'mascot', image: 'img/mascots/pig.jpg' },
  ];
  const selected = rewards.find(r => r.id === selectedBackgroundId);
  const className = selected ? selected.class : 'bg-default';
  document.body.className = className;

  const palette = selected && selected.palette ? selected.palette : rewards[0].palette;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-tertiary', palette.tertiary);
  root.style.setProperty('--color-quartet', palette.quartet);
  root.style.setProperty('--color-quinary', palette.quinary);
  root.style.setProperty('--color-senate', palette.Senate);
}

/**
 * Aquesta funció aplica les especificacions per a la pàgina index dels fitxers CSS.
 */
function applyBackgroundIndex() {
  const selectedBackgroundId = loadFromLocalStorage('selectedBackground', 1);
  const rewards = [
    { id: 1, name: 'DopaTask', cost: 0, type: 'background', class: 'bg-default_index', palette: {
      primary: '#84a6f0', secondary: '#6d88c4', tertiary: '#d1dafa', quartet: '#d0edeb', quinary: '#dcdbd2', Senate: '#2e364a'
    }},
    { id: 2, name: 'Fons fosc 2', cost: 10, type: 'background', class: 'bg-dark2_index', palette: {
      primary: '#758483', secondary: '#566866', tertiary: '#dbdfde', quartet: '#6f7e74', quinary: '#c2c2ab', Senate: '#292d2d'
    }},
    { id: 3, name: 'Fons fosc 3', cost: 50, type: 'background', class: 'bg-dark3_index', palette: {
      primary: '#643b46', secondary: '#461927', tertiary: '#bfacb0', quartet: '#865a5c', quinary: '#b6b69c', Senate: '#332125'
    }},
    { id: 4, name: 'Fons clar 1', cost: 150, type: 'background', class: 'bg-light_index', palette: {
      primary: '#538094', secondary: '#395460', tertiary: '#e2e9ec', quartet: '#558b8b', quinary: '#d3d3c7', Senate: '#202c31'
    }},
    { id: 5, name: 'Jirafa', cost: 20, type: 'mascot', image: 'img/mascots/giraffe.jpg' },
    { id: 6, name: 'Zebra', cost: 30, type: 'mascot', image: 'img/mascots/zebra.jpg' },
    { id: 7, name: 'Porc', cost: 40, type: 'mascot', image: 'img/mascots/pig.jpg' },
  ];
  const selected = rewards.find(r => r.id === selectedBackgroundId);
  const className = selected ? selected.class : 'bg-default';
  document.body.className = className;

  const palette = selected && selected.palette ? selected.palette : rewards[0].palette;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-tertiary', palette.tertiary);
  root.style.setProperty('--color-quartet', palette.quartet);
  root.style.setProperty('--color-quinary', palette.quinary);
  root.style.setProperty('--color-senate', palette.Senate);
}

/**
 * Aquesta funció defineix el component de Vue de la barra lateral.
 * El template contè:
 * - El logo amb enllaç a la pagina principal
 * - La llista de navegacio entre les pagines 
 * - La mascota seleccionada amb la bombolla dels missatges
 * - L'interruptor del mode fosc/clar
 */
const SidebarComponent = {
  props: ['currentPage', 'selectedMascot', 'mascotMessage'],
  template: `
    <nav class="sidebar">
      <div class="logo-menu">
        <h2 class="logo">
          <a href="index.html">
            <img src="img/logo.png" alt="DopaTask logo" class="logo-img" />
          </a>
        </h2>
        <i class='bx bx-menu toggle-btn'></i>
      </div>
      <ul class="nav-list">
        <li>
          <a :href="'tasks.html'" :class="{ active: currentPage === 'tasks' }">
            <i class='bx bx-task'></i>
            <span class="link-name">Tasques</span>
          </a>
        </li>
        <li>
          <a :href="'habits.html'" :class="{ active: currentPage === 'habits' }">
            <i class='bx bx-hive'></i>
            <span class="link-name">Hàbits</span>
          </a>
        </li>
        <li>
          <a :href="'rewards.html'" :class="{ active: currentPage === 'rewards' }">
            <i class='bx bx-gift'></i>
            <span class="link-name">Recompenses</span>
          </a>
        </li>
      </ul>
      <div class="spacer"></div>
      <div class="mascot-display">
        <img :src="selectedMascot && selectedMascot.image ? selectedMascot.image : '/img/mascots/notMascot.jpg'" 
             :alt="selectedMascot && selectedMascot.name ? selectedMascot.name : 'No Mascot'" 
             class="mascot-image">
        <p class="mascot-name">{{ selectedMascot && selectedMascot.name ? selectedMascot.name : 'No mascota' }}</p>
        <div v-if="mascotMessage" class="speech-bubble">
          {{ mascotMessage }}
        </div>
      </div>
      <div class="mode-toggle">
        <span class="switch"></span>
        <span class="mode-text">Dark Mode</span>
      </div>
    </nav>
  `
};

/**
 * Aquesta funció gestiona les dades globals de la web com les recompenses, la mascota, etc.
 * utilitzant Vue.
 */
const sharedData = Vue.reactive({
  rewards: [
    { id: 1, name: 'DopaTask', cost: 0, type: 'background', class: 'bg-default', palette: {
      primary: '#84a6f0', secondary: '#6d88c4', tertiary: '#d1dafa', quartet: '#d0edeb', quinary: '#dcdbd2', Senate: '#2e364a'
    }},
    { id: 2, name: 'Fons fosc 2', cost: 10, type: 'background', class: 'bg-dark2', palette: {
      primary: '#758483', secondary: '#566866', tertiary: '#dbdfde', quartet: '#6f7e74', quinary: '#c2c2ab', Senate: '#292d2d'
    }},
    { id: 3, name: 'Fons fosc 3', cost: 50, type: 'background', class: 'bg-dark3', palette: {
      primary: '#643b46', secondary: '#461927', tertiary: '#bfacb0', quartet: '#71817d', quinary: '#b6b69c', Senate: '#332125'
    }},
    { id: 4, name: 'Fons clar 1', cost: 150, type: 'background', class: 'bg-light', palette: {
      primary: '#538094', secondary: '#395460', tertiary: '#e2e9ec', quartet: '#558b8b', quinary: '#d3d3c7', Senate: '#202c31'
    }},
    { id: 5, name: 'Jirafa', cost: 20, type: 'mascot', image: 'img/mascots/giraffe.jpg' },
    { id: 6, name: 'Zebra', cost: 30, type: 'mascot', image: 'img/mascots/zebra.jpg' },
    { id: 7, name: 'Porc', cost: 40, type: 'mascot', image: 'img/mascots/pig.jpg' },
  ],
  selectedMascotId: loadFromLocalStorage('selectedMascot', null),
  getSelectedMascot() {
    return this.rewards.find(reward => reward.id === this.selectedMascotId) || null;
  }
});


/**
 * App principal de Vue
 */
if (document.getElementById('app')) {
  const app = Vue.createApp({
    components: { 'sidebar-component': SidebarComponent },
    data() {
      return {
        currentPage: 'index',
        mascotMessage: ''
      };
    },
    computed: {
      selectedMascot() {
        return sharedData.getSelectedMascot();
      }
    },
    mounted() {
      applyBackgroundIndex();
    }
  }).mount('#app');
}

/**
 * Gestiona l'estat inicial i els elements com la barra lateral,
 * el mode fosc/clar, etc. quan el DOM està carregat.
 */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.toggle-btn');
  const modeToggle = document.querySelector('.mode-toggle .switch');

  let sidebarState = loadFromLocalStorage('sidebarState', 'open');
  if (sidebarState === 'close') {
    sidebar.classList.add('close');
  }

  let mode = loadFromLocalStorage('mode', 'light');
  if (mode === 'dark') {
    body.classList.add('dark');
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    saveToLocalStorage('sidebarState', sidebar.classList.contains('close') ? 'close' : 'open');
  });

  modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    saveToLocalStorage('mode', body.classList.contains('dark') ? 'dark' : 'light');
  });
});