package com.ejemplo.articulos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {"com.ejemplo.articulos", "com.ejemplo.pedidos", "com.ejemplo.usuarios"})
@EntityScan(basePackages = {"com.ejemplo.articulos", "com.ejemplo.pedidos", "com.ejemplo.usuarios"})
public class ArticuloApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ArticuloApiApplication.class, args);
    }
}
