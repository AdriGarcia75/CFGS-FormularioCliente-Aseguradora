//nodo del formulario
const NODOFORM = document.getElementById("form");

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
    return /^\d{8}[A-Z]$/.test(input);
}

//devolverá true de 18 hasta 90 años de edad, a partir de una fecha
function validarEdad(input) {
    const INPUTDATE = new Date(input); //sabemos que input es un string con el formato YYYY-MM-DD, el que usa el objeto Date
    const AHORA = new Date(); //esto crea un nuevo objeto fecha con la fecha del momento de ejecucion (siendo "ahora" el momento cuando se ejecute)
    const EDAD = AHORA.getFullYear() - INPUTDATE.getFullYear(); //restamos las fechas, y hacemos esta conversion: ms -> sec -> hora -> 
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
    const FECHACARNET = document.getElementById("fecha_carnet").value; // Obtener el valor como string
    const FECHACOCHE = document.getElementById("fecha_matriculacion").value; // Obtener el valor como string

    // Convertir los valores de fecha a objetos Date
    const fechaCarnet = new Date(FECHACARNET);
    const fechaCoche = new Date(FECHACOCHE);

    let output = [];

    // Conseguimos los años de carnet y de coche multiplicando la diferencia (en milisegundos) de la fecha actual con la fecha del carnet
    const ANOSCARNET = Math.floor((new Date().getTime() - fechaCarnet.getTime()) / (3600 * 24 * 365 * 1000));
    const ANOSCOCHE = Math.floor((new Date().getTime() - fechaCoche.getTime()) / (3600 * 24 * 365 * 1000));

    // Esta variable contendrá un número usado como porcentaje para calcular la penalización por antigüedad del coche
    const PENALIZACIONCOCHE = ANOSCOCHE > 10 ? ANOSCOCHE - 10 : 0;

    for (let i = 0; i < 4; i++) {
        let descuentoAntiguedad = ANOSCOCHE >= 5;
        let preciobase = 0;

        //aumento del 10% si la edad es menor a 25
        let aumentoEdad = edad < 25 ? 0.1 : 0;

        switch (i) {
            //(preciobase 500, 650, 750, 1000 + antiguedad del coche a partir de 10 años (20% -> 0%))  + (si es menor de 25 pues total * 1.1 del precio base) 
            //coche diesel
            case 0: 
                preciobase = 500 + (500 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                preciobase += preciobase * aumentoEdad;
                output[0] = preciobase;
                break;
            //coche gasolina
            case 1: 
                preciobase = 650 + (650 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                preciobase += preciobase * aumentoEdad;
                output[1] = preciobase;
                break;
            //coche hibrido
            case 2:
                preciobase = 750 + (750 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                preciobase += preciobase * aumentoEdad;
                output[2] = preciobase;
                break;
            //coche electrico
            case 3:
                preciobase = 1000 + (1000 * (PENALIZACIONCOCHE / 100));
                preciobase = preciobase - (descuentoAntiguedad ? preciobase * 0.1 : 0) + (ANOSCARNET < 5 ? preciobase * 0.1 : 0);
                preciobase += preciobase * aumentoEdad;
                output[3] = preciobase;
                break;
        }
    }

    return output;
}

//funcion que unifica la validacion de cualquier campo, cada dato del campo que ejecute esto será validado por la función que le pertoque
function validarCampo(TARGET) {
    let isValid = true;
    let mensajeError = "";
    const valor = TARGET.value;

    // Switch que ejecuta la validación según el ID del campo
    switch (TARGET.id) {

        case "nombre":
        case "apellidos":
            isValid = validarNombreApellido(valor);
            mensajeError = "Debe tener entre 3 y 30 caracteres, comenzando en mayúscula.";
            break;

        case "fecha_nacimiento":
        case "fecha_carnet":
        case "fecha_matriculacion":

            isValid = validarFecha(valor);
            mensajeError = "Introduce una fecha válida.";
            break;

        case "dni":
            isValid = validarDNI(valor);
            mensajeError = "El DNI debe tener 8 números y 1 letra mayúscula.";
            break;

        case "email":
            isValid = validarCorreo(valor);
            mensajeError = "Formato de correo inválido.";
            break;

        case "telefono":
            isValid = validarTelefono(valor);
            mensajeError = "El teléfono debe tener 9 dígitos.";
            break;

        case "matricula":
            isValid = validarMatricula(valor);
            mensajeError = "La matrícula debe seguir el formato dddd-CCC.";
            break;

        case "codigo_postal":
            isValid = validarCodigoPostal(valor);
            mensajeError = "El código postal debe tener 5 dígitos.";
            break;

        case "sexo":
            isValid = valor !== "";
            mensajeError = "Este campo es obligatorio.";
            break;
    }

    //aqui se aplica o se elimina la clase con el estilizado de "data-textoerror"
    if (!isValid) {
        TARGET.classList.add("invalido");
        TARGET.setAttribute("data-textoerror", mensajeError);
    } else {
        TARGET.classList.remove("invalido");
        TARGET.removeAttribute("data-textoerror");
    }
}

//listener para los eventos blur
NODOFORM.addEventListener("blur", (evento) => {
    const TARGET = evento.target;

    //le asigno a los campos con el id que aparece aqui este evento
    if (["nombre", "apellidos", "fecha_nacimiento", "fecha_carnet", "fecha_matriculacion"].includes(TARGET.id)) {
        validarCampo(TARGET);
    }
});

//listener para los eventos input
NODOFORM.addEventListener("input", (evento) => {
    const TARGET = evento.target;

    //le asigno a los campos con el id que aparece aqui este evento
    if (["dni", "email", "telefono", "matricula", "codigo_postal"].includes(TARGET.id)) {
        validarCampo(TARGET);
    }
});

//listener para hacer la lista de elecciones basada en comunidades/provincias
NODOCOMUNIDADES.addEventListener("change", () => {
    const provincias = OBJ_COMUNIDADES[NODOCOMUNIDADES.value]; //esto recoge la array que toca de provincias

    NODOPROVINCIAS.innerHTML = '<option value="" selected disabled>-- Elije una opción --</option>';

    if (provincias) {
        NODOPROVINCIAS.disabled = false;

        provincias.forEach(function (provincia) {
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
    const modelos = MARCAMODELOCOCHE[NODOMARCAS.value]; //esto recoge la array que toca de modelos de coche

    NODOMODELOS.innerHTML = '<option value="" selected disabled>-- Elije una opción --</option>';

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

//listener para que la hora de cargar el contenido del dom los formularios tengan siempre los valores por defecto (es visual, pero lo veo necesario)
document.addEventListener("DOMContentLoaded", () => {

    //ponemos como valor seleccionado el primer indice al "select indepentiente" (que es un indice por defecto) y añadimos un texto por defecto y desabilitamos el select "dependiente"
    NODOMARCAS.selectedIndex = 0;
    NODOCOMUNIDADES.selectedIndex = 0;
    NODOPROVINCIAS.innerHTML = '<option value="" selected disabled>-- Elije una opción --</option>';
    NODOMODELOS.innerHTML = '<option value="" selected disabled>-- Elije una opción --</option>';
    NODOPROVINCIAS.disabled = true;
    NODOMODELOS.disabled = true;
});

//function de submit que valida todos los datos antes de operar
NODOFORM.addEventListener("submit", function (e) {
    e.preventDefault();

    //controlaremos si todos los campos se verifican
    let todosValidos = true;
    //seleccionamos TODOS los datos del form, que son contenidos en inputs y selects
    const inputs = NODOFORM.querySelectorAll("input, select");

    //para cada input
    inputs.forEach(input => {
        const valor = input.value;
        let isValid = true;
        let mensajeError = "";

        //hacemos un switch para que se valide como toque
        switch (input.id) {
            case "nombre":
                isValid = validarNombreApellido(valor);
                mensajeError = "Debe tener entre 3 y 30 caracteres, comenzando en mayúscula.";
                break;
            case "apellidos":
                isValid = validarNombreApellido(valor);
                mensajeError = "Debe tener entre 3 y 30 caracteres, comenzando en mayúscula.";
                break;
            case "fecha_nacimiento":
                isValid = validarEdad(valor);
                mensajeError = "Introduce una fecha válida entre 18 y 90 años.";
                break;
            case "fecha_carnet":
                isValid = validarFecha(valor);
                mensajeError = "Introduce una fecha válida.";
                break;
            case "fecha_matriculacion":
                isValid = validarFecha(valor);
                mensajeError = "Introduce una fecha válida.";
                break;
            case "dni":
                isValid = validarDNI(valor);
                mensajeError = "El DNI debe tener 8 números y 1 letra mayúscula.";
                break;
            case "email":
                isValid = validarCorreo(valor);
                mensajeError = "Formato de correo inválido.";
                break;
            case "telefono":
                isValid = validarTelefono(valor);
                mensajeError = "El teléfono debe tener 9 dígitos.";
                break;
            case "matricula":
                isValid = validarMatricula(valor);
                mensajeError = "La matrícula debe seguir el formato dddd-CCC.";
                break;
            case "codigo_postal":
                isValid = validarCodigoPostal(valor);
                mensajeError = "El código postal debe tener 5 dígitos.";
                break;
            case "sexo":
                isValid = valor != "";
                mensajeError = "Este campo es obligatorio.";
                break;
        }

        if (!isValid) {
            input.classList.add("invalido");
            input.setAttribute("data-textoerror", mensajeError);
            todosValidos = false;
        } else {
            input.classList.remove("invalido");
            input.removeAttribute("data-textoerror");
        }
    });

    //si todo se ha validado
    if (todosValidos) {
        const MARCA = document.getElementById("marca").value;
        const MODELO = document.getElementById("modelo").value;
        const EDAD = document.getElementById("fecha_nacimiento").value;

        const PRECIOS = calculoSeguro(EDAD);

        //creamos el contenedor de seguros y le damos una clase
        const CONTENEDORSEGUROS = document.createElement("div");
        CONTENEDORSEGUROS.classList.add("contenedor-seguro");

        
        const TIPOSSEGURO = ["Terceros", "Terceros Ampliado", "Con Franquicia", "Todo Riesgo"];

        //miramos a ver que seguro ha elegido en concreto nuestro cliente
        const SEGUROCLIENTE = document.getElementById("tipo_seguro").value;

        //añadimos cada div con su respectivo precio y el indice que indica que seguro es
        PRECIOS.forEach((precio, index) => {
            const DIVSEGURO = document.createElement("div");
            DIVSEGURO.classList.add("seguro");

            //aqui haremos la distincion dandole una clase al div respecto al seguro que el cliente eligió en un principio
            //NO FUNCIONA, MIRALO
            if (index == SEGUROCLIENTE) {
                DIVSEGURO.classList.add("resaltado");
            }

            //creamos nuestro hijo y le hacemos append al padre
            DIVSEGURO.innerHTML = `
                <h3>Seguro ${TIPOSSEGURO[index]}</h3>
                <p>Marca: ${MARCA}</p>
                <p>Modelo: ${MODELO}</p>
                <p>Tipo de Seguro: ${TIPOSSEGURO[index]}</p>
                <p>Precio: ${precio.toFixed(2)} €</p>
                <button class="eliminar">Eliminar</button>
            `;
            CONTENEDORSEGUROS.appendChild(DIVSEGURO);
        });

        //añadimos al body nuestro contenedor de seguros, que contiene los 4 seguros
        document.body.appendChild(CONTENEDORSEGUROS);

        const BOTONELIMINAR = CONTENEDORSEGUROS.querySelectorAll(".eliminar");

        BOTONELIMINAR.forEach(boton => {
            boton.addEventListener("click", function() {
                const DIVSEGURO = boton.closest(".seguro");
                DIVSEGURO.remove();
            });
        });
    } else {
        alert("Hay errores en los datos ingresados. Chequea si algún campo está resaltado en rojo.");
    }
});