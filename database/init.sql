CREATE TABLE socios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(150),
  fecha_alta DATE NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE entrenadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100)
);

CREATE TABLE clases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  entrenador_id INT,
  dia_semana ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo'),
  hora_inicio TIME,
  hora_fin TIME,
  aforo_max INT DEFAULT 20,
  FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id)
    ON DELETE SET NULL
);

CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  socio_id INT NOT NULL,
  clase_id INT NOT NULL,
  fecha_reserva DATE NOT NULL,
  estado ENUM('confirmada','cancelada') DEFAULT 'confirmada',
  FOREIGN KEY (socio_id) REFERENCES socios(id)
    ON DELETE CASCADE,
  FOREIGN KEY (clase_id) REFERENCES clases(id)
    ON DELETE CASCADE
);

CREATE TABLE cuotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  socio_id INT NOT NULL,
  importe DECIMAL(6,2) NOT NULL,
  fecha_pago DATE NOT NULL,
  mes_correspondiente DATE NOT NULL,
  metodo_pago ENUM('efectivo','tarjeta','transferencia') DEFAULT 'tarjeta',
  FOREIGN KEY (socio_id) REFERENCES socios(id)
    ON DELETE CASCADE
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','entrenador','socio') NOT NULL DEFAULT 'socio',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);