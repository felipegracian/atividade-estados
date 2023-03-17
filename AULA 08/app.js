/***************
 * Objetivo: Criar uma API para disponibilizar dados de Estados e Cidades
 * Autor: Felipe Graciano
 * Data: 10/03/2023
 * Versão: 1.0
 **************/

/**
 * Express - dependencia para realizar requisições de API pelo protocolo Http
 *       npm install exxpress --save
 * 
 * 
 *  Cors - dependencia para gerenciar permissoes de requisicao da API
 *         npm install cors --save
 * 
 * 
 * Body-Parser - dependencia que gerencia o corpo das requisicoes
 *         npm install body-parser --save
 */



//Import das dependencias do projeto


//Dependencia para criar as requsiçoes da API
const express = require('express');
//Dependencia para gerenciar as permissoes da API
const cors = require('cors');
//Dependencia para gerenciar o corpo das requsiçoes da API
const bodyParser = require('body-parser');

const estadosCidades = require('./modulo/estados_cidades.js')

//cria um objeto com as caracteristicas do express
const app = express();

app.use((request, response, next) => {
    //API public = '*'
    //API private - necessario passar o ip que ira utilizar a API
    response.header('Access-Control-Allow-Origin', '*')


    //Permite definir quais métodos poderao ser utilizados nas requisições da API
    response.header('Access-Control-Allow-Methods', 'GET , POST, PUT, DELETE, OPTIONS')

    //Envia para o cors as regras de permissoes
    app.use(cors())

    next()
})


//EndPoints
//async - estabelece um status de aguarde, assim que eu processar te respondo
//Obs: se não usar o async a requisição é perdida pois o front acha que a API esta fora do ar

//Endpoint para lstar todos os estados
app.get('/senai/estados', cors(), async function(request, response, next){
    
    let estados = estadosCidades.getListaDeEstados()


    //Tratamento para validar o sucesso da requisiçao
    if(estados){
        response.status(200)
        response.json(estados)
    } else{
        response.status(500)
    }
})

//Endpoint : listarDadosEstado(siglaestado)
app.get('/senai/estado/sigla/:uf', cors(), async function(request, response, next){

    let statusCode;
    let dadosEstado = {};

    //Recebe a sigla do Estado que sera enviada pela URL da requisiçao
    let siglaEstado = request.params.uf

    //tratamentos para validaçao de entrada de dados corretos
    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstado.message = 'Não foi possivel processar pois os dados de entrada (uf) não correspondem aos parametros'
    } else{
        let estado = estadosCidades.getDadosEstado(siglaEstado)

        if(estado){
            statusCode = 200
            dadosEstado = estado
        } else{
            statusCode = 400
        }
    }

    response.status(statusCode)
    response.json(dadosEstado)
})

app.get('/senai/capital/sigla/:uf', cors(), async function(request, response, next){
    let statusCode;
    let dadosCapital = {};

    let siglaEstado = request.params.uf

    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstado.message = 'Não foi possivel processar pois os dados de entrada (uf) não correspondem aos parametros'
    } else{
        let capitalEstado = estadosCidades.getCapitalEstado(siglaEstado)

        if(capitalEstado){
            statusCode = 200
            dadosCapital = capitalEstado
        } else{
            statusCode = 400
        }
    }

    response.status(statusCode)
    response.json(dadosCapital)
})

app.get('/senai/estadosRegiao/regiao/:regiao', cors(), async function(request, response, next){
    let statusCode;
    let estadosRegiao = {};

    let regiaoDesejada = request.params.regiao

    if(regiaoDesejada == '' || regiaoDesejada == undefined || !isNaN(regiaoDesejada)){
        statusCode = 400
        estadosRegiao.message = 'Não foi possivel processar pois os dados de entrada (regiao) não correspondem aos parametros'
    } else{
        let listaDeEstados = estadosCidades.getEstadosRegiao(regiaoDesejada)

        if(listaDeEstados){
            statusCode = 200
            estadosRegiao = listaDeEstados
        } else{
            statusCode = 404
        }
    }

    response.status(statusCode)
    response.json(estadosRegiao)
})

app.get('/senai/capitaisPais', cors(), async function(request, response, next){
    let statusCode;
    let listaCapitais = {}
    let capitais = estadosCidades.getCapitalPais()

    if(capitais){
        statusCode = 200
        listaCapitais = capitais
    } else{
        statusCode = 400
    }

    response.status(statusCode)
    response.json(listaCapitais)
})

// app.get('/senai/cidades/estado/:estado', cors(), async function(request, response, next){
//     let statusCode;
//     let listaCidades = {}

//     let estadoDesejado = request.params.estado

//     if(estadoDesejado == '' || estadoDesejado == undefined || !isNaN(estadoDesejado) || estadoDesejado.length != 2){
//         statusCode = 400
//         listaCidades.message = 'Não foi possivel processar pois os dados de entrada (regiao) não correspondem aos parametros'
//     } else{
//         let cidades = estadosCidades.getCidades(estadoDesejado)

//         if(cidades){
//             statusCode = 200
//             listaCidades = cidades
//         } else{
//             statusCode = 400
//         }
//     }

//     response.status(statusCode)
//     response.json(listaCidades)
// })


app.get('/v2/senai/cidades', cors(), async function(request, response, next){

    /**
     * Existem duas opções para receber variaveis para filtro:
     * 1 opção: params- permite receber a variável na estrutura da url criada no endpoint (geralmente utilizado para id (PK))
     * 
     * 2 opção: query- Também conhecido como queryString permite receber uma ou muitas variáveis para realizar filtros avançado
     */

    //recebe uma variavl encaminhada via query string
    let siglaEstado = request.query.uf

    let statusCode;
    let dadosCidades = {};

    //tratamentos para validaçao de entrada de dados corretos
    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosCidades.message = 'Não foi possivel processar pois os dados de entrada (uf) não correspondem aos parametros'
    } else{
        let cidades = estadosCidades.getCidades(siglaEstado)

        if(cidades){
            statusCode = 200
            dadosCidades = cidades
        } else{
            statusCode = 400
        }
    }

    response.status(statusCode)
    response.json(dadosCidades)

    console.log(siglaEstado)
})


//Roda o serviço da API para ficar aguardadndo requisições
app.listen(8080, function(){
    console.log('Servidor aguardando requisições na porta 8080.')
})