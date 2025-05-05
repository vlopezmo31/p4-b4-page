/**
 * Inicia l'app habitsApp amb Vue.
 */

if (document.getElementById('habitsApp')) {

    const habitsApp = Vue.createApp({
      components: { 'sidebar-component': SidebarComponent },
      // data defineix les dades de l'app
      data() {
        return {
          habits: loadFromLocalStorage('habits', [
            { name: 'Estudiar 1 hora al dia', completed: false, streak: 3, reminder: '09:00' },
            { name: 'Beure 1 litre d’aigua', completed: true, streak: 6, reminder: '12:00' },
            { name: 'Fer les necessitats humanes', completed: false, streak: 0, reminder: null },
            { name: 'Treure al gos al carrer', completed: false, streak: 2, reminder: '18:00' },
          ]),
          notificationsEnabled: loadFromLocalStorage('notificationsEnabled', true),
          mascotMessage: '',
          newHabitName: '',
          newHabitReminder: null,
          editHabitIndex: null,
          editHabitName: '',
          editHabitReminder: null,
        };
      },
      // computed retorna la mascota seleccionada en sharedData
      computed: {
        selectedMascot() {
          return sharedData.getSelectedMascot();
        }
      },
      
      methods: {
        /**
         * actualitza el streak d'un hàbit quan es completa un dia consecitiu
         * @param {} index 
         */
        checkHabitStreak(index) {
          const habit = this.habits[index];
          if (habit.completed) {
            habit.streak += 1;
            if (habit.streak === 3) {
              this.showRewardNotification();
              this.showConfetti();
            }
          } else {
            habit.streak = 0;
          }
          saveToLocalStorage('habits', this.habits);
        },
        /**
         * mostra el missatge de que s'han guanyat 10 punts quan es completen tots els habits
         */
        showRewardNotification() {
          this.mascotMessage = '+10 punts extra! 🎉';
          setTimeout(() => {
            this.mascotMessage = '';
          }, 3000);
        },
        /**
         * mostra una animacióo de confetti quan es completen tots els hàbits
         */
        showConfetti() {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        },
        /**
         * afageix un habit a la llista
         */
        addHabit() {
          if (this.newHabitName.trim()) {
            this.habits.push({
              name: this.newHabitName,
              completed: false,
              streak: 0,
              reminder: this.newHabitReminder || null
            });
            saveToLocalStorage('habits', this.habits);
            this.mascotMessage = 'Hàbit afegit correctament!';
            setTimeout(() => {
              this.mascotMessage = '';
            }, 3000);
            this.newHabitName = '';
            this.newHabitReminder = null;
          }
        },
        /**
         * edita un hàbit existent
         * @param {} index 
         */
        editHabit(index) {
          this.editHabitIndex = index;
          this.editHabitName = this.habits[index].name;
          this.editHabitReminder = this.habits[index].reminder;
        },
        /**
         * desa els canvis si s'ha editat un hàbit
         */
        saveHabit() {
          if (this.editHabitIndex !== null && this.editHabitName.trim()) {
            this.habits[this.editHabitIndex].name = this.editHabitName;
            this.habits[this.editHabitIndex].reminder = this.editHabitReminder || null;
            saveToLocalStorage('habits', this.habits);
            this.editHabitIndex = null;
            this.editHabitName = '';
            this.editHabitReminder = null;
          }
        },
        /**
         * elimina un hàbit
         * @param {*} index 
         */
        deleteHabit(index) {
          this.habits.splice(index, 1);
          saveToLocalStorage('habits', this.habits);
        },
        /**
         * mostra una notificació recordant complir un hàbit
         * @returns 
         */
        checkReminders() {
          if (!this.notificationsEnabled) return;
          const now = new Date();
          const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          this.habits.forEach((habit, index) => {
            if (habit.reminder && habit.reminder === currentTime && !habit.completed) {
              this.mascotMessage = `És hora de "${habit.name}"! ⏰`;
              setTimeout(() => {
                this.mascotMessage = '';
              }, 3000);
            }
          });
        }
      },
      //desa els canvis de notificationsEnabled a localStorage
      watch: {
        notificationsEnabled(newVal) {
          saveToLocalStorage('notificationsEnabled', newVal);
        }
      },
      //executa les accions de cada component que es monta
      mounted() {
        applyBackground();
        setInterval(this.checkReminders, 60000);
        this.checkReminders();
      }
    }).mount('#habitsApp');
  }