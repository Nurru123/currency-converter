const currencyStr = 'EUR,CHF,NOK,CAD,RUB,GBP,MXN,CNY,ISK,KRW,HKD,CZK,BGN,BRL,USD,IDR,SGD,PHP,RON,HUF,ILS,THB,SEK,NZD,AUD,DKK,HRK,PLN,TRY,INR,MYR,ZAR,JPY'


window.addEventListener('load', () => init());
function init() {
    const currencyArr = currencyStr.split(',');

    const blocks = [];
    

    function request() {
        API.request(blocks[0].value, blocks[1].value, response)
        
    }

    function response(rates) {
        console.log(rates)
    }

    ['RUB', 'USD'].forEach((currency, index) => {
        const currencyInput = new CurrencyInput(`block-${index + 1}`, currencyArr, currency, request);
        blocks.push(currencyInput)
    })


}

class CurrencyInput {
    constructor(inputId, currencyList, defaultValue, request) {
        this.value = defaultValue;

        const block = document.querySelector(`#${inputId}`);
        const select = block.querySelector('select');

        const btns = block.querySelectorAll('.btn:not(select)');

        select.addEventListener('change', () => {
            this.value = select.value;
            block.querySelector('.selected').classList.remove('selected');
            select.classList.add('selected');
            request();
        })

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                block.querySelector('.selected').classList.remove('selected');
                btn.classList.add('selected');
                this.value = btn.innerText;
                request();
            })
        })



        currencyList.forEach(currencyText => {
            const option = document.createElement('option');
            option.value = currencyText;
            option.innerText = currencyText;
            select.append(option);
        });

        const input = block.querySelector('input');

        function alerts(value) {
            const alertInner = block.querySelector('.alert-inner');
            const alert = block.querySelector('.alert');

            if (value.match(/^[0-9.,]*$/) && value !== '') {
                if (alertInner.classList.contains('have')) {
                    alert.remove();
                    alertInner.classList.remove('have')
                } 
                
                return value.replace(/,/g, ".");

            } else {
                let message = document.createElement('p');
                message.classList.add('alert');
                message.innerHTML = 'данные в неверном формате';
                if (!alertInner.classList.contains('have')) {
                    alertInner.append(message);
                    alertInner.classList.add('have');
                } 
            }
        }

        input.addEventListener('change', () => {
            this.value = input.value;
            console.log(alerts(this.value))
        })


    }
}

const API = {
    request(base, symbols, callback) {
        fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`)
            .then(res => res.json())
            .then(data => {
                callback(data.rates)
            })
    }
}