import { useState } from "react";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { toast } from "sonner";
import "../../styles/Sales/CreateSale.css";

export default function CrearVenta() {
  const [clienteId, setClienteId] = useState("");
  const [producto, setProducto] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const [cuotas, setCuotas] = useState("");

  const [items, setItems] = useState([]);

  const handleAddProduct = () => {
    if (!codigo.trim()) return toast.error("Debes ingresar el código del producto");
    if (!cantidad || Number(cantidad) <= 0)
      return toast.error("La cantidad debe ser mayor a cero");

    const newItem = {
      code: codigo.trim(),
      quantity: Number(cantidad),
    };

    setItems([...items, newItem]);

    setProducto("");
    setCodigo("");
    setCantidad("");
  };

  const handleRemoveProduct = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    toast.success("Producto eliminado");
  };

  const handleCreateSale = async () => {
    if (!clienteId.trim()) return toast.error("Debes ingresar el documento del cliente");
    if (!/^[0-9]+$/.test(clienteId.trim()))
      return toast.error("El documento solo puede contener números");
    if (items.length === 0) return toast.error("Debes agregar al menos un producto");
    if (!metodoPago) return toast.error("Debes seleccionar un método de pago");
    if (!tipoPago) return toast.error("Debes seleccionar un tipo de pago");

    if (tipoPago === "credito") {
      if (!cuotas || Number(cuotas) <= 0)
        return toast.error("Debes ingresar el número de cuotas");
    }

    const token = Cookies.get("token");

    const body = {
      document: clienteId.trim(),
      items,
      paymentMethod: metodoPago.toUpperCase(),
      paymentType: tipoPago.toUpperCase(),
      creditTerm: tipoPago === "credito" ? Number(cuotas) : 0,
    };

    try {
      const { data } = await api.post("/sales/createSale", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Venta realizada con éxito");

      setItems([]);
      setClienteId("");
      setMetodoPago("");
      setTipoPago("");
      setCuotas("");
    } catch (error) {
      const msg = error.response?.data?.error;

      if (msg === "El cliente no existe") {
        toast.error("El cliente no existe — verifica el documento");
        document.getElementById("cliente")?.focus();
        return;
      }

      toast.error(msg || "Error creando la venta");
    }
  };

  return (
    <div className="venta-container">
      <h2 className="titulo-venta">Crear Venta</h2>

      <div className="documento-box">
        <h3>Datos</h3>

        <div className="campo">
          <label htmlFor="cliente">Documento del Cliente:</label>
          <input
            type="text"
            id="cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            placeholder="Ej: 1033698815"
          />
        </div>

        <div className="campo">
          <label htmlFor="producto">Producto:</label>
          <input
            type="text"
            id="producto"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            placeholder="Ej: Arroz 500g"
          />
        </div>

        <div className="campo">
          <label htmlFor="codigo">Código:</label>
          <input
            type="text"
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej: PRODU-001"
          />
        </div>

        <div className="campo">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            min="1"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="1"
          />
        </div>

        <button className="btn-add" onClick={handleAddProduct}>
          Añadir
        </button>
      </div>

      <div className="lista-box">
        <h3>Productos Agregados</h3>

        {items.length === 0 && (
          <p className="item-ejemplo">Aún no agregas productos.</p>
        )}

        {items.map((item, index) => (
          <div key={index} className="item-ejemplo">
            <span>
              Código: <b>{item.code}</b> — Cantidad: <b>{item.quantity}</b>
            </span>
            <button className="btn-remove" onClick={() => handleRemoveProduct(index)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="pago-box">
        <h3>Método de Pago</h3>

        <div className="campo">
          <label>Método:</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="">Selecciona método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        <div className="campo">
          <label>Tipo de Pago:</label>
          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
          >
            <option value="">Selecciona tipo</option>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>
        </div>

        {tipoPago === "credito" && (
          <div className="campo">
            <label htmlFor="cuotas">Cuotas:</label>
            <input
              type="number"
              min="1"
              id="cuotas"
              value={cuotas}
              onChange={(e) => setCuotas(e.target.value)}
              placeholder="Ej: 12"
            />
          </div>
        )}
      </div>

      <div className="acciones">
        <button className="btn-realizar" onClick={handleCreateSale}>
          Realizar Venta
        </button>
      </div>
    </div>
  );
}
