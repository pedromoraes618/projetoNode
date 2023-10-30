
//modulos externos
const chalk = require('chalk')
const inquirer = require('inquirer')

//modulos internos
const fs = require('fs')

operation()//inicializando

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que voce deseja fazer',
            choices: [
                'Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
        },
    ]).then(answer => {
        const action = answer['action']
        if (action === "Criar conta") {
            createAccount()
        } else if (action === "Depositar") {
            deposit()
        } else if (action === 'Consultar Saldo') {
            getAccountBalance()
        } else if (action === 'Sacar') {
            withdraw()
        } else if (action === 'Sair') {
            console.log('Obrigado por usar o accounts!')
            process.exit()
        }
    }).catch(err => console.log(err))
}

//create account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções na sua conta a seguir'))
    buildAccount()//criação de conta
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta'
        }
    ]).then(answer => {
        const accountName = answer['accountName']
        if (accountName === '') {
            buildAccount()//criação de conta
            return
        }

        if (!fs.existsSync('accounts')) {//se não exister o diretorio, criar
            fs.mkdirSync('accounts')
        }
        if (fs.existsSync('accounts/' + accountName + '.json')) {//verifica se já existe a conta
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outra conta'))
            buildAccount()//criação de conta
            return
        }
        fs.writeFileSync('accounts/' + accountName + '.json', '{"balance":0}', function (err) {
            confirm.log(err)
        },
            console.log(chalk.green('A sua conta foi criada'))
        )

        operation()//inicializando

    }).catch(err => console.log(err))
}

//add an amount to user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual é nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']
            //add an amount
            addAmount(accountName, amount)
            operation()
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}


function checkAccount(accountName) {
    if (!fs.existsSync('accounts/' + accountName + '.json')) {//verifica se já existe a conta
        console.log(chalk.bgRed.black('Esta conta não existe, verifique'))
        return false
    }
    return true
}


function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)
    if (!amount) {
        console.log("ocorreu um erro, tente mais tarde")
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        'accounts/' + accountName + '.json',
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green('foi depositado o valor de  R$ ' + amount + ' na sua conta'))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync('accounts/' + accountName + '.json',
        {
            encoding: 'utf8',
            flag: 'r',
        })
    return JSON.parse(accountJSON)
}



function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual é nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        if (!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']
            //add an amount
            rmAmount(accountName, amount)
            operation()
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}



function rmAmount(accountName, amount) {
    const accountData = getAccount(accountName)
    if (!amount) {
        console.log("ocorreu um erro, tente mais tarde")
        return withdraw()
    }else if(amount > accountData.balance){
        console.log("valor indisponivel")
        return withdraw()
    }
    accountData.balance =  parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        'accounts/' + accountName + '.json',
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green('foi sacado o valor de R$ ' + amount + ' da sua conta'))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync('accounts/' + accountName + '.json',
        {
            encoding: 'utf8',
            flag: 'r',
        })
    return JSON.parse(accountJSON)
}




function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual é o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black("olá, o saldo da sua conta é de " + accountData.balance))
        operation()
    }).catch(err => console.log(err))
}