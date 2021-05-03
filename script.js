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

const transactions = []

const transaction = {
    all: transactions,

    add(data) {
        transaction.all.push(data)
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