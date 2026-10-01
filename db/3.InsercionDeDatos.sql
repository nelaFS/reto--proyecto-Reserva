INSERT INTO administrador (identificador, usuario, contrasena)
VALUES (1, 'sabinofc', '$2b$08$qzT/lJ13eq7tZ2g6dOX2nesHQeYcF4nmwe9APRB.JlD81ZhmGkjOO')
ON CONFLICT (identificador) DO UPDATE SET
    usuario = EXCLUDED.usuario,
    contrasena = EXCLUDED.contrasena;

INSERT INTO mesa (identificador, numero_mesa, capacidad, estado)
VALUES
    (1, 1, 2, 'Disponible'), (2, 2, 4, 'Disponible'), (3, 3, 2, 'Disponible'),
    (4, 4, 6, 'Disponible'), (5, 5, 4, 'Disponible'), (6, 6, 4, 'Disponible'),
    (7, 7, 2, 'Disponible'), (8, 8, 8, 'Disponible'), (9, 9, 2, 'Disponible'),
    (10, 10, 6, 'Disponible')
ON CONFLICT (identificador) DO UPDATE SET
    numero_mesa = EXCLUDED.numero_mesa, capacidad = EXCLUDED.capacidad, estado = EXCLUDED.estado;

INSERT INTO tabla_reserva
    (identificador, nombre_cliente, numero_cliente, estado_pedido, numero_mesa, cantidad_personas, fecha_reserva)
VALUES
    (1, 'Ana Martinez', '5551234567', 'Disponible', 1, 2, '2026-10-01 12:30:00'),
    (2, 'Carlos Ramirez', '5552345678', 'Cancelado', 2, 4, '2026-10-01 13:00:00'),
    (3, 'Laura Gomez', '5553456789', 'Disponible', 3, 2, '2026-10-01 14:15:00'),
    (4, 'Miguel Torres', '5554567890', 'Disponible', 4, 6, '2026-10-01 15:00:00'),
    (5, 'Sofia Hernandez', '5555678901', 'Cancelado', 5, 3, '2026-10-01 16:30:00'),
    (6, 'Diego Castillo', '5556789012', 'Disponible', 6, 4, '2026-10-02 12:00:00'),
    (7, 'Valentina Perez', '5557890123', 'Cancelado', 7, 2, '2026-10-02 13:45:00'),
    (8, 'Jorge Navarro', '5558901234', 'Disponible', 8, 8, '2026-10-02 19:00:00'),
    (9, 'Camila Flores', '5559012345', 'Disponible', 9, 2, '2026-10-03 20:15:00'),
    (10, 'Fernando Ruiz', '5550123456', 'Cancelado', 10, 5, '2026-10-03 21:00:00')
ON CONFLICT (identificador) DO UPDATE SET
    nombre_cliente = EXCLUDED.nombre_cliente, numero_cliente = EXCLUDED.numero_cliente,
    estado_pedido = EXCLUDED.estado_pedido, numero_mesa = EXCLUDED.numero_mesa,
    cantidad_personas = EXCLUDED.cantidad_personas, fecha_reserva = EXCLUDED.fecha_reserva;

INSERT INTO plato (identificador, nombre, descripcion, imagen, precio, categoria, disponible)
VALUES
    (1, 'Majadito Cruceño', 'Arroz con charque, huevo y platano maduro.', '/images/menu/majadito.svg', 42.00, 'Tradicional', TRUE),
    (2, 'Silpancho Oriental', 'Carne apanada, arroz, papa y ensalada fresca.', '/images/menu/silpancho.svg', 48.00, 'Tradicional', TRUE),
    (3, 'Pique Macho Sabino', 'Carne, chorizo, papas y la salsa de la casa.', '/images/menu/pique.svg', 58.00, 'Para compartir', TRUE)
ON CONFLICT (identificador) DO UPDATE SET
    nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion, imagen = EXCLUDED.imagen,
    precio = EXCLUDED.precio, categoria = EXCLUDED.categoria, disponible = EXCLUDED.disponible;

INSERT INTO evento (identificador, nombre, descripcion, imagen, fecha, hora, estado)
VALUES
    (1, 'Viernes de Jazz Tropical', 'Musica en vivo y cocteles de autor.', '/images/events/jazz.svg', '2026-10-09', '20:30:00', 'Activo'),
    (2, 'Noche de Sabores Cruceños', 'Menu especial de temporada.', '/images/events/sabores.svg', '2026-10-17', '19:00:00', 'Activo')
ON CONFLICT (identificador) DO UPDATE SET
    nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion, imagen = EXCLUDED.imagen,
    fecha = EXCLUDED.fecha, hora = EXCLUDED.hora, estado = EXCLUDED.estado;

INSERT INTO promocion (identificador, titulo, descripcion, imagen, descuento, fecha_inicio, fecha_fin, estado)
VALUES
    (1, 'Mesa de dos', 'Entrada para compartir y dos bebidas de la casa.', '/images/promos/dos.svg', 15.00, '2026-10-01', '2026-10-31', 'Activa'),
    (2, 'Jueves de amigos', '15% de descuento en piqueos para compartir.', '/images/promos/amigos.svg', 15.00, '2026-10-01', '2026-10-31', 'Activa')
ON CONFLICT (identificador) DO UPDATE SET
    titulo = EXCLUDED.titulo, descripcion = EXCLUDED.descripcion, imagen = EXCLUDED.imagen,
    descuento = EXCLUDED.descuento, fecha_inicio = EXCLUDED.fecha_inicio,
    fecha_fin = EXCLUDED.fecha_fin, estado = EXCLUDED.estado;

-- Los datos semilla usan identificadores explicitos; sincroniza las identidades
-- para que los siguientes INSERT generen valores posteriores al maximo actual.
SELECT setval(pg_get_serial_sequence('administrador', 'identificador'), COALESCE(MAX(identificador), 1), MAX(identificador) IS NOT NULL) FROM administrador;
SELECT setval(pg_get_serial_sequence('tabla_reserva', 'identificador'), COALESCE(MAX(identificador), 1), MAX(identificador) IS NOT NULL) FROM tabla_reserva;
SELECT setval(pg_get_serial_sequence('mesa', 'identificador'), COALESCE(MAX(identificador), 1), MAX(identificador) IS NOT NULL) FROM mesa;
SELECT setval(pg_get_serial_sequence('plato', 'identificador'), COALESCE(MAX(identificador), 1), MAX(identificador) IS NOT NULL) FROM plato;
SELECT setval(pg_get_serial_sequence('evento', 'identificador'), COALESCE(MAX(identificador), 1), MAX(identificador) IS NOT NULL) FROM evento;
SELECT setval(pg_get_serial_sequence('promocion', 'identificador'), COALESCE(MAX(identificador), 1), MAX(identificador) IS NOT NULL) FROM promocion;
