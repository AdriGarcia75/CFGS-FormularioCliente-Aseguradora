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

//por hacer
//CALCULO del seguro
function calculoSeguro() {

}

//evento controlador del formulario
const NODOFORM = document.getElementById("form");

//asignar el listener con toda la logica (llamadas a validacion y calculos)

/*hacer dos eventListeners, uno para "blur" (salir del campo) y otro para "input" (a la hora de escribir)
ambas llamaran a distintos tipos de validacion, dependiendo de cuando se quieran validar*/
NODOFORM.addEventListener("blur", (evento) => {
    //con una funcion anonima has de meterle la logica aqui
    //añadir distincion por ID a partir de evento.target

    //añadir llamada al bla bla
});

