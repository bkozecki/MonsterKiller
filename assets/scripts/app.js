const playerMaxAttack = 10;
const monsterMaxAttack = 12;
const strongAttack = 17;
const healValue = 20;

const MODE_ATTACK = 'ATTACK'; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; // MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt("Choose your life", "100");

let maxHealth = parseInt(enteredValue);
let currentPlayerHealth = maxHealth;
let currentMonsterHealth = maxHealth;
let hasBonusLife = true;
let battleLog = [];

if(isNaN(enteredValue) || maxHealth <= 0){
    maxHealth = 100;
}
adjustHealthBars(maxHealth);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth
    };
    switch (ev) {
      case LOG_EVENT_PLAYER_ATTACK:
        logEntry.target = 'MONSTER';
        break;
      case LOG_EVENT_PLAYER_STRONG_ATTACK:
        logEntry = {
          event: ev,
          value: val,
          target: 'MONSTER',
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
      case LOG_EVENT_MONSTER_ATTACK:
        logEntry = {
          event: ev,
          value: val,
          target: 'PLAYER',
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
      case LOG_EVENT_PLAYER_HEAL:
        logEntry = {
          event: ev,
          value: val,
          target: 'PLAYER',
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
      case LOG_EVENT_GAME_OVER:
        logEntry = {
          event: ev,
          value: val,
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
      default:
        logEntry = {};
    } 
    battleLog.push(logEntry);
}

function endround(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(monsterMaxAttack);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert("You've got a bonus life, lucky You!")
    }
   if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
       alert('You won!');
       writeToLog(
           LOG_EVENT_GAME_OVER,
           "PLAYER WON",
           currentMonsterHealth,
           currentPlayerHealth
        )
   } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
       alert('You lost');
       writeToLog(
        LOG_EVENT_GAME_OVER,
        "MONSTER WON",
        currentMonsterHealth,
        currentPlayerHealth
     )
   } else if (currentMonsterHealth <=0 && currentPlayerHealth <= 0) {
       alert("It's a Draw");
       writeToLog(
        LOG_EVENT_GAME_OVER,
        "A DRAW",
        currentMonsterHealth,
        currentPlayerHealth
     )
}
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0){
        reset();
    }
}
function reset(){
    currentPlayerHealth = maxHealth;
    currentMonsterHealth = maxHealth;
    resetGame(maxHealth);
}
function attackMonster(mode){
    let logEvent;
    let maxDamage; 
    if(mode === "ATTACK"){
        maxDamage = playerMaxAttack;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === "STRONG_ATTACK"){
        maxDamage = strongAttack;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    };
    writeToLog(
        logEvent,
        maxDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    const damage = dealMonsterDamage(strongAttack);
    currentMonsterHealth -= damage;
    endround();
}
function attack(){
 attackMonster("ATTACK");
}

function strongAttackHd(){
    attackMonster("STRONG_ATTACK");

   }
   function healPlayerHandler(){
    let hEAL_VL;
    if( currentPlayerHealth >= maxHealth - healValue) {
        alert("You can't heal any more");
        hEAL_VL = maxHealth - currentPlayerHealth;
    } else {
        hEAL_VL = healValue;
    }
    increasePlayerHealth(healValue);
    currentMonsterHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        hEAL_VL,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endround();
   }

   function printLogHandler(){
    console.log(battleLog)
    alert("Open the console!")
  }

attackBtn.addEventListener('click', attack);
strongAttackBtn.addEventListener('click', strongAttackHd);
healBtn.addEventListener('click',healPlayerHandler )
logBtn.addEventListener('click', printLogHandler)