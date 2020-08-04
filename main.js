const pomodoroTimer = document.querySelector('#pomodoro-timer')

const playPauseButton = document.querySelector('#pomodoro-start')
const stopButton = document.querySelector('#pomodoro-stop')
const resetButton = document.querySelector('#pomodoro-reset')

const modeWork = document.querySelector('#update-work-session')
const modeBreak = document.querySelector('#update-break-session')

var can = document.querySelector('#canvas')
const posX = can.width/2
const posY = can.height/2
var c = can.getContext('2d')
var degrees = 0

let type = 'Work'
let timeSpentInCurrentSession = 0
let currentTaskLabel = document.querySelector('#pomodoro-clock-task') 

let workSessionDuration = 1500
let currentTimeLeftSession = 1500
let breakSessionDuration = 300

let contBreakSessions = 1
let incremento

let isClockStopped = true
let isClockRunning = false
let mode = true
let isDrawRunning = true

playPauseButton.addEventListener('click', () => {
    toggleClock()
})

stopButton.addEventListener('click', () => {
    toggleClock(true)
})

resetButton.addEventListener('click', () => {
    resetTimer()
})

// aplicar os timers corretamente
modeBreak.addEventListener('click', () => {
    //display break timer
    currentTimeLeftSession = breakSessionDuration
    displayCurrentTimeLeftSession(currentTimeLeftSession)
    mode = false
    disableButtons()
})

modeWork.addEventListener('click', () => {
    //display work timer
    currentTimeLeftSession = workSessionDuration
    displayCurrentTimeLeftSession(currentTimeLeftSession)
    mode = true
    disableButtons()
})

window.onload = () => {
    displayCurrentTimeLeftSession(currentTimeLeftSession)
    drawCircleBar()
    stopButton.disabled = true
}

const toggleClock = (reset) => {
    // disableClockActions()
    incremento = 360/currentTimeLeftSession
    if (reset) {
        // Parar o relogio
        stopClock()
        drawCircleBar()
        stopButton.disabled = true
        playPauseButton.innerText = "Start"
        // currentTaskLabel.value = ""
        degrees = 0
    }
    else {
        if (isClockRunning === true) {
            // Pause the timer
            isClockRunning = false
            // hideClockActions()
            // isClockStopped = true
            clearInterval(clockTimer)
            // clearInterval(clockDraw)
            playPauseButton.innerText = "Start"
        }
        else {
            isClockStopped = false
            disableClockActions()
            isClockRunning = true
            playPauseButton.innerText = "Pause"
            // hideClockActions()
            stopButton.disabled = false
            // start the timer
            clockTimer = setInterval(() => {
                stepDown()
                if (isDrawRunning) drawCircleBarProgress(incremento)
                // alteraçoes p deixar o relogio c mais fluidez
                // alterar p milisegundo assim a ideia de movimento fica melhor :)
                // if (isDrawRunning) {
                //     clockDraw = setInterval(() => {
                //         drawCircleBarProgress()
                //     }, 100)
                // }
            }, 1000)
        }
    }
}

