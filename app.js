'use strict';

// Data
const account1 = {
  owner: 'Mark Lou',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-09-25T17:01:17.194Z",
    "2022-09-26T23:36:17.929Z",
    "2022-09-28T10:51:36.790Z",
  ],
  currency: "BGN",
  locale: "bg-BG", // de-DE
};

const account2 = {
  owner: 'Clark Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:33.867Z',
    '2022-12-25T06:05:25.907Z',
    '2022-01-25T14:10:15.233Z',
    '2022-02-05T16:33:10.386Z',
    '2022-04-10T15:25:05.374Z',
    '2022-06-25T18:50:33.371Z',
    '2022-07-26T12:01:05.894Z',
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:33.867Z',
    '2022-12-25T06:05:25.907Z',
    '2022-01-25T14:10:15.233Z',
    '2022-02-05T16:33:10.386Z',
    '2022-04-10T15:25:05.374Z',
    '2022-06-25T18:50:33.371Z',
    '2022-07-26T12:01:05.894Z',
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:33.867Z',
    '2022-12-25T06:05:25.907Z',
    '2022-01-25T14:10:15.233Z',
    '2022-02-05T16:33:10.386Z',
    '2022-04-10T15:25:05.374Z',
    '2022-06-25T18:50:33.371Z',
    '2022-07-26T12:01:05.894Z',
  ],
  currency: "EUR",
  locale: "pt-PT",
};

 const accounts = [account1, account2, account3, account4];

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

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS

// Transaction dates
const formatMovementDate = function(date, locale) {
  // Converting timestamp into days/hours/seconds
  const a = new Date(2022,12,24,15,25);
  //  miliseconds * seconds * minutes * hours
  const calculateDays = (d1, d2) => Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24)));

    const daysPassed = calculateDays(new Date(), date);
 
    if(daysPassed === 0) return 'Today';
    if(daysPassed === 1) return 'Yesterday';
    if(daysPassed <= 7) return `${daysPassed} days ago`;

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);    
}

// Formatting the transactions with flexible amount depends on the country
const formatCurr = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
}

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';
  //Sorting transactions
  console.log('ACC', acc);
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements; 

  movs.forEach(function(mov, index) {
    const type = mov > 0 ? 'deposit': 'withdrawal';

    const date = new Date(acc.movementDates[index]);
    const displayDate = formatMovementDate(date, acc.locale);
    
    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
      </div>` 
     
      containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

const calculateDisplayBalance = function(account) {
  console.log('details', account)
  const balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  console.log('balance1', balance, '------', 'balance2', account.balance)
  labelBalance.textContent = formatCurr(balance, account.locale, account.currency);
  account.balance = balance;
  console.log(123, balance);
}

const calculateDisplaySummary = function(account) {
  const incomes = account.movements
    .filter(mov => mov >  0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = formatCurr(account.balance, account.locale, account.currency);

  const out = account.movements
    .filter(mov => mov < 0) 
    .reduce((acc, curr) => acc + curr, 0);

  labelSumOut.textContent = formatCurr(Math.abs(out), account.locale, account.currency);

  const interest = account.movements
    .filter(mov => mov >  0)
    .map(deposit => deposit * account.interestRate / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = formatCurr(interest, account.locale, account.currency);

  console.log(movements)
} 

//Creating a new prop with the first letters of the owners
const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner
    .toLocaleLowerCase()
    .split(' ')
    .map(name => name[0]).join('');
  })
}

createUsernames(accounts)


// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



// const eurToUsd = 1.02
// const movementsUSD = movements.map(mov => mov * eurToUsd);


const deposits = movements.filter(function(mov) {
  return mov > 0;
})

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals)


// Total value
const totalValue = movements.reduce((acc, curr) => acc + curr, movements[0])
  

// Converting deposited USD to EUR
const eurToUsd = 1.1
const depositsUSD = movements.filter(mov => mov > 0)
         .map(mov => mov * eurToUsd)
         .reduce((acc, mov) => acc + mov, 0)

const firstWithdrawal = movements.find(mov => mov < 0)
const account = accounts.find(acc => acc.owner === 'Mark Lou');
//console.log(account)


// Update UI
const updateUI = function(currentAccount) {
  // Display balance
  calculateDisplayBalance(currentAccount);
  // Display summary
  calculateDisplaySummary(currentAccount);
  // Display movements
  displayMovements(currentAccount);
}

const startLogOutTimer = function() {
  // Set time to 5 minutes
  let time = 15  ;

  // Call the timer every second
 const timer = setInterval(function() {
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer log out user 
    if(time === 0) { 
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  }, 1000);
  return timer;
}

//Login
let currentAccount, timer;

//getting the language from the browser
const locale = navigator.language;
console.log('local', locale);

btnLogin.addEventListener('click', function(e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
      
    if(currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        // Display UI
        labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`
        containerApp.style.opacity = 1;

        //Current date and time
        // const now = new Date();
        // const day = `${now.getDate()}`.padStart(2, 0);
        // const month = `${now.getMonth() + 1}`.padStart(2,0);
        // const year = now.getFullYear();
        // const hour = `${now.getHours()}`.padStart(2,0);
        // const min = `${now.getMinutes()} `.padStart(2, 0);
        //labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        // Testing Date API
        const now = new Date();

        const options = {
          hour: 'numeric',
          minute: 'numeric',
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          // weekday: 'long'
        }

        // const locale = navigator.language;
        // console.log(locale);

        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
        

        
        // Converting timestamp into days/hours/seconds
        const a = new Date(2022,12,24,15,25);
        //  miliseconds * seconds * minutes * hours
        const calculateDays = (d1, d2) => Math.abs((d2 - d1) / (1000 * 60 * 60 * 24));

        // clear input
        inputLoginUsername.value = inputLoginPin.value = ''
        inputLoginPin.blur();

        if(timer) clearInterval(timer);
        timer = startLogOutTimer();

        //Update UI
        updateUI(currentAccount)
    }
});


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 &&  
      receiverAcc &&
      currentAccount.balance >= amount && 
      receiverAcc?.username !== currentAccount.username) {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      
      // Add Transfer time
      currentAccount.movementDates.push(new Date());  
      receiverAcc.movementDates.push(new Date());

      // Update UI
      updateUI(currentAccount)

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  // only grants a loan if there is at least 1 deposit with at least 10% of the requested loan amount
  // If you want 10000 you should have deposit of at least 1000
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.10)) {
    //Simulates an approval
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);
      // Add loan date
      currentAccount.movementDates.push(new Date());
      // Update UI 
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);

  }
  inputLoanAmount.value = "";
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && 
     Number(inputClosePin.value) === currentAccount.pin) {
    
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      // Delete account
      accounts.splice(index, 1);
      // Hide UI

      const closeAcc = confirm('Warning! Your account will be deleted. If you want to continue click "Yes".')

      if(closeAcc) {
        containerApp.style.opacity = 0
      }
  }
})

// Sorting transactions
let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})

//All account movements
//flat
const overalBalance = accounts
.map(acc => acc.movements)
.flat()
.reduce((acc, mov) => acc + mov, 0)

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0)




