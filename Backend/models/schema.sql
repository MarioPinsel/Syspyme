CREATE TABLE IF NOT EXISTS temp_Empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  nit VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  codigo_verificacion INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  nit VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS temp_Usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  handle VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  codigo_verificacion INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  handle VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  codigo_verificacion INT,
  codigo_fecha TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    tipo_Producto VARCHAR(100) NOT NULL,
    descripcion JSONB NOT NULL,
    precio_Unitario INT NOT NULL,
    cantidad INT
);

CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    id_producto INT,
    fecha_Ingreso TIMESTAMP DEFAULT NOW(),
    estado VARCHAR (1),
  FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS vendidos (
    id SERIAL PRIMARY KEY,
    id_producto INT,
    fecha_Venta TIMESTAMP DEFAULT NOW(),
    factura_Id INT,
  FOREIGN KEY (id_producto) REFERENCES productos(id)
);

