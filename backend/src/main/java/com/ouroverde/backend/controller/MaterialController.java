package com.ouroverde.backend.controller;

import com.ouroverde.backend.model.Material;
import com.ouroverde.backend.repository.MaterialRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiais")
public class MaterialController {

    private final MaterialRepository repository;

    public MaterialController(MaterialRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Material> listarCatalogo() {
        return repository.findAll();
    }

    @PostMapping
    public Material cadastrarMaterial(@RequestBody Material novoMaterial) {
        return repository.save(novoMaterial);
    }

    @PutMapping("/{id}")
    public Material atualizarMaterial(@PathVariable Integer id, @RequestBody Material materialAtualizado) {

        Material materialExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado com o ID: " + id));

        materialExistente.setNome(materialAtualizado.getNome());
        materialExistente.setQuantidadeEstoque(materialAtualizado.getQuantidadeEstoque());
        materialExistente.setPrecoUnitario(materialAtualizado.getPrecoUnitario());
        materialExistente.setCategoria(materialAtualizado.getCategoria());

        return repository.save(materialExistente);
    }

    @DeleteMapping("/{id}")
    public void deletarMaterial(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
