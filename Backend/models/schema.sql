CREATE TABLE IF NOT EXISTS temp_Empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  nit VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  telefono VARCHAR(10), 
  direccion VARCHAR(200),
  regimen VARCHAR(6) NOT NULL,
  nombre_admin VARCHAR(50) NOT NULL,
  correo_admin VARCHAR(50) NOT NULL,
  telefono_admin VARCHAR(10) NOT NULL,
  codigo_verificacion INT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  codigo_fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  nit VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  direccion VARCHAR(200),
  telefono VARCHAR(10),
  regimen VARCHAR(6) NOT NULL,
  certificado VARCHAR(64),
  certificado_fecha TIMESTAMP, 
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuariosDian (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

