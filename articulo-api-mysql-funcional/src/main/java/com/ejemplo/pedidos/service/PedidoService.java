package com.ejemplo.pedidos.service;

import com.ejemplo.pedidos.model.Pedido;
import java.util.List;

public interface PedidoService {
    Pedido crearPedido(Pedido pedido);
    List<Pedido> listarPedidosPorUsuario(Long usuarioId);
}
