package com.ejemplo.pedidos.controller;

import com.ejemplo.pedidos.model.Pedido;
import com.ejemplo.pedidos.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class PedidoController {

    private final PedidoService pedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/pedidos")
    public ResponseEntity<Object> crearPedido(@RequestBody Pedido pedido) {
        try {
            Pedido nuevo = pedidoService.crearPedido(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/usuarios/{id}/pedidos")
    public ResponseEntity<List<Pedido>> listarPedidosPorUsuario(@PathVariable Long id) {
        List<Pedido> pedidos = pedidoService.listarPedidosPorUsuario(id);
        return ResponseEntity.ok(pedidos);
    }
}
