// Classe Despesa
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (const dados in this) {
            if(this[dados] == undefined || this[dados] == '' || this[dados] == null) {
                return false
            }
        }
        return true
    }
}

class Banco {
    constructor() {

        let id = localStorage.getItem('id')
        // Caso a variável id seja null, ela recebe o valor 0
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    // Método que captura o id e o atualiza
    getProximoId() {
        let proximoId = localStorage.getItem('id') //O retorno será null
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
        
    }
    
    recuperarTodosRegistros() {
        // Array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        
        // Recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++) {

        //recuperar a despesa
        let despesa = JSON.parse(localStorage.getItem(i))

        // existe a possibilidade de haver índices que foram pulados/removidos
        // nestes casos, nós vamos pular estes índices

        if(despesa === null) {
            continue
        }

        despesa.id = i
        despesas.push(despesa)
       }
       
       return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        //Aplicaremos os filtros relacionados aos campos

        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        
        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        console.log(despesasFiltradas)
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let banco = new Banco() 

//Cadastrar despesa
function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value)

    
    if(despesa.validarDados()) {
        //banco.gravar(despesa)
        // dialog de sucesso
        document.getElementById('dialog').innerHTML = 'Registro inserido!'
        document.getElementById('description').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('corTexto').classList.add('text-success')
        document.getElementById('botaoVoltar').innerHTML = 'Voltar'
        document.getElementById('botaoVoltar').classList.add('btn-success')
        $('#registraDespesa').modal('show')
        
        // Zerando os valores após cadastro da despesa
        ano.value = '' 
        mes.value = '' 
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''


    } else {
        // dialog de erro
        document.getElementById('dialog').innerHTML = 'Ocorreu um erro!'
        document.getElementById('description').innerHTML = 'Verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('corTexto').classList.add('text-danger')
        document.getElementById('botaoVoltar').innerHTML = 'Corrigir!'
        document.getElementById('botaoVoltar').classList.add('btn-danger')
        $('#registraDespesa').modal('show')
        
    }
}

// Recuperando os registros no localStorage
function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = banco.recuperarTodosRegistros()
    }

    //Selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d) {
        //criando a linha (tr)
       let linha = listaDespesas.insertRow()


       //ajustar o tipo

       switch(parseInt(d.tipo)) {
        case 1: d.tipo = 'Alimentação'
            break
        case 2: d.tipo = 'Educação'
            break
        case 3: d.tipo = 'Lazer'
            break
        case 4: d.tipo = 'Saúde'
            break
        case 5: d.tipo = 'Transporte'
       }

       
       //criar as colunas (td)

       linha.insertCell(0).innerHTML = (`${d.dia}/${d.mes}/${d.ano}`)
       linha.insertCell(1).innerHTML = (`${d.tipo}`)
       linha.insertCell(2).innerHTML = (`${d.descricao}`)
       linha.insertCell(3).innerHTML = (`${d.valor}`)

       //criar botão de exclusão
       let botao = document.createElement("button")
       botao.className = 'btn btn-danger'
       botao.innerHTML = '<i class="fas fa-times"></i>'
       botao.id = `id_despesa_${d.id}`
       botao.onclick = function() {//remover despesa
            let id = this.id.replace('id_despesa_', '')
            banco.remover(id)
            window.location.reload()
        }

       linha.insertCell(4).append(botao)
    })
}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(
        ano, 
        mes, 
        dia, 
        tipo, 
        descricao, 
        valor,
    )

    let despesas = banco.pesquisar(despesa)

    carregaListaDespesas(despesas, true) 

}