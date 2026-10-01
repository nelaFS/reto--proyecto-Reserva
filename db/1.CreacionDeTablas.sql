CREATE TABLE IF NOT EXISTS administrador (
    identificador INTEGER,
    usuario VARCHAR(255),
    contrasena VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tabla_reserva (
    identificador INTEGER,
    nombre_cliente VARCHAR(100),
    numero_cliente VARCHAR(20),
    estado_pedido VARCHAR(20),
    numero_mesa INTEGER,
    cantidad_personas INTEGER,
    fecha_reserva TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mesa (
    identificador INTEGER,
    numero_mesa INTEGER,
    capacidad INTEGER,
    estado VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS plato (
    identificador INTEGER,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    imagen VARCHAR(255),
    precio NUMERIC(10, 2),
    categoria VARCHAR(50),
    disponible BOOLEAN
);

CREATE TABLE IF NOT EXISTS evento (
    identificador INTEGER,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    imagen VARCHAR(255),
    fecha DATE,
    hora TIME,
    estado VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS promocion (
    identificador INTEGER,
    titulo VARCHAR(100),
    descripcion VARCHAR(255),
    imagen VARCHAR(255),
    descuento NUMERIC(5, 2),
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(20)
);
