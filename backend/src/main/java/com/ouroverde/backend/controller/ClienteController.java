package com.ouroverde.backend.controller;

import com.ouroverde.backend.model.Cliente;
import com.ouroverde.backend.repository.ClienteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteRepository repository;

    public ClienteController(ClienteRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Cliente> listarClientes() {
        return repository.findAll();
    }

    @PostMapping
    public Cliente cadastrarCliente(@RequestBody Cliente novoCliente) {
        return repository.save(novoCliente);
    }

    @PutMapping("/{id}")
    public Cliente atualizarCliente(@PathVariable Integer id, @RequestBody Cliente clienteAtualizado) {

        Cliente clienteExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + id));

        clienteExistente.setNome(clienteAtualizado.getNome());
        clienteExistente.setCpfCnpj(clienteAtualizado.getCpfCnpj());
        clienteExistente.setRua(clienteAtualizado.getRua());
        clienteExistente.setNumero(clienteAtualizado.getNumero());
        clienteExistente.setBairro(clienteAtualizado.getBairro());
        clienteExistente.setCidade(clienteAtualizado.getCidade());
        clienteExistente.setCep(clienteAtualizado.getCep());

        return repository.save(clienteExistente);
    }

    @DeleteMapping("/{id}")
    public void deletarCliente(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}