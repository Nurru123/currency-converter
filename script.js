const currencyStr = 'EUR,CHF,NOK,CAD,RUB,GBP,MXN,CNY,ISK,KRW,HKD,CZK,BGN,BRL,USD,IDR,SGD,PHP,RON,HUF,ILS,THB,SEK,NZD,AUD,DKK,HRK,PLN,TRY,INR,MYR,ZAR,JPY'
let timer;
const message = document.querySelector('.message');
const cover = document.querySelector('.cover');

window.addEventListener('load', () => init());

function init() {
    const currencyArr = currencyStr.split(',');
    const changeBtn = document.querySelector('.btn-change')
    const input = document.querySelectorAll('input');
    const blocks = [];
    const rate = document.querySelectorAll('.rate')

    function request(id = 1) {
        timer = setTimeout(() => {
            renderLoadMessage();
        }, 500)
        API.request(blocks[0].value, blocks[1].value, response, id, renderLoadMessage, renderErrMessage);
    }

    function response(rates, id) {
        cover.style.display = 'none';
        if (rates === 'XXX') {
            if (id === 1) {
                blocks[1].inputField.value = blocks[0].inputField.value;
            } else if (id === 2) {
                blocks[0].inputField.value = blocks[1].inputField.value;
            }

        } else if (id === 1) {
            blocks[1].inputField.value = Math.round(blocks[0].inputField.value * rates[blocks[1].value] * 1000) / 1000;
        } else if (id === 2) {
            blocks[0].inputField.value = Math.round(blocks[1].inputField.value / rates[blocks[1].value] * 1000) / 1000;
        }
        rate[0].innerHTML = `1 ${blocks[0].value} = ${Math.round(rates[blocks[1].value] * 1000) / 1000} ${blocks[1].value}`;
        rate[1].innerHTML = `1 ${blocks[1].value} = ${Math.round(1 / rates[blocks[1].value] * 1000) / 1000} ${blocks[0].value}`;
    }

    ['RUB', 'USD'].forEach((currency, index) => {
        const currencyInput = new CurrencyInput(index + 1, currencyArr, currency, request);
        blocks.push(currencyInput);
    })

    input.forEach(item => {
        item.addEventListener('change', () => {
            request(item.id);
        })
    })

    changeBtn.addEventListener('click', () => {
        const currencyLeft = blocks[0].value;
        const currencyRight = blocks[1].value;
        blocks[0].setCurrency(currencyRight);
        blocks[1].setCurrency(currencyLeft);
        request();
    })
    request(id = 1)

    function renderLoadMessage() {
        cover.style.display = 'flex';
        message.innerText = 'Loading...'
    }
    function renderErrMessage() {
        cover.style.display = 'flex';
        cover.addEventListener('click', () => {
            cover.style.display = 'none';
        })
        message.innerText = 'error :('
    }
}

class CurrencyInput {
    constructor(inputId, currencyList, defaultValue, request) {
        this.value = defaultValue;
        this.input = 0;
        this.id = inputId;

        const inputField = document.querySelector(`#input-${inputId}`);
        this.inputField = inputField;

        const block = document.querySelector(`#block-${inputId}`);
        const select = block.querySelector('select');
        const btns = block.querySelectorAll('.btn:not(select)');

        this.select = select;
        this.btns = btns;
        this.block = block;


        select.addEventListener('change', () => {
            this.value = select.value;
            block.querySelector('.selected').classList.remove('selected');
            select.classList.add('selected');
            request(1);
        })

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                block.querySelector('.selected').classList.remove('selected');
                btn.classList.add('selected');
                this.value = btn.innerText;
                request(1);
            })
        })
        currencyList.forEach(currencyText => {
            const option = document.createElement('option');
            option.value = currencyText;
            option.innerText = currencyText;
            select.append(option);
        });
        function valueReplace() {
            inputField.addEventListener('input', (e) => {
                inputField.value = e.target.value
                    .replace(/,/, ".")
                    .replace(/[^0-9\.]/g, '')
                    .replace(/\./, "x").replace(/\./g, "").replace(/x/, ".");
            })
            return inputField.value;
        }
        valueReplace()
        inputField.addEventListener('change', () => {
            this.input = valueReplace();
            console.log(this.input);
            request(this.id);
        })
    }
    setCurrency(currency) {
        this.block.querySelector('.selected').classList.remove('selected');
        const btn = [...this.btns].find((btn) => btn.innerText === currency);
        if (btn) {
            btn.classList.add('selected');
        } else {
            const options = this.select.querySelectorAll('option');
            const option = [...options].find((opt) => opt.value === currency);
            option.selected = true;
            this.select.classList.add('selected');
        }
        this.value = currency;
    }
}

const API = {
    request(base, symbols, callback, id, renderLoadMessage, renderErrMessage) {
        if (base !== symbols) {
            fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`)
                .then(res => res.json())
                .then(data => {
                    clearTimeout(timer)
                    callback(data.rates, id)
                })
                .catch(() => {
                    clearTimeout(timer);
                    renderErrMessage();
                })
        } else {
            clearTimeout(timer)
            callback('XXX', id)
        }
    }
}
