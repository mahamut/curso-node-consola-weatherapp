const { leerInput } = require('./helpers/inquirer')

const main = async () => {
    
    const texto = await leerInput('Si yo digo Hola, tú dices:');

    console.log(texto);
}

main();