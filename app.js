require('colors');
const { inquirerMenu,
        leerInput,  
        inquirerPause,
        listarLugares
        } = require('./helpers/inquirer');

const Busquedas = require('./models/busquedas');
console.clear();

const main = async() => {
    
    let opt = '';

    const busquedas = new Busquedas();

    do {
        
        opt = await inquirerMenu();
        //console.log({ opt });

        switch (opt){
            case 1:
                //console.log('Escogiste la opción 1');
                const termino = await leerInput('Ciudad: ');
                //console.log(lugar);
                const lugares = await busquedas.ciudad( termino );
                const id = await listarLugares( lugares );
                //console.log({ id });

                if (id === 0) continue

                const lugarSeleccionado = lugares.find( l => l.id === id );
                //console.log( lugarSeleccionado );

                busquedas.agregarHistorial( lugarSeleccionado.nombre );

                const informe = await busquedas.clima( lugarSeleccionado.lat, lugarSeleccionado.lng );
                //console.log(informe);

                console.clear();
                console.log('=============================='.green);
                console.log('   Información de la ciudad'.white);
                console.log('==============================\n'.green);
                console.log('Ciudad: ', `${lugarSeleccionado.nombre}`.green);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Long: ', lugarSeleccionado.lng);
                console.log('Estado actual: ', `${informe.status}`.yellow);
                console.log('Temperatura actual: ', `${informe.temp}° Celsius`.yellow);
                console.log('Temp. Mínima: ', `${informe.temp_min}° Celsius`.yellow);
                console.log('Temp. Máxima: ', `${informe.temp_max}° Celsius\n`.yellow);
                
                break;
            case 2:
                console.log('Escogiste la opción 2');

                busquedas.leerDb();

                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
                break;
        }
    
        if (opt !==0) { await inquirerPause(); }

    } while (opt !== 0);
    
}

main();