const displayCurrentTimeLeftSession = (time) => {
    // const secondsLeft = currentTimeLeftSession
    const secondsLeft = time
    let result = ''

    // tratar os segundos
    const seconds = secondsLeft % 60
    const minutes = parseInt(secondsLeft / 60) % 60
    let hours = parseInt(secondsLeft / 3600)

    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time
    }

    if (hours > 0) result += `0${hours}:`

    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`

    pomodoroTimer.innerText = result.toString();
}

const stopClock = () => {
    displaySessionLog(type)
    clearInterval(clockTimer)
    // clearInterval(clockDraw) // teste
    isClockStopped = true
    disableClockActions()
    isClockRunning = false
    currentTimeLeftSession = workSessionDuration

    displayCurrentTimeLeftSession(currentTimeLeftSession)
    c.clearRect(0, 0, can.width, can.height)
    type = 'Work'
    timeSpentInCurrentSession = 0
}

const stepDown = () => {
    // controla o tempo restante da sessao
    if (currentTimeLeftSession > 0) {
        isDrawRunning = true
        currentTimeLeftSession--
        timeSpentInCurrentSession++
    } else if (currentTimeLeftSession === 0) {

        isDrawRunning = false
        if (type === 'Work') {
            currentTimeLeftSession = breakSessionDuration
            longTimeBreakSession()
            displaySessionLog('Work')
            type = 'Break'
            currentTaskLabel.value = 'Break'
            currentTaskLabel.disabled = true
        } else {
            currentTimeLeftSession = workSessionDuration
            type = 'Work'
            contBreakSessions += 1
            if (currentTaskLabel.value === 'Break') {
                currentTaskLabel.value = 'Work'
                currentTaskLabel.disabled = false
            }
            displaySessionLog('Break')
        }
        timeSpentInCurrentSession = 0
        incremento = 360/currentTimeLeftSession
    }
    displayCurrentTimeLeftSession(currentTimeLeftSession)
}

const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#pomodoro-sessions')
    const li = document.createElement('li')
    li.classList.add('session-log')
    // botar uns ifs aqui
    let sessionlabel
    let workSessionLabel
    if (type === 'Work') {
        sessionlabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
        workSessionLabel = sessionlabel
        li.style.backgroundColor = '#bb1'
    } else if (type === 'Break' && contBreakSessions == 1) {
        // long break
        sessionlabel = 'Long Break'
        li.style.backgroundColor = '#647687'
    } else {
        // break
        sessionlabel = 'Break'
        li.style.backgroundColor = '#bb9'
    }
    

    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'
    const text = document.createTextNode(`${sessionlabel} : ${elapsedTime} min`)
    li.appendChild(text)
    sessionsList.appendChild(li)
    const pomodoroInfo = document.querySelector('#pomodoro-info')
    pomodoroInfo.classList.remove('hide')
    
}

const drawCircleBar = () => {
    // o fundo cinza do relógio
    // when stop the timer call this
    // 
    c.lineCap = 'round'
    // clearRect limpa o canvas
    c.clearRect(0, 0, can.width, can.height)
    c.beginPath()
    c.strokeStyle = '#b1b1b1'
    c.lineWidth = '10'
    c.arc(posX, posY, 150, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360))
    c.stroke()
    degrees = 0
}

const drawCircleBarProgress = (incremento) => {
    // to usando segundos aqui
    // quero usar milisegundos
    // var incremento = (type === 'Work') ? 360/(workSessionDuration * 10) : 360/(breakSessionDuration * 10)

    degrees += incremento

    c.beginPath()
    c.strokeStyle = type === 'Work' ? '#8e24aa' :'#ffeb3b'
    c.lineWidth = '10'
    c.arc(posX, posY, 150, (Math.PI/180)*270, (Math.PI/180) * (270+degrees))
    c.stroke()
    if (degrees >= 360) {
        degrees = 0
    }
}

const playAudioTimerEnd = () => {
    // ativar um som quando terminar as sessões
    var audio = new Audio('audio_1.mp3')
    audio.play()
    audio.onended = function() {
        audio.remove()
        console.log("ending song celebration")
    }
}

const setUpdatedTimers = (button) => {
    // isso precisa funcionar tanto para o break quanto para a work

    if (button === 1) {
        // min++
        currentTimeLeftSession += 60
        displayCurrentTimeLeftSession(currentTimeLeftSession)
    } else if (button === 2) {
        // min--
        currentTimeLeftSession -= 60
        displayCurrentTimeLeftSession(currentTimeLeftSession)
    } else if (button == 3) {
        // sec++
        currentTimeLeftSession += 1
        displayCurrentTimeLeftSession(currentTimeLeftSession)
    } else {
        // sec--
        currentTimeLeftSession -= 1
        displayCurrentTimeLeftSession(currentTimeLeftSession)
    }
    // verificar
    disableButtons()
    if (mode) {
        workSessionDuration = currentTimeLeftSession
    } else breakSessionDuration = currentTimeLeftSession
}

const disableButtons = () => {
    // verificar as condicoes p butons de aumento
    //e decremento estarem desabilitados ou n
    var buttonMinUp = document.querySelector('#min-up')
    var buttonMinDown = document.querySelector('#min-down')
    var buttonSecUp = document.querySelector('#sec-up')
    var buttonSecDown = document.querySelector('#sec-down')

    if (currentTimeLeftSession + 60 <= 3600) {
        // buttonMinUp.disabled = false
        buttonMinUp.classList.remove('disable')
    // } else buttonMinUp.disabled = true
    } else buttonMinUp.classList.add('disable')
    if (currentTimeLeftSession + 1 <= 3600) {
        // buttonSecUp.disabled = false
        buttonSecUp.classList.remove('disable')
    } else buttonSecUp.classList.add('disable')
    if (currentTimeLeftSession - 60 >= 0) {
        buttonMinDown.classList.remove('disable')
    } else buttonMinDown.classList.add('disable')
    if (currentTimeLeftSession - 1 >= 0) {
        buttonSecDown.classList.remove('disable')
    } else buttonSecDown.classList.add('disable')
}

// resetar o relogio
const resetTimer = () => {
    workSessionDuration = 1500
    breakSessionDuration = 300
    currentTimeLeftSession = 1500
    displayCurrentTimeLeftSession(currentTimeLeftSession)
    isClockRunning = false
    isClockStopped = true
    disableClockActions()
    timeSpentInCurrentSession = 0
    type = 'Work'
    // n posso dar reset de primeira
    clearInterval(clockTimer)
    c.clearRect(0, 0, can.width, can.height)
    drawCircleBar()
    stopButton.disabled = true
    playPauseButton.innerText = 'Play'
    degrees = 0
    contBreakSessions = 1
}

const disableClockActions = () => {
    // refazer isso aqui
    // desabilitar o work/break e o "enter task label"
    if (isClockStopped) {
        // o relogio esta parado, td precisa estar habilitado
        modeWork.disabled = false
        modeBreak.disabled = false
    } else {
        modeWork.disabled = true
        modeBreak.disabled = true
    }
}


// isso aqui ta ok
const longTimeBreakSession = () => {
    // o quarto break session é um long break session
    if (contBreakSessions === 4) {
        currentTimeLeftSession = 600
        contBreakSessions = 1
        // aumenta em cada work session :) 
    }
}