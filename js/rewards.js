
/**
 * inicia l'app de rewards amb Vue
 */
if (document.getElementById('rewardsApp')) {
    const rewardsApp = Vue.createApp({
      components: { 'sidebar-component': SidebarComponent },
      //data defineix les dades reactives de la web
      data() {
        return {
          points: loadFromLocalStorage('points', 0),
          userName: loadFromLocalStorage('userName', 'El teu nom'),
          tempName: '',
          editingName: false,
          userGoal: loadFromLocalStorage('userGoal', 100),
          goalDate: loadFromLocalStorage('goalDate', 'A1/04/25'),
          newGoal: { points: 0, date: '' },
          profileImage: loadFromLocalStorage('profileImage', '/img/placeholder_user_icon.png'),
          rewards: sharedData.rewards,
          unlockedRewards: loadFromLocalStorage('unlockedRewards', [1]),
          selectedBackgroundId: loadFromLocalStorage('selectedBackground', 1),
          chartView: 'weekly',
          chart: null,
          mascotMessage: '',
          isDragging: false,
          isHovering: false,
          performanceData: {
            weekly: [10, 15, 8, 20, 12, 5, 18],
            monthly: [45, 60, 30, 50]
          }
        };
      },
      // computed calculen els valors derivats de les dades reactives
      computed: {
        goalProgress() {
          if (this.userGoal === 0) return 0;
          return Math.min(100, Math.round((this.points / this.userGoal) * 100));
        },
        backgrounds() {
          return this.rewards.filter(reward => reward.type === 'background');
        },
        mascots() {
          return this.rewards.filter(reward => reward.type === 'mascot');
        },
        selectedMascot() {
          return sharedData.getSelectedMascot();
        }
      },
      methods: {
        //aquests metodes permeten editar i desar el nom d'usuari
        editName() {
          this.tempName = this.userName;
          this.editingName = true;
        },
        saveName() {
          if (this.tempName.trim()) {
            this.userName = this.tempName.trim();
            saveToLocalStorage('userName', this.userName);
            this.editingName = false;
          } else {
            alert('Si us plau, introdueix un nom vàlid.');
          }
        },
        //gestio de l'edicio de l'objectiu de punts i data limit
        showGoalModal() {
          this.newGoal.points = this.userGoal;
          this.newGoal.date = this.goalDate;
          var myModal = new bootstrap.Modal(document.getElementById('goalModal'));
          myModal.show();
        },
        saveGoal() {
          if (this.newGoal.points > 0 && this.newGoal.date.trim()) {
            this.userGoal = this.newGoal.points;
            this.goalDate = this.newGoal.date.trim();
            saveToLocalStorage('userGoal', this.userGoal);
            saveToLocalStorage('goalDate', this.goalDate);
            var myModal = bootstrap.Modal.getInstance(document.getElementById('goalModal'));
            if (myModal) {
              myModal.hide();
            }
          } else {
            alert('Si us plau, introdueix un objectiu vàlid i una data límit.');
          }
        },
        //permeten carregar una imatge de perfil 
        changeProfileImage(event) {
          const file = event.target.files[0];
          if (file && file.type.startsWith('image/')) {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target.result;
              img.onload = () => {
                if (img.width >= 150 && img.height >= 150) {
                  this.profileImage = e.target.result;
                  saveToLocalStorage('profileImage', this.profileImage);
                } else {
                  alert('Si us plau, selecciona una imatge d\'almenys 150x150 píxels.');
                }
              };
            };
            reader.readAsDataURL(file);
          } else {
            alert('Si us plau, selecciona un fitxer d\'imatge vàlid.');
          }
        },
        //gestió de drag and drop de la foto
        handleDragOver(event) {
          event.preventDefault();
          this.isDragging = true;
        },
        handleDragEnter(event) {
          event.preventDefault();
          this.isDragging = true;
        },
        handleDragLeave(event) {
          event.preventDefault();
          this.isDragging = false;
        },
        handleDrop(event) {
          event.preventDefault();
          this.isDragging = false;
          const file = event.dataTransfer.files[0];
          if (file && file.type.startsWith('image/')) {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target.result;
              img.onload = () => {
                if (img.width >= 150 && img.height >= 150) {
                  this.profileImage = e.target.result;
                  saveToLocalStorage('profileImage', this.profileImage);
                } else {
                  alert('Si us plau, arrossega una imatge d\'almenys 150x150 píxels.');
                }
              };
            };
            reader.readAsDataURL(file);
          } else {
            alert('Si us plau, arrossega un fitxer d\'imatge vàlid.');
          }
        },
        //gestiona l'estat de hover dels efectes visuals 
        handleMouseEnter() {
          this.isHovering = true;
        },
        handleMouseLeave() {
          this.isHovering = false;
        },
        //permet la compra d'una recompensa utilitzant els punts
        buyReward(reward) {
          if (this.points >= reward.cost) {
            this.points -= reward.cost;
            if (!this.unlockedRewards.includes(reward.id)) {
              this.unlockedRewards.push(reward.id);
              if (reward.type === 'mascot' && !sharedData.selectedMascotId) {
                sharedData.selectedMascotId = reward.id;
                saveToLocalStorage('selectedMascot', sharedData.selectedMascotId);
              }
            }
            saveToLocalStorage('points', this.points);
            saveToLocalStorage('unlockedRewards', this.unlockedRewards);
          } else {
            alert('No tens suficients punts');
          }
        },
        //comprova si una recompensa està desbloquejada
        isUnlocked(rewardId) {
          return this.unlockedRewards.includes(rewardId);
        },
        //selecciona el fons 
        selectBackground(rewardId) {
          if (this.isUnlocked(rewardId)) {
            this.selectedBackgroundId = rewardId;
            saveToLocalStorage('selectedBackground', rewardId);
            applyBackground();
          } else {
            alert('Primer has de desbloquejar aquest fons.');
          }
        },
        //selecciona una mascota
        selectMascot(rewardId) {
          if (this.isUnlocked(rewardId)) {
            sharedData.selectedMascotId = rewardId;
            saveToLocalStorage('selectedMascot', sharedData.selectedMascotId);
          } else {
            alert('Primer has de desbloquejar aquesta mascota.');
          }
        },
        //crea un grafic amb les estadistiques
        initChart() {
          const ctx = document.getElementById('performanceChart').getContext('2d');
          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
              datasets: [{
                label: 'Punts guanyats',
                data: this.performanceData.weekly,
                backgroundColor: 'var(--color-secondary)',
                borderColor: 'var(--color-accent)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Punts',
                    color: 'var(--color-text-dark)'
                  },
                  ticks: {
                    color: 'var(--color-secondary)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Dia',
                    color: 'var(--color-text-dark)'
                  },
                  ticks: {
                    color: 'var(--color-secondary)'
                  }
                }
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: 'var(--color-secondary)'
                  }
                },
                tooltip: {
                  enabled: true,
                  mode: 'index',
                  intersect: false
                }
              }
            }
          });
        },
        //canvia la vista del gràfic entre setmanal i mensual
        updateChart(view) {
          this.chartView = view;
          if (this.chart) {
            this.chart.destroy();
          }
          const ctx = document.getElementById('performanceChart').getContext('2d');
          if (view === 'weekly') {
            this.chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
                datasets: [{
                  label: 'Punts guanyats',
                  data: this.performanceData.weekly,
                  backgroundColor: 'var(--color-secondary)',
                  borderColor: 'var(--color-accent)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Punts',
                      color: 'var(--color-text-dark)'
                    },
                    ticks: {
                      color: 'var(--color-secondary)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Dia',
                      color: 'var(--color-text-dark)'
                    },
                    ticks: {
                      color: 'var(--color-secondary)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: 'var(--color-secondary)'
                    }
                  },
                  tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                  }
                }
              }
            });
          } else if (view === 'monthly') {
            this.chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Setmana 1', 'Setmana 2', 'Setmana 3', 'Setmana 4'],
                datasets: [{
                  label: 'Punts guanyats',
                  data: this.performanceData.monthly,
                  backgroundColor: 'var(--color-secondary)',
                  borderColor: 'var(--color-accent)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Punts',
                      color: 'var(--color-text-dark)'
                    },
                    ticks: {
                      color: 'var(--color-text-dark)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Setmana',
                      color: 'var(--color-text-dark)'
                    },
                    ticks: {
                      color: 'var(--color-text-dark)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: 'var(--color-text-dark)'
                    }
                  },
                  tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                  }
                }
              }
            });
          }
        }
      },
      mounted() {
        applyBackground();
        this.initChart();
      }
    }).mount('#rewardsApp');
  }