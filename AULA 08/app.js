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
app.get('/estados', cors(), async function(request, response, next){
    const estadosCidades = require('./modulo/estados_cidades.js')
    let estados = estadosCidades.getListaDeEstados()
    response.status(200)
    response.json(estados)
})

app.listen(8080, function(){
    console.log('Servidor aguardando requisições na porta 8080.')
})