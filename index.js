
// ------- Bank clients -------- //

class Client{
    constructor (
        name = 'Петр',
        surname = 'Петрович',
        date = 1980,
        location = 'SaintPeterburg'
    ) {
        this.name = name;
        this.surname = surname;
        this.date = date;
        this.location = location;
        this.cardNumber = Math.floor(Math.random() * 10**16);
        this.balance = Math.floor(Math.random() * 10000);
    }

    getCardNumber () {
        console.log(this.cardNumber);
    }

    raiseBalance (value) {
        this.balance += value;
    }

    withdrawBalance (value){
        if (this.balance >= value) {
            this.balance -= value;
            return true;
        } else
            return false;
    }

}

let clients_container = document.querySelector('.clients_contaner'); //основной контейнер для карт клиентов

let clientForm = document.forms.form_client;            //получим форму клиента
let form_balance = document.forms.form_operation;       //получим форму управления балансом
let clientCounter = 0;                                  //счетчик созданных клиентов
let arrayOfClients = [];                                //хранилище клиентов

let button_create_client = document.querySelector('.button_create_client');


// ------- Лиснер создания клинета
button_create_client.addEventListener('click', () => {

    //остановим отправку формы
    event.preventDefault();

    if (isEmpty(clientForm.elements.name.value)) {
        alert('Введите имя и фамилию!');
        return;
    }
    if (isEmpty(clientForm.elements.surname.value)) {
        alert('Введите имя и фамилию!');
        return;
    }
    
    //создадим объект клиента
    let currentClient = new Client(
        clientForm.elements.name.value,
        clientForm.elements.surname.value,
        clientForm.elements.data.value,
        clientForm.elements.location.value);
    
    //добавим во внутренний массив хранлище
    arrayOfClients.push(currentClient);

    //создадим карту клиента
    let clientBlock = createClientBlock(currentClient);
    
    // Выведем ее для пользователя
    clients_container.append(clientBlock);

    //Прибавляем счетчик клиентов
    clientCounter++;
});


function isEmpty(str) {
    return (!str || 0 === str.length);
}


// Функция создает карту клиента
function createClientBlock(clientPerson) {
    let client_block = document.createElement('div');
    client_block.className = `client client_${clientCounter}`;
    client_block.id = `${clientCounter + 100}`;

    client_block.innerHTML = `
        <ul class='client_param_list'>
            <li>
            <p class='text'>Name:</p>
            <p class='client_name_val'>${clientPerson.name}</p>
            </li>
            
            <li>
            <p class='text'>Surname:</p>
            <p class='client_surname_val'>${clientPerson.surname}</p>
            </li>

            <li>
            <p class='text'>Date:</p>
            <p class='client_data_val'>${clientPerson.date}</p>
            </li>
            
            <li>
            <p class='text'>Location:</p>
            <p class='client_location_val'>${clientPerson.location}</p>
            </li>
            
            <li>
            <p class='text'>Card:</p>
            <p class='client_cardNumber_val'>${clientPerson.cardNumber}</p>
            </li>
            
            <li>
            <p class='text'>Balance:</p>
            <p class='client_balance_val'>${clientPerson.balance}</p>
            </li>
        </ul>
        
        <button class='button_use_card' onclick="useCard(this)">Использовать</button>
    `
    return client_block; 
}

// ----- функция переноса номера карты в окошко терминала
function useCard(element) {
    // 9 нод это карта
    let currentCard = element.parentNode.childNodes[1].childNodes[9].childNodes[3].innerHTML;
    let inputForCard = document.getElementById('cardNumber');
    inputForCard.value = currentCard;

}


// ------ Лиснер пополнения счета
let buttonAddCash = document.querySelector('.add_balance');
buttonAddCash.addEventListener('click', (event) => {let num = operationWithBalance(event); changeClientCard(num)});

// ------- Лиснер снятия средств
let buttonWithdrawBalance = document.querySelector('.withdraw_balance');
buttonWithdrawBalance.addEventListener('click', (event) => {let num = operationWithBalance(event); changeClientCard(num)});


// ------- Функция обработки счета клиента
function operationWithBalance(event) {

    // Остановим отправку
    event.preventDefault();

    let numOfClient = -1;

    // Получим значения из формы
    let cardNumber = form_balance.elements.cardNumber.value;
    let value = +form_balance.elements.value.value;

    // Найдем нужного клиента с картой
    for (let i = 0; i < arrayOfClients.length; i++) {

        if (arrayOfClients[i].cardNumber == cardNumber) {

            // Выберем тип операции
            if(event.target.className == 'add_balance') {
                arrayOfClients[i].raiseBalance(value)
                console.log('Successful operation! ' + i);
                console.log(`Your balance now are ${arrayOfClients[i].balance}`);
                alert(`Successful operation! Your balance now are ${arrayOfClients[i].balance}`);
                numOfClient = i;
                break;
            } else if(event.target.className == 'withdraw_balance') {
                        if (arrayOfClients[i].withdrawBalance(value)) {
                            console.log('Successful operation! ' + i);
                            console.log(`Your balance now are ${arrayOfClients[i].balance}`);
                            alert(`Successful operation! Your balance now are ${arrayOfClients[i].balance}`);
                        } else {
                            console.log(`Sorry you don\'t have any source! You current balance is ${arrayOfClients[i].balance}`);
                            alert(`Sorry you don\'t have any source! You current balance is ${arrayOfClients[i].balance}`);
                        }
                        numOfClient = i;
                        break;
            }
        }
        // если последняя не прошла
        if (i == (arrayOfClients.length - 1))
            console.log('Sorry! Card doesn\'t exist! Check another.' );
    }

    // Возвращаем номер клиента с которым совершили операцию
    return numOfClient;
}

// Найдем и изменим карту клиента на основной странице
function changeClientCard(clientNum) {
    // Найдем карту клиента
    let clientOnChange = document.getElementsByClassName(`client_${clientNum}`);
    // Найдем его потомка и изменим баланс. Потомок 11 элемент в нодах
    clientOnChange[0].childNodes[1].childNodes[11].childNodes[3].innerHTML = arrayOfClients[clientNum].balance;
}