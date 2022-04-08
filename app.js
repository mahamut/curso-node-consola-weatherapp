require('colors');
const { inquirerMenu,
        leerInput,  
        inquirerPause
        } = require('./helpers/inquirer');

console.clear();

const main = async() => {
    
    let opt = '';

    do {
        
        opt = await inquirerMenu();
        console.log({ opt });

        switch (opt){
            case 1:
                console.log('Escogiste la opción 1');
                break;
            case 2:
                console.log('Escogiste la opción 2');
                break;
        }
    
        if (opt !==0) { await inquirerPause(); }

    } while (opt !== 0);
    
}

main();