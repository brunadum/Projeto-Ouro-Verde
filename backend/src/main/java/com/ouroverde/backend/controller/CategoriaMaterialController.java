package com.ouroverde.backend.controller;

import com.ouroverde.backend.model.CategoriaMaterial;
import com.ouroverde.backend.repository.CategoriaMaterialRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaMaterialController {

    private final CategoriaMaterialRepository repository;

    public CategoriaMaterialController(CategoriaMaterialRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CategoriaMaterial> listarCategorias() {
        return repository.findAll();
    }

    @PostMapping
    public CategoriaMaterial cadastrarCategoria(@RequestBody CategoriaMaterial novaCategoria) {
        return repository.save(novaCategoria);
    }
}
