package com.ejemplo.pedidos.service;

import com.ejemplo.articulos.model.Articulo;
import com.ejemplo.articulos.repository.ArticuloRepository;
import com.ejemplo.pedidos.model.LineaPedido;
import com.ejemplo.pedidos.model.Pedido;
import com.ejemplo.pedidos.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ArticuloRepository articuloRepository;

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, ArticuloRepository articuloRepository) {
        this.pedidoRepository = pedidoRepository;
        this.articuloRepository = articuloRepository;
    }

    public Pedido crearPedido(Pedido pedido) {
        double total = 0.0;

        for (LineaPedido linea : pedido.getLineas()) {
            Optional<Articulo> articuloOpt = articuloRepository.findById(linea.getProductoId());
            if (!articuloOpt.isPresent()) {
                throw new RuntimeException("Artículo con id " + linea.getProductoId() + " no encontrado");
            }
            Articulo articulo = articuloOpt.get();

            if (articulo.getStock() < linea.getCantidad()) {
                throw new RuntimeException(
                    "Stock insuficiente para el artículo '" + articulo.getNombre() +
                    "'. Disponible: " + articulo.getStock() + ", solicitado: " + linea.getCantidad()
                );
            }

            articulo.setStock(articulo.getStock() - linea.getCantidad());
            articuloRepository.save(articulo);

            linea.setSubtotal(articulo.getPrecio() * linea.getCantidad());
            total += linea.getSubtotal();
        }

        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("pendiente");
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }
}
