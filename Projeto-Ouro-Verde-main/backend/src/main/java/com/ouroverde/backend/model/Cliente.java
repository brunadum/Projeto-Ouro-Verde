package com.ouroverde.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "cpf_cnpj", nullable = false, unique = true, length = 20)
    private String cpfCnpj;

    @Column(length = 150)
    private String rua;

    @Column(length = 20)
    private String numero;

    @Column(length = 100)
    private String bairro;

    @Column(length = 100)
    private String cidade;

    @Column(length = 20)
    private String cep;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("cliente")
    private java.util.List<TelefoneCliente> telefones;
}