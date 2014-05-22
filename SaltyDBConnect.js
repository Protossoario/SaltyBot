var mysql = require('mysql');
var pool = mysql.createPool({
    host	: 'localhost',
    user	: 'root',
    password	: 'romero',
    database	: 'SaltyDB'
});

var addEscapeChars = function(str) {
    str.replace(/\'/g, "\\\'");
    str.replace(/\"/g, "\\\"");
    return str;
}

/* Envia un query a la base de datos con dos parametros */
var querySaltyDB = function(query, response) {
    pool.getConnection(function(err, connection) {
        if (err) {
	    console.error('Error connecting to SaltyDB: ' + err.stack);
	    return;
	}
	connection.query(query, response);
	connection.release();
    });
}

/* Valida si un personaje esta en la base de datos, y si no, lo agrega */
var addFighter = function(name) {
    name = addEscapeChars(name);
    var query = 'SELECT * FROM Fighter WHERE name=\'' + name + '\'';
    var response = function(err, rows) {
        if (err) {
	    console.error('Error buscando al fighter: ' + name + ' ' + err.stack);
	}
	// Checar que haya un resultado en el query y que sea el nombre buscado
	if (rows.length > 0 && rows[0].name == name) {
	    console.log('Fighter already exists in the Salty DB: ' + name);
	}
	// Insertar el personaje a la base de datos
	else {
	    // Llamada al query para insertar un nuevo personaje a la base de datos
	    querySaltyDB('INSERT INTO Fighter (name) VALUES (\'' + name + '\')', function(err) {
	        if (err) {
		    console.error('Error al insertar nuevo fighter: ' + name);
		}
		else {
		    console.log('Nuevo fighter agregado a la base de datos: ' + name);
		}
	    });
        }
    };
    querySaltyDB(query, response); // Llamada al query para buscar el nombre
}

/* Inserta los datos de una nueva pelea a la base de datos */
var addFight = function(p1name, p2name, p1pot, p2pot, winner) {
    p1name = addEscapeChars(p1name);
    p2name = addEscapeChars(p2name);
    var query = 'INSERT INTO Fight VALUES ' + 
		'(NULL, ' +
		'\'' + p1name + '\'' + ', ' +
		'\'' + p2name + '\'' + ', ' +
		p1pot + ', ' +
		p2pot + ', ' +
		winner + ', ' +
		'NOW())';
    var response = function(err, rows) {
        if (err) {
	    console.error('Error on the new fight query: ' + err.stack);
	}
	console.log(rows);
    };
    querySaltyDB(query, response);
}

exports.addFighter = addFighter;
exports.addFight = addFight;
