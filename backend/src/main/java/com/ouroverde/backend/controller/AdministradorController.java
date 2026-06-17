package com.ouroverde.backend.controller;

import com.ouroverde.backend.model.Administrador;
import com.ouroverde.backend.repository.AdministradorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    private final AdministradorRepository repository;

    public AdministradorController(AdministradorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Administrador> listarAdministradores() {
        return repository.findAll();
    }

    @PostMapping
    public Administrador cadastrarAdministrador(@RequestBody Administrador novoAdmin) {
        return repository.save(novoAdmin);
    }

    @PutMapping("/{id}")
    public Administrador atualizarAdministrador(@PathVariable Integer id, @RequestBody Administrador adminAtualizado) {
        Administrador adminExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado com o ID: " + id));

        adminExistente.setNome(adminAtualizado.getNome());
        adminExistente.setEmail(adminAtualizado.getEmail());
        adminExistente.setSenha(adminAtualizado.getSenha());

        return repository.save(adminExistente);
    }

    @DeleteMapping("/{id}")
    public void deletarAdministrador(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}