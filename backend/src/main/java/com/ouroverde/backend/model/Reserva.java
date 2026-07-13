package com.ouroverde.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Integer idReserva;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_servico", nullable = false)
    private Servico servico;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataSolicitacao;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataEvento;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime dataHoraEvento;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;
}