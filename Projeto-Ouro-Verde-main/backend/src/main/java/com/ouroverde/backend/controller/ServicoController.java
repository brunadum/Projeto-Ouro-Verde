package com.ouroverde.backend.controller;

import com.ouroverde.backend.model.Servico;
import com.ouroverde.backend.repository.ServicoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    private final ServicoRepository repository;

    public ServicoController(ServicoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Servico> listarServicos() {
        return repository.findAll();
    }

    @PostMapping
    public Servico cadastrarServico(@RequestBody Servico novoServico) {
        return repository.save(novoServico);
    }

    @PutMapping("/{id}")
    public Servico atualizarServico(@PathVariable Integer id, @RequestBody Servico servicoAtualizado) {
        Servico servicoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado com o ID: " + id));

        servicoExistente.setNome(servicoAtualizado.getNome());
        servicoExistente.setDescricao(servicoAtualizado.getDescricao());
        servicoExistente.setPrecoBase(servicoAtualizado.getPrecoBase());

        return repository.save(servicoExistente);
    }

    @DeleteMapping("/{id}")
    public void deletarServico(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}