const fs = require('fs');
require('dotenv').config();

const axios = require('axios');
const { join } = require('path');

class Busquedas {

    /* PROPIEDADES */
    historial = [];
    dbPath = "./db/database.json";

    constructor(){
        //TO DO
        this.leerDb();
    }

    get historialCapitalizado(){ 
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        })
    }

    get paramsMapbox() {
        return {
            'access_token': `${process.env.MAPBOX_KEY}`,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad ( lugar = '' ) {

        try{
            //petición http
            //console.log(lugar);

            const instance = axios.create({
                baseURL: `${process.env.URL_MAPBOXPLACES}${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            //console.log(resp.data.features);
            
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error){
            console.log(resp)
            console.log('Nada');
            return [];
        }

    }

    async clima ( lat, lon ) {

        try {
            const wrequest = axios.create({
                baseURL: `${process.env.URL_WAPI}`,
                params: {...this.paramsWeather, 
                    lat,
                    lon
                }
            });

            const  result  = await wrequest.get()
            
            const { weather, main } = result.data;

            const weatherObject = {
                status: weather[0].description,
                temp: main['temp'],
                temp_min: main['temp_min'],
                temp_max: main['temp_max']
            }

            /* const weatherObject = {
                status: result.data.weather[0].description,
                temp: result.data.main['temp'],
                temp_min: result.data.main['temp_min'],
                temp_max: result.data.main['temp_max']
            } */
           
            //return result.data.main;
            return weatherObject
            //console.log(result.data);

        } catch (err) {
            console.log('Error');
            console.log(err);
        }

    }

    agregarHistorial( lugar = '' ){
        //prevenir duplicados

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar );

        //grabar en db
        this.guardarDb();
    }

    guardarDb() {

        const payload = {
            historial: this.historial 
        };
        
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDb() {

        if( !fs.existsSync( this.dbPath ) ){
            return;
        }

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse( info );

        this.historial = data.historial;

    }

}

module.exports = Busquedas;