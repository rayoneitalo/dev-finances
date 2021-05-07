const Modal = {
    //** Adds the 'active' class to the modal */
    open() {
        document.querySelector('.modal-overlay').classList.add('active');

    },

    //** Remove the 'active' class to the modal */
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const transaction = {
    all: transactions = [],

    add(data) {
        transaction.all.push(data)
        App.reload();
    },

    remove(index) {
        transaction.all.splice(index, 1)

        App.reload();
    },

    incomes() {
        let income = 0;
        transaction.all.forEach(transaction => {
            transaction.amount > 0 ? income += transaction.amount : income
        })

        return income;
    },

    expenses() {
        let expense = 0;
        transaction.all.forEach(transaction => {
            transaction.amount < 0 ? expense += transaction.amount : expense
        })

        return expense;
    },

    totals() {
        return transaction.incomes() + transaction.expenses();

    }

}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')

        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction) {
        const CSSClass = transaction.amount > 0 ? 'income' : 'expense';
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td>${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="minus" />
            </td>
        `
        return html;
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(transaction.totals())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : '';

        value = String(value).replace(/\D/g, '')
        value = Number(value) / 100
        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value;

    },

    formatAmount(value) {
        value = Number(value.replace(/\,\./g, '')) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split('-')
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos')
        }

        //! Criar regra para o valor 0
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return { description, amount, date }
    },

    saveTransaction(transactions) {
        transaction.add(transactions)
    },

    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()

            const transaction = Form.formatValues()

            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message);
        }
    }

}

const App = {
    init() {
        transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()
    },
    reload() {
        DOM.clearTransactions()
        App.init();
    }
}

App.init();
