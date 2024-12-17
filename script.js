//nodos de los selectores que dependendiento del primero el segundo selector cambia de contenido
const NODOCOMUNIDADES = document.getElementById("comunidad");
const NODOPROVINCIAS = document.getElementById("provincia");

const NODOMARCAS = document.getElementById("marca");
const NODOMODELOS = document.getElementById("modelo");

//Objeto con atributos igual a 17 C.A, que juntas contienen en 50 provincias divididas en una array + Ceuta y Melilla, que realmente no son, pero en este objeto se tratan como "uniprovinciales" homónimas con su C.A.
const OBJ_COMUNIDADES = {
    "Andalucía": ["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
    "Aragón": ["Huesca", "Teruel", "Zaragoza"],
    "Asturias": ["Asturias"],
    "Islas Baleares": ["Islas Baleares"],
    "Canarias": ["Las Palmas", "Santa Cruz de Tenerife"],
    "Cantabria": ["Cantabria"],
    "Castilla y León": ["Ávila", "Burgos", "León", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
    "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
    "Cataluña": ["Barcelona", "Girona", "Lleida", "Tarragona"],
    "Extremadura": ["Badajoz", "Cáceres"],
    "Galicia": ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
    "Madrid": ["Madrid"],
    "Murcia": ["Murcia"],
    "Navarra": ["Navarra"],
    "La Rioja": ["La Rioja"],
    "País Vasco": ["Álava", "Bizkaia", "Gipuzkoa"],
    "Comunidad Valenciana": ["Alicante", "Castellón", "Valencia"],
    "Ceuta": ["Ceuta"],
    "Melilla": ["Melilla"]
};

//otro objeto que; atributo = marca, valor = array con modelos
const MARCAMODELOCOCHE = {
    "Toyota": ["Corolla", "Camry", "Hilux", "Supra", "Land Cruiser"],
    "Ford": ["Fiesta", "Focus", "Mustang", "F-150"],
    "BMW": ["Serie 3", "Serie 5", "X5", "M3"],
    "Audi": ["A3", "A4", "Q7", "Q5"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot"],
    "Mercedes-Benz": ["Clase C", "Clase E", "GLE", "S-Class"],
    "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "Jetta"],
    "Nissan": ["Altima", "Maxima", "370Z", "Rogue"],
    "Renault": ["Clio", "Megane", "Captur", "Kangoo", "Twingo"],
    "Dacia": ["Sandero", "Logan", "Duster", "Spring", "Lodgy"]
};

//estas funciones "Validar" reciben el input listo para ser comparado (a excepcion de validarFecha) y devuelven un booleano
//se puede reutilizar para validar apellidos ya que hay que contemplar el caso de "solo un apellido"
function validarNombreApellido(input) {
    //se "duplica" la regex para posibles nombres compuestos p.ej "Juan Miguel"
    return input.length > 0 && input.length < 30 && /^[A-Z][a-zA-Z]{2,10}( [A-Z][a-zA-Z]{2,10})?$/.test(input);
}

//validar si el dni cumple con el formato de 8 numeros y 1 letra mayus
function validarDNI(input) {
    return /^\d{8}[A-Z]$/;
}

//devolverá true de 18 hasta 90 años de edad, a partir de una fecha
function validarEdad(input) {
    const INPUTDATE = new Date(input); //sabemos que input es un string con el formato YYYY-MM-DD, el que usa el objeto Date
    const AHORA = new Date(); //esto crea un nuevo objeto fecha con la fecha del momento de ejecucion (siendo "ahora" el momento cuando se ejecute)
    const EDAD = Math.floor((AHORA - INPUTDATE) * 1000 * 3600 * 24 * 365); //restamos las fechas, y hacemos esta conversion: ms -> sec -> hora -> 
    return EDAD >= 18 && EDAD <= 90;
}

//funcion para validar el correo, para que tenga más o menos un formato correcto
function validarCorreo(input) {
    return /^\w[\w\d]{3,20}@\w{3,10}\.\w{2,4}$/.test(input);
}

//valida el telefono, que sean 9 digitos
function validarTelefono(input) {
    return /^\d{9}$/.test(input);
}

//comparamos que la fecha NO sea posterior a la del momento de ejecución al validar, sirve para validar fechas carne y matricula
function validarFecha(input) {
    //misma logica que en validarEdad
    const INPUTDATE = new Date(input);
    const AHORA = new Date();
    return INPUTDATE.getTime() <= AHORA.getTime();
}

function validarMatricula(input) {
    //valida matriculas con este formato (d = digito, C = letra mayus, separados por un guion) -> dddd-CCC
    return /^\d{4}-[A-Z]{3}$/.test(input);
}

//valida el cp, que sean 5 digs
function validarCodigoPostal(input) {
    return /^\d{5}$/.test(input);
}

//esto valida la extension de la imagen la cual se pasa por parametro
function validarFotoCarne(input) {
    if (input != null) {
        return input.type == "image/jpeg"; //esto compara el MIME de la imagen - true si el archivo es .jpg o .jpeg
    }
    return false; //si ha habido algun error (la imagen es nula o undefined) devolvemos false;
}

//CALCULO del seguro, se le pasan por parametros todos los datos del usuario necesarios
//devuelve una array que contiene los 4 precios, un presupuesto por cada tipo de vehiculo posible
function calculoSeguro(edad) {
    const FECHACARNET = document.getElementById("fecha_carnet");
    const FECHACOCHE = document.getElementById("fecha_matriculacion");
    //vlaor por posiciones -> 0 = diesel, 1 = gasolina, 2 = hibrido, 3 = electrico
    let output = [];
    //conseguimos los años de carnet y de coche multiplicando la diferencia (en milisegundos) de la fecha actual con la fecha del carnet
    const ANOSCARNET = Math.floor(parseInt(new Date().getTime() - FECHACARNET.getTime()) / (3600 * 24 * 365));
    const ANOSCOCHE = Math.floor(parseInt(new Date().getTime() - FECHACOCHE.getTime()) / (3600 * 24 * 365));
    //esta variable contendrá un numero usado como porcentaje para calcular la penalizacion por antiguedad del coche
    const PENALIZACIONCOCHE = ANOSCOCHE > 10 ? ANOSCOCHE - 10 : 0;

    for (let i = 0; i < 4; i++){
        //uso un switch para calcular cada vez un precio y cada uno de estos se calculará para un tipo de vehiculo, hasta hacer los 4 tipos
        let descuentoAntiguedad = ANOSCOCHE >= 5;
        let preciobase = 0;
        switch (i){
            //(preciobase 500, 650, 750, 1000 + antiguedad del coche a partir de 10 años (20% -> 0%))  + (si es menor de 25 pues total * 1.1 del precio base) 
            //coche diesel
            case 0:
                preciobase = 500 + (500 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                output[0] = preciobase;
                break;
            //coche gasolina
            case 1:
                preciobase = 650 + (650 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                output[1] = preciobase;
                break;
            //coche hibrido
            case 2:
                preciobase = 750 + (750 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                output[2] = preciobase;
                break;
            //coche electrico
            case 3:
                preciobase = 1000 + (1000 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                output[3] = preciobase;
                break;
        }
    }

    return output;
}

//nodo del formulario
const NODOFORM = document.getElementById("form");

//listener de eventos de tipo blur para el formulario
NODOFORM.addEventListener("blur", (evento) => {
    const TARGET = evento.target;

    //tagname devuelve la tag de html del evento que ha sido activado, devuelve el nombre en mayusculas (esto es para asegurarse que es el campo input el que llama)
    if (TARGET.tagName == "INPUT" || TARGET.tagName == "SELECT") {
        //utilizamos una variable booleana para controlar el resultado de una validacion de un campo en especifico
        let isValid = true;
        let valor = TARGET.valor;
        mensajeError = "";

        switch (TARGET.id) {
            case "nombre":
            case "apellidos":
                // Usamos la función para validar nombre y apellido
                isValid = validarNombreApellido(valor);
                mensajeError = "Este campo es obligatorio.";
                break;
            case "fecha_carnet":
                isValid = validarFecha(valor);
                mensajeError = "Introduce una fecha válida para el carnet de conducir.";
                break;
            case "fecha_matriculacion":
                isValid = validarFecha(valor);
                mensajeError = "Introduce una fecha válida para la matriculación.";
                break;
            case "fecha_nacimiento":
                isValid = validarFecha(valor);
                mensajeError = "Introduce una fecha válida de nacimiento.";
                break;
            case "sexo":
                isValid = valor != "";
                mensajeError = "Selecciona un sexo.";
                break;
        }

        //y dependiendo de si el campo es valido o no
        if (!isValid) {
            //añadimos una clase para indicar que el campo es erroneo y le añadimos un mensaje
            TARGET.classList.add("invalido");
            TARGET.setAttribute("data-textoerror", mensajeError);
        } else {
            //y aqui quitamos esta información (por si en algun momento estaba mal escrito, dejar de enseñar el error)
            TARGET.classList.remove("invalido");
            TARGET.removeAttribute("data-textoerror");
        }
    }

});

//listener de eventos de tipo input para el formulario
NODOFORM.addEventListener("input", (evento) => {
    const TARGET = evento.target;

    //tagname devuelve la tag de html del evento que ha sido activado, devuelve el nombre en mayusculas (esto es para asegurarse que es el campo input el que llama)
    if (TARGET.tagName == "INPUT") {
        //utilizamos una variable booleana para controlar el resultado de una validacion de un campo en especifico
        let isValid = true;
        let valor = TARGET.valor;
        mensajeError = "";

        switch (TARGET.id) {
            case "dni":
                isValid = validarDNI(valor);
                mensajeError = "El DNI debe tener 8 números y 1 letra mayúscula.";
                break;
            case "email":
                isValid = validarCorreo(valor);
                mensajeError = "Introduce un correo electrónico válido.";
                break;
            case "codigo_postal":
                isValid = validarCodigoPostal(valor);
                mensajeError = "Introduce un código postal válido.";
                break;
            case "telefono":
                isValid = validarTelefono(valor);
                mensajeError = "Introduce un código postal válido.";
                break;
            case "matricula":
                isValid = validarMatricula(valor);
                mensajeError = "Introduce una matricula que cumpla con el formato"
                break;
        }

        //y dependiendo de si el campo es valido o no
        if (!isValid) {
            //añadimos una clase para indicar que el campo es erroneo y le añadimos un mensaje
            TARGET.classList.add("invalido");
            TARGET.setAttribute("data-textoerror", mensajeError);
        } else {
            //y aqui quitamos esta información (por si en algun momento estaba mal escrito, dejar de enseñar el error)
            TARGET.classList.remove("invalido");
            TARGET.removeAttribute("data-textoerror");
        }
    }

});

//listener para hacer la lista de elecciones basada en el objeto que guarda las comunidades y provincias
NODOCOMUNIDADES.addEventListener("change", () => {

    const PROVINCIAS = OBJ_COMUNIDADES[NODOCOMUNIDADES.value];

    NODOPROVINCIAS.innerHTML = '<option value="" selected disabled>-- Selecciona una provincia --</option>';

    if (PROVINCIAS) {
        //quitar la clase disabled para poder añadir provincias
        NODOPROVINCIAS.disabled = false;

        PROVINCIAS.forEach(function (provincia) {
            const option = document.createElement("option");
            option.value = provincia;
            option.textContent = provincia;
            NODOPROVINCIAS.appendChild(option);
        });
    } else {
        NODOPROVINCIAS.disabled = true;
    }
});

//listener para hacer la lista de elecciones basada en el objeto que guarda las marcas y modelos de coche
NODOMARCAS.addEventListener("change", () => {
    const modelos = MARCAMODELOCOCHE[NODOMARCAS.value];

    NODOMODELOS.innerHTML = '<option value="" selected disabled>-- Selecciona un modelo --</option>';

    if (modelos) {
        NODOMODELOS.disabled = false;

        modelos.forEach(function (modelo) {
            const option = document.createElement("option");
            option.value = modelo;
            option.textContent = modelo;
            NODOMODELOS.appendChild(option);
        });
    } else {
        NODOMODELOS.disabled = true;
    }
});

//listener para que la hora de cargar el contenido del dom para que los formularios tengan siempre los valores por defecto (visual)
document.addEventListener("DOMContentLoaded", () => {

    //ponemos como valor seleccionado el primer indice al "select indepentiente" (que es un indice por defecto) y añadimos un texto por defecto y desabilitamos el select "dependiente"
    NODOMARCAS.selectedIndex = 0;
    NODOCOMUNIDADES.selectedIndex = 0; 
    NODOPROVINCIAS.innerHTML = '<option value="" selected disabled>-- Selecciona un modelo --</option>';
    NODOMODELOS.innerHTML = '<option value="" selected disabled>-- Selecciona un modelo --</option>';
    NODOPROVINCIAS.disabled = true;
    NODOMODELOS.disabled = true;
});
