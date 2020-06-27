const pomodoroTimer = document.querySelector('#pomodoro-timer')

const startPauseButton = document.querySelector('#pomodoro-start')
// const pauseButton = document.querySelector('#pomodoro-pause')
const stopButton = document.querySelector('#pomodoro-stop')
var can = document.querySelector('#canvas')
const posX = can.width/2
const posY = can.height/2
var c = can.getContext('2d')
var degrees = 0

let updateWorkSessionDuration
let updateBreakSessionDuration
let workDurationInput = document.querySelector('#input-work-duration')
let breakDurationInput = document.querySelector('#input-break-duration')

workDurationInput.value = '25'
breakDurationInput.value = '5'

let type = 'Work'
let timeSpentInCurrentSession = 0
let currentTaskLabel = document.querySelector('#pomodoro-clock-task') 

workDurationInput.addEventListener('input', () => {
    updateWorkSessionDuration = minutesToSeconds(workDurationInput.value)
})

breakDurationInput.addEventListener('input', () => {
    updateBreakSessionDuration = minutesToSeconds(breakDurationInput.value)
})

// in seconds = 25min
let workSessionDuration = 1500
let currentTimeLeftSession = 1500

// in seconds = 5 min
let breakSessionDuration = 300

// controlar o timer
let isClockStopped = true
let isClockRunning = false

// Start
startPauseButton.addEventListener('click', () => {
    toggleClock()
})

// Stop
stopButton.addEventListener('click', () => {
    toggleClock(true)
})

window.onload = () => {
    displayCurrentTimeLeftSession()
    drawCircleBar()
    stopButton.disabled = true
}

const toggleClock = (reset) => {
    if (reset) {
        // Stop the timer
        stopClock()
        displayCurrentTimeLeftSession()
        drawCircleBar()
        stopButton.disabled = true
        startPauseButton.innerText = "Start"
        // currentTaskLabel.value = ""
        degrees = 0
    }
    else {
        if (isClockRunning === true) {
            // Pause the timer
            isClockRunning = false
            isClockStopped = true
            clearInterval(clockTimer)
            startPauseButton.innerText = "Start"
        }
        else {
            // Start the timer
            if (isClockStopped) {
                // atualizar a duração da tarefa
                if (currentTimeLeftSession === workSessionDuration || currentTimeLeftSession === breakSessionDuration){
                    // preciso verificar a ordem disso aqui
                    console.log("updated at begin")
                    setUpdatedTimers()
                }
                isClockStopped = false
                isClockRunning = true
                startPauseButton.innerText = "Pause"
                stopButton.disabled = false
                // start the timer
                clockTimer = setInterval(() => {
                    stepDown()
                    drawCircleBarProgress()
                }, 1000)

                // alteraçoes p deixar o relogio c mais fluidez
                // alterar p milisegundo assim a ideia de movimento fica melhor :)
                // clockDraw = setInterval(() => {
                //     drawCircleBarProgress()
                // }, 100)
            }
        }
    }
}

const displayCurrentTimeLeftSession = () => {
    const secondsLeft = currentTimeLeftSession
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
    setUpdatedTimers() // esse segundo aqui q atualiza o timer do break
    displaySessionLog(type)
    clearInterval(clockTimer)
    isClockStopped = true
    isClockRunning = false
    currentTimeLeftSession = workSessionDuration

    displayCurrentTimeLeftSession()
    c.clearRect(0, 0, can.width, can.height)
    type = 'Work'
    timeSpentInCurrentSession = 0
}

const stepDown = () => {
    if (currentTimeLeftSession > 0) {
        currentTimeLeftSession--
        timeSpentInCurrentSession++
    } else if (currentTimeLeftSession === 0) {
        // timeSpentInCurrentSession = 0
        if (type === 'Work') {
            currentTimeLeftSession = breakSessionDuration // precisaria atualizar aqui :/
            // o desenho no canvas fica adiantado a ideia de tempo do timer :x
            // drawCircleBar()
            // console.log("limpo")
            displaySessionLog('Work')
            type = 'Break'
            currentTaskLabel.value = 'Break'
            currentTaskLabel.disabled = true
        } else {
            currentTimeLeftSession = workSessionDuration
            // drawCircleBar()
            // console.log("limpo")
            type = 'Work'
            if (currentTaskLabel.value === 'Break') {
                currentTaskLabel.value = 'Work'
                currentTaskLabel.disabled = false
            }
            displaySessionLog('Break')
        }
        timeSpentInCurrentSession = 0
        drawCircleBar()
    }
    displayCurrentTimeLeftSession()
}

const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#pomodoro-sessions')
    const li = document.createElement('li')
    let sessionlabel
    let workSessionLabel
    if (type === 'Work') {
        sessionlabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
        workSessionLabel = sessionlabel
    } else {
        sessionlabel = 'Break'
    }
    

    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'
    const text = document.createTextNode(`${sessionlabel} : ${elapsedTime} min`)
    li.appendChild(text)
    sessionsList.appendChild(li)
}

const displayButtons = () => {
    if (isClockStopped) {

    }
}

const minutesToSeconds = mins => {
    return mins * 60
}

const setUpdatedTimers = () => {

    // if (isClockStopped) {
    //     console.log("aqui")
    //     workSessionDuration = updateWorkSessionDuration
    //     breakSessionDuration = updateBreakSessionDuration
    // }
    // tinha uma verificação de type aqui mas eu removi pq quero atualizar os timers  juntos :/
    // isso aqui ta errado
    if (type === "Work") {
        // atualizar o timer
        currentTimeLeftSession = updateWorkSessionDuration ? updateWorkSessionDuration : workSessionDuration
        workSessionDuration = currentTimeLeftSession
    }
    else {
        currentTimeLeftSession = updateBreakSessionDuration ? updateBreakSessionDuration : breakSessionDuration
        breakSessionDuration = currentTimeLeftSession
    }
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

const drawCircleBarProgress = () => {
    // to usando segundos aqui
    // quero usar milisegundos
    // var incremento = (type === 'Work') ? 360/(workSessionDuration * 10) : 360/(breakSessionDuration * 10)

    var incremento = (type === 'Work') ? 360/workSessionDuration : 360/breakSessionDuration

    degrees += incremento
    c.beginPath()
    // adicionar mudanças de cores verde -> amarelo -> vermelho
    c.strokeStyle = '#6712ca'
    c.lineWidth = '10'
    c.arc(posX, posY, 150, (Math.PI/180)*270, (Math.PI/180) * (270+degrees))
    c.stroke()
    if (degrees >= 360) {
        degrees = 0
    }
    // console.log(degrees)
}
