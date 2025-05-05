
/**
 * inicia l'app de tasks amb Vue
 */
if (document.getElementById('tasksApp')) {
    const tasksApp = Vue.createApp({
      components: { 'sidebar-component': SidebarComponent },
      //data defineix les dades reactives de la web
      data() {
        return {
          points: loadFromLocalStorage('points', 0),
          categories: loadFromLocalStorage('categories', [
            { name: 'Acadèmic', color: '#1A3C5A' },
            { name: 'Laboral', color: '#66CC99' },
            { name: 'Personal', color: '#FF9999' }
          ]),
          tasks: loadFromLocalStorage('tasks', [
            { id: 1, name: 'Estudiar per l\'examen', score: 5, category: 'Acadèmic', completed: false },
            { id: 2, name: 'Enviar correu al cap', score: 3, category: 'Laboral', completed: false },
            { id: 3, name: 'Comprar llet', score: 2, category: 'Personal', completed: false },
          ]),
          activeTab: 'general',
          newTask: { name: '', score: 0, category: '' },
          newCategory: { name: '', color: '#000000' },
          dailyChallenge: loadFromLocalStorage('dailyChallenge', ''),
          challengeCompleted: loadFromLocalStorage('challengeCompleted', false),
          mascotMessage: '',
        };
      },
      // calcul de valors derivats de les dades reactives
      computed: {
        tabs() {
          return ['general', ...this.categories.map(cat => cat.name)];
        },
        filteredTasks() {
          return this.tasks.filter(task => task.category === this.activeTab);
        },
        selectedMascot() {
          return sharedData.getSelectedMascot();
        }
      },
      methods: {
        // metodes per afegir una tasca o categoria
        showAddTaskModal() {
          var myModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
          myModal.show();
        },
        showAddCategoryModal() {
          var myModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
          myModal.show();
        },
        //afageix una nova tasca a la llista
        addTask() {
          if (this.newTask.name && this.newTask.category && this.newTask.score > 0) {
            const newId = this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
            this.tasks.push({ id: newId, ...this.newTask, completed: false });
            this.newTask = { name: '', score: 0, category: '' };
            saveToLocalStorage('tasks', this.tasks);
            var myModal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
            if (myModal) {
              myModal.hide();
            }
          } else {
            alert('Si us plau, completa tots els camps i assegura\'t que la puntuació sigui major a 0.');
          }
        },
        //afageix una nova categoria a la llista
        addCategory() {
          if (this.newCategory.name && this.newCategory.color && !this.categories.some(cat => cat.name === this.newCategory.name)) {
            this.categories.push({ ...this.newCategory });
            this.newCategory = { name: '', color: '#000000' };
            saveToLocalStorage('categories', this.categories);
            const modalElement = document.getElementById('addCategoryModal');
            const myModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            myModal.hide();
          } else {
            alert('Si us plau, introdueix un nom de categoria vàlid, un color vàlid i no duplicat.');
          }
        },
        //actualitza els punts quan una tasca es marca o desmarca com a completada
        updatePoints(task) {
          if (task.completed) {
            this.points += task.score;
            this.mascotMessage = 'Tasca realitzada!!';
            setTimeout(() => {
              this.mascotMessage = '';
            }, 3000);
          } else {
            this.points -= task.score;
          }
          saveToLocalStorage('points', this.points);
          saveToLocalStorage('tasks', this.tasks);
          this.checkChallengeCompletion();
        },
        //elimina una tasca
        deleteTask(taskId) {
          if (confirm('Estàs segur/a que vols eliminar aquesta tasca?')) {
            const taskIndex = this.tasks.findIndex(task => task.id == taskId);
            if (taskIndex !== -1) {
              const task = this.tasks[taskIndex];
              if (task.completed) {
                this.points -= task.score;
              }
              this.tasks.splice(taskIndex, 1);
              saveToLocalStorage('points', this.points);
              saveToLocalStorage('tasks', this.tasks);
            }
          }
        },
        //retorna el color associat a una categoria
        getCategoryColor(categoryName) {
          const category = this.categories.find(cat => cat.name === categoryName);
          return category ? category.color : '#000000';
        },
        //carrega el repte diari
        loadDailyChallenge() {
          if (!this.dailyChallenge || this.isNewDay()) {
            const challenges = [
              'Completa 3 tasques avui!',
              'Completa una tasca de la categoria Acadèmic!',
              'Completa 5 tasques de qualsevol categoria!',
              'Completa una tasca laboral!',
              'Fes una nova tasca personal avui!'
            ];
            const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
            this.dailyChallenge = randomChallenge;
            this.challengeCompleted = false;
            saveToLocalStorage('dailyChallenge', this.dailyChallenge);
            saveToLocalStorage('challengeCompleted', this.challengeCompleted);
            saveToLocalStorage('lastChallengeDate', new Date().toDateString());
          }
        },
        //determina si ha passat un dia des de l'ultim repte
        isNewDay() {
          const lastDate = loadFromLocalStorage('lastChallengeDate', '');
          const today = new Date().toDateString();
          return lastDate !== today;
        },
        //comprova si s'ha completat el repte diari
        checkChallengeCompletion() {
          if (this.challengeCompleted) return;
  
          if (this.dailyChallenge.includes('3 tasques') && this.tasks.filter(t => t.completed).length >= 3) {
            this.completeChallenge();
          } else if (this.dailyChallenge.includes('Acadèmic') && this.tasks.some(t => t.completed && t.category === 'Acadèmic')) {
            this.completeChallenge();
          } else if (this.dailyChallenge.includes('5 tasques') && this.tasks.filter(t => t.completed).length >= 5) {
            this.completeChallenge();
          } else if (this.dailyChallenge.includes('laboral') && this.tasks.some(t => t.completed && t.category === 'Laboral')) {
            this.completeChallenge();
          } else if (this.dailyChallenge.includes('personal') && this.tasks.some(t => t.completed && t.category === 'Personal')) {
            this.completeChallenge();
          }
        },
        //marca el repte com a completat i dona 10 punts
        completeChallenge() {
          this.challengeCompleted = true;
          this.points += 10;
          saveToLocalStorage('points', this.points);
          saveToLocalStorage('challengeCompleted', this.challengeCompleted);
        },
      },
      mounted() {
        applyBackground();
        this.loadDailyChallenge();
      }
    }).mount('#tasksApp');
  }