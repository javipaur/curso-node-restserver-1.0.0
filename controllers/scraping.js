const {response,request} = require('express')
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const URLS = {
    farmacias: 'https://www.cofalava.org/sec_df/wf_municipioGuardiaslst.aspx?IdMenu=1014',
    cinesFLorida: 'https://www.cinesflorida.com/',
    //cinesFloridaSensa:'https://www.sensacine.com/cines/cine/E0346/',
    cinesBoulevard:'https://www.sensacine.com/cines/cine/E0786/',
    jimmyjazzgasteiz: 'https://jimmyjazzgasteiz.com/es/agenda-conciertos-y-djs/'

  }
  const scrape= async (url)=> {
    const res = await fetch(url)
    const html = await res.text()
    return cheerio.load(html)
  }

const farmaciasGet= async (req=request,res=response)=>{
    try {
        const $ = await scrape(URLS.farmacias)
        const $rows = $('.FarmaciasGuardiaListado')
        const FARMACIASBOARD_SELECTORS = {
          nombre: { selector: 'h6', typeOf: 'string' },
          poblacion: { selector: '#ctl00_ch_GridGuardias_ctl00_Label1', typeOf: 'string' },
          direccion: { selector: '#ctl00_ch_GridGuardias_ctl00_Label2', typeOf: 'string' },
          telefono: { selector: '#ctl00_ch_GridGuardias_ctl00_Label3', typeOf: 'string' },
          codigopostal: { selector: '#ctl00_ch_GridGuardias_ctl00_lblCP', typeOf: 'string' },
          horario: { selector: '#ctl00_ch_GridGuardias_ctl00_lblHorarioFarmacia', typeOf: 'string' }
        }
      
        const cleanText = (text) => text
          .replace(/\t|\n|\s:/g, '')
          .trim()
      
        const farmaciasBoardSelectorEntries = Object.entries(FARMACIASBOARD_SELECTORS)
        const farmaciasBoard = []
        $rows.each((index, el) => {
          const farmaciasBoardEntries = farmaciasBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
                  if (selector !== 'h6') {
                      const selectorI = selector.substring(0, 26)
                      const selectorF = selector.substring(28)
                      selector = selectorI.concat(('0' + index).slice(-2)).concat(selectorF)
                  }
      
                      const rawValue = $(el).find(selector).text()
                      console.log(rawValue)
                      const cleanedValue = cleanText(rawValue)
      
                      return [key, cleanedValue]
          })
          farmaciasBoard.push(Object.fromEntries(farmaciasBoardEntries))
      })
      
        farmaciasBoard.filter((a )=> a.poblacion === 'VITORIA-GASTEIZ')
        console.log(JSON.stringify(farmaciasBoard))
        res.json(farmaciasBoard)
    } catch (error) {
        console.log(error) 
    }
  //  res.json({msj:'farmaciasGet API-Controlador'})
}

const cinesFloridaGet= async (req=request,res=response)=>{
    try {
        const $ = await scrape(URLS.cinesFLorida)
        const $rows = $('#cartelera0 #pelicula')

        const cinesFloridaBoard = []
        $rows.each((index, el) => { 
         const titulo =$(el).find('.derecha').find('h2').text()
         const genero =$(el).find('.genero').text()
        const duracion =$(el).find('.duracion').text()
         const calificacion =$(el).find('.calificacion').text()
         const horarios =$(el).find('.horas').text().match(/.{1,5}(.$)?/g);
        const cartel = $(el).find('.cartel').find('img').attr('src')
         const reserva=$(el).find('.horas').find('a').attr('href')
          const sinopsisUrl=$(el).find('.derecha').find('a').attr('href')
         
        cinesFloridaBoard.push({ titulo,genero, duracion,calificacion,horarios,cartel,reserva,sinopsisUrl})
      })
   
        res.json(cinesFloridaBoard)  
    } catch (error) {
        console.log(error)
    }
    
   // res.json({msj:'cinesFloridaGet API-Controlador'})
}

const cinesBoulevardGet= async (req=request,res=response)=>{
   try {
    const $ = await scrape(URLS.cinesBoulevard)
    const $rows = $('.entity-card-list')

    const cinesBoulevardBoard = []
    $rows.each((index, el) => { 
      const titulo =$(el).find('.meta-title-link').text()
      const tipoArray =$(el).find('.meta-body-item').text().split('/')
      const tipo=tipoArray[1].trim()
      const horarios =$(el).find('.showtimes-hour-block').text().match(/.{1,32}(.$)?/g)
      const horariosFiltrados=horarios.filter((item) => item !== 'Compra tu Entrada')
      let cartel = $(el).find('.thumbnail-img').attr('src');
      if(cartel.startsWith('data:')){
        cartel=$(el).find('.thumbnail-img').attr('data-src')  
      }
  
      const sinopsis=$(el).find('.synopsis').text().trim()
      
      cinesBoulevardBoard.push({ titulo,tipo,sinopsis,horariosFiltrados,cartel})
  })
  
    res.json(cinesBoulevardBoard)
   } catch (error) {
    
   }
   // res.json({msj:'cinesBoulevardGet API-Controlador'})
}

const concietrosJimmyJazzGet= async (req=request,res=response)=>{
    try {
        const $ = await scrape(URLS.jimmyjazzgasteiz)
        const $rows = $('.et_pb_blurb_content')
        const $count = $rows.length
        console.log($count)
    
     function findTextAndReturnRemainder(target, variable){
      var chopFront = target.substring(target.search(variable)+variable.length,target.length);
      var result = chopFront.substring(0,chopFront.search(";"));
      return result;
    }
    var text = $($('script')).text();
    var findAndClean = findTextAndReturnRemainder(text,"var et_link_options_data =");
    var direcciones = JSON.parse(findAndClean);
    
    console.log('result')
    console.log(direcciones)
    
    
        const jimmyjazzBoard = []
        $rows.each((index, el) => {
          if(index<$rows.length-1){
         // console.log('index'+index)
          const todo = $(el).find('.et_pb_blurb_description').text().split('\n')
          let titulo=''
          //const fecha = $(el).find('.et_pb_blurb_description').children().text()
         // console.log('todo'+(todo.length-1))
          for(var i =1;i<todo.length;i++){
             titulo=titulo+' '+todo[i]
             
          }
    
          const fecha =todo[0]
          //const titulo = $(el).find('.et_pb_blurb_description').first().text().split('\n',1)[1]
          //const titulo = $(el).find('.et_pb_blurb_description').text().replace(/\t|\n|\s:/g, '').replace(/.*:/g, ' ').trim()
          const img = $(el).find('.et_pb_main_blurb_image').find('img').attr('src')
          const url=direcciones[index].url;
         jimmyjazzBoard.push({ fecha,titulo, img,url})
          } 
      })
     
         
      res.json(jimmyjazzBoard);
      
    
    } catch (error) {
        
    }
    res.json({msj:'concietrosJimmyJazzGet API-Controlador'})
}

module.exports={
    farmaciasGet,
    cinesFloridaGet,
    cinesBoulevardGet,
    concietrosJimmyJazzGet
}