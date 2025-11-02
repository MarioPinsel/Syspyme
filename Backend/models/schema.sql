CREATE TABLE temp_Empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  nit VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  codigo_verificacion INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  nit VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE temp_Usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  handle VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  codigo_verificacion INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  handle VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  codigo_verificacion INT,
  codigo_fecha TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    tipo_Producto VARCHAR(100) NOT NULL,
    descripción VARCHAR(100) NOT NULL,
    precio_Unitario INT NOT NULL,
    cantidad INT
);

CREATE TABLE inventario(
    id SERIAL PRIMARY KEY,
    código VARCHAR (15),
    id_producto INT,
    fecha_Ingreso TIMESTAMP DEFAULT NOW (),
    estado VARCHAR (1),
  FOREIGN KEY (id_producto) REFERENCES producto(id)
);

CREATE TABLE vendido(
    id SERIAL PRIMARY KEY,
  id_producto INT,
    fecha_Venta TIMESTAMP DEFAULT NOW (),
  FOREIGN KEY (id_Producto) REFERENCES producto(id)
);

