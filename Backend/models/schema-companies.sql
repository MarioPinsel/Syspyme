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

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  documento INT UNIQUE NOT NULL,
  telefono INT,
  correo VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  tipo_producto VARCHAR(100) NOT NULL,
  descripcion JSONB NOT NULL,
  precio_unitario NUMERIC(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventario (
  id SERIAL PRIMARY KEY,
  id_producto INT NOT NULL,
  fecha_ingreso TIMESTAMPTZ DEFAULT NOW(),
  cantidad INT NOT NULL,
  FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  precio_total NUMERIC(10) NOT NULL,
  fecha_Venta TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  cufe VARCHAR(255) UNIQUE,
  factura_XML xml,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS detalles_factura (
  id SERIAL PRIMARY KEY,
  factura_id INT NOT NULL,
  producto_id INT NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  descripcion JSONB NOT NULL,
  unidades INT NOT NULL,
  total NUMERIC(15),
  FOREIGN KEY (factura_id) REFERENCES facturas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);
