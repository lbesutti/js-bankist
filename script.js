'use strict'
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/* function display (corrente){
    corrente.movementsDates.forEach(element => {
        const display= new Date(element)
           const day = `${display.getDate()}`.padStart(2, 0);
           const month = `${display.getMonth() + 1}`.padStart(2, 0);
           const year = display.getFullYear()
           console.log(`${day}/${month}/${year}`)
           
       
       })
} */
function displayMovements(acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements

    movs.forEach((mov, i) => {

        let type;
        if (mov > 0) {
            type = 'deposit'
        } else {
            type = 'withdrawal'
        }
       const date = new Date(acc.movementsDates[i]);
       const day = `${date.getDate()}`.padStart(2, 0);
       const month = `${date.getMonth() + 1}`.padStart(2, 0);
       const year = date.getFullYear()
       const displayDate = `${day}/${month}/${year}`
    
        const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}</div>
    </div>
  `
        containerMovements.insertAdjacentHTML('afterbegin', html)   //guarda su internet

    });

}



(function createUserNames(accs) {
    accs.forEach(acc => {
        acc.username = acc.owner.toLowerCase().split(' ').map(element => { return element[0] }).join('')
    })

}(accounts))
//avanti uno

let calcPrintBalance = function (acc) {
    acc.balance = acc.movements.reduce((accumulatore, element) => { return accumulatore + element });
    labelBalance.textContent = `${acc.balance} EUR`
}

function calcDisplaySummary(movements) {
    const incomes = movements.movements
        .filter(element => element > 0)
        .reduce((accumulatore, elemento) => { return accumulatore + elemento });
    labelSumIn.textContent = `${incomes.toFixed(2)} £`;

    const outcomes = movements.movements
        .filter(element => element < 0)
        .reduce((accumulatore, elemento) => accumulatore + elemento, 0)
    labelSumOut.textContent = `${outcomes.toFixed(2) * -1} £`;

    const interest = movements.movements
        .filter(element => element > 0)
        .map(element => (element * movements.interestRate) / 100)
        .filter(element => element >= 1)
        .reduce((accumulatore, elemento) => accumulatore + elemento, 0)
        ;
    labelSumInterest.textContent = `${interest.toFixed(2)} £`
}
function updateUi(acc) {
    displayMovements(acc)
    calcPrintBalance(acc)
    calcDisplaySummary(acc)
}
let currentAccount,timer


btnLogin.addEventListener('click', function (event) {

    event.preventDefault()


    accounts.forEach(element => {
        if (element.username == inputLoginUsername.value) {
            if (element.pin === Number(inputLoginPin.value)) {
               
                currentAccount = element
                containerApp.style.opacity = '1'
                inputLoginUsername.value = ''
                inputLoginPin.value = ''
                inputLoginUsername.blur()
                inputLoginPin.blur()
                if(timer) clearInterval(timer);
                timer = starterLogoutTimer()
                labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`
                updateUi(currentAccount)


                return currentAccount

            } 
        }
    })
})
/*  let currentAccount = accounts.forEach(element=>{
    if (element.username == inputLoginUsername.value) {
            if (element.pin === Number(inputLoginPin.value)) {
             return element
            } 
        }
    })
 */


btnTransfer.addEventListener('click', function (e) {
    e.preventDefault()
    const amount = Number(inputTransferAmount.value)
    //const receiverAccount = //inputTransferTo.value
    accounts.forEach(element => {
        if (element.username == inputTransferTo.value) {
            if (amount > 0 && amount < currentAccount.balance) {
                element.movementsDates.push(new Date())
                currentAccount.movementsDates.push(new Date());
                element.movements.push(amount)
                currentAccount.movements.push(-amount)
                inputTransferAmount.blur()
                inputTransferAmount.value = inputTransferTo.value = ''
                inputTransferTo.blur()


                updateUi(currentAccount)

            }
        }
    })
   
})

btnClose.addEventListener('click', function (e) {
    e.preventDefault()
    if (inputCloseUsername.value == currentAccount.username && Number(inputClosePin.value) == currentAccount.pin) {
        const index = accounts.findIndex(element => element.username == currentAccount.username)
        accounts.splice(index, 1)
        containerApp.style.opacity = '0'
        inputCloseUsername.value = inputClosePin = ''
        inputClosePin.blur()
        inputCloseUsername.blur()


    } else {
        console.log('chiamo la polizia')


    }

    ù
})

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(element =>
        element >= amount / 10)) {
        currentAccount.movements.push(amount)
        
        currentAccount.movementsDates.push(new Date());
        updateUi(currentAccount)
        inputLoanAmount.value = ''
        inputLoanAmount.blur()

    }
})
let sorted = false
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted
})
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes()
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`

const starterLogoutTimer = function (){
    const tick =function(){
        const min = String(Math.trunc(time/60)).padStart(2,0)
        const sec = String(time % 60)
        labelTimer.textContent = `${min}:${sec}`
        time--;
        if(time ===-1){
            clearInterval(timer);
            labelWelcome.textContent='Log in to get started'
            containerApp.style.opacity='0'
            return timer
        
        }
    }
    //set time to 5 minutes
let time = 600
    //call the timer every second
    tick()
    const timer = setInterval(tick,1000)

    //when 0 seconds, stop ,stop timer and log out user
}


//starterLogoutTimer()






/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



