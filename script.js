const currencyStr = 'EUR,CHF,NOK,CAD,RUB,GBP,MXN,CNY,ISK,KRW,HKD,CZK,BGN,BRL,USD,IDR,SGD,PHP,RON,HUF,ILS,THB,SEK,NZD,AUD,DKK,HRK,PLN,TRY,INR,MYR,ZAR,JPY'


window.addEventListener('load', () => init());
function init() {
    const currencyArr = currencyStr.split(',');
    const changeBtn = document.querySelector('.btn-change')
    const input = document.querySelectorAll('input');
    const blocks = [];


    function request(id) {
        API.request(blocks[0].value, blocks[1].value, response, id)

    }

    function response(rates, id) {
        if (rates === 'XXX') {
            if (id === 1) {
                blocks[1].inputField.value = blocks[0].inputField.value
            } else if (id === 2) {
                blocks[0].inputField.value = blocks[1].inputField.value
            }

        } else if (id === 1) {
            blocks[1].inputField.value = Math.round(blocks[0].inputField.value * rates[blocks[1].value] * 100) / 100
        } else if (id === 2) {
            blocks[0].inputField.value = Math.round(blocks[1].inputField.value / rates[blocks[1].value] * 100) / 100
        }

    }

    ['RUB', 'USD'].forEach((currency, index) => {
        const currencyInput = new CurrencyInput(index + 1, currencyArr, currency, request);
        blocks.push(currencyInput)
    })

    input.forEach(item => {
        item.addEventListener('change', () => {
            request(item.id)
        })
    })

}

class CurrencyInput {
    constructor(inputId, currencyList, defaultValue, request) {
        this.value = defaultValue;
        this.input = 0;
        this.id = inputId;
        const inputField = document.querySelector(`#input-${inputId}`)
        this.inputField = inputField
        const block = document.querySelector(`#block-${inputId}`);
        const select = block.querySelector('select');

        const btns = block.querySelectorAll('.btn:not(select)');

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
                inputField.value = e.target.value.replace(/,/g, ".")
                inputField.value = inputField.value.replace(/[^0-9\.,]/g, '')
            })
            return inputField.value
        }
        valueReplace()
        inputField.addEventListener('change', () => {
            this.input = valueReplace()
            console.log(this.input)
            request(this.id)
        })
    }
}

const API = {
    request(base, symbols, callback, id) {
        if (base !== symbols) {
            fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`)
                .then(res => res.json())
                .then(data => {
                    callback(data.rates, id)
                    console.log(data.rates)
                })
        } else {
            callback('XXX', id)
        }
    }
}
