new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.saludJugador = 100
            this.saludMonstruo = 100
            this.turnos = []
            this.hayUnaPartidaEnJuego = true
        },
        atacar: function () {
            var daño = this.calcularHeridas(this.rangoAtaque)
            if (daño >= this.saludMonstruo) {
                this.saludMonstruo = 0
                this.registrarEvento({ esJugador: true, text: `Golpeas al monstruo por ${daño}% - El Monstruo fue derrotado` })
            } else {
                this.saludMonstruo -= daño
                this.registrarEvento({ esJugador: true, text: `Golpeas al monstruo por ${daño}%` })
            }
            this.ataqueDelMonstruo()
        },
        ataqueEspecial: function () {
            var daño = this.calcularHeridas(this.rangoAtaqueEspecial)
            if (daño >= this.saludMonstruo) {
                this.saludMonstruo = 0
                this.registrarEvento({ esJugador: true, text: `Tu Ataque especial golpea por ${daño}% - El Monstruo fue derrotado` })
            } else {
                this.saludMonstruo -= daño
                this.registrarEvento({ esJugador: true, text: `Tu Ataque especial golpea por ${daño}%` })
            }
            this.ataqueDelMonstruo()
        },
        curar: function () {
            const heal = 10
            if (this.saludJugador <= 90) {
                this.saludJugador += heal
            }
            else {
                this.saludJugador = 100
            }
            this.registrarEvento({ esJugador: true, text: `El jugador se cura por ${heal}%` })
            this.ataqueDelMonstruo()
        },
        async registrarEvento(evento) {
            this.turnos.unshift({
                esJugador: evento.esJugador,
                text: evento.text
            })
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false
        },
        ataqueDelMonstruo: function () {
            if (this.verificarGanador()) { return }
            var daño = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            if (daño > this.saludJugador) {
                this.saludJugador = 0
                this.registrarEvento({ esJugador: false, text: `El Monstruo golpea por ${daño}% - EL Jugador fue derrotado!` })
            } else {
                this.saludJugador -= daño
                this.registrarEvento({ esJugador: false, text: `El Monstruo golpea por ${daño}%` })
            }
            if (this.verificarGanador()) { return }
        },
        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * Math.max.apply(null, rango)) + 1, Math.min.apply(null, rango))
        },
        verificarGanador: function () {
            var msg
            if (this.saludMonstruo <= 0) { msg = "Ganaste" }
            else if (this.saludJugador <= 0) { msg = "Perdiste" }
            if (msg) {
                if (confirm(`${msg}! jugar de nuevo?`)) {
                    this.empezarPartida()
                } else {
                    this.terminarPartida()
                }
                return true
            }
            else {
                return false
            }
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});