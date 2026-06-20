package com.ouroverde.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "parcela")
public class Parcela {

    @EmbeddedId
    private ParcelaId id = new ParcelaId();

    @ManyToOne
    @MapsId("idReserva") // Conecta a reserva ao idReserva dentro do ParcelaId
    @JoinColumn(name = "id_reserva")
    private Reserva reserva;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Column(name = "valor_parcela", nullable = false)
    private BigDecimal valorParcela;

    @Column(name = "status_pagamento", nullable = false, length = 50)
    private String statusPagamento;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;
}
