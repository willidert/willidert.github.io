# Pomodoro APP

## Introdução

Descobri um [repo](https://www.youtube.com/watch?v=TNzCfgwIDCY) com alguns desafios para treinar. Esse é um deles, um relógio de pomodoro. Existem muitos por aí, no meu adicionei uma barra circular de progresso :)

## User Stories

-   [x] User can see a timer for 25 minutes - the **working** session
-   [x] After the **working** session is over, the User can see a timer for 5 minutes - the **break** session
-   [x] User can _start_ / _pause_, _stop_ and _reset_ the timers

## Bonus features

-   [x] User can hear a sound playing when the timer hits `00:00` - denoting that the session has ended
-   [x] User can change / customize the minutes in both sessions before starting
-   [x] User can set a **long break** session of 10 minutes. This will be activated every 4th **break** session

## Resolver

- [x] abrir o circulo do canvas
- [x] colocar o temporizador dentro do canvas
- [x] estilizar
- [x] mandar p análise  do pessoal
- [x] botar no github
- [x] adicionar regra p relógio (parte cinza aparecer quando a página é carregada , junto com o timer em 00:00)
- [x] botar os botões de incremento no relógio junto com os numeros
- [x] corrigir break q n reseta o canvas
- [x] duração do break n altera com o input (Esse aqui ta pegando oh. Preciso pensar com mais calma)
- [x] arrumar o displaySessionLog que tava mostrando sempre "< 1 min"
- [x] arrumar erros de logica no sessionLog (mostrar o label 
correto)
- [x] Redesenhar o canvas no break
- [x] Canvas descompassado com o timer (esse aqui deu trabalho demais)
- [x] Arrumar os butoes no lugar certo do relogio
- [ ] mostrar o titulo da tarefa junto com o relogio
- [ ] meter um faded aqui p dar um efeito legal
- [ ] arrumar o css dos buttons
- [x] arrumar o js das novas alterações
- [ ] corrigir os ajustes da Nath
- [ ] corrigir bug do setUpdatedTimers q inicia apartir do currentTime e não da workSessionDuration
- [ ] arrumar layout para pc:

```
+------------------+
|  ###  ####  #### |
+------------------+
```