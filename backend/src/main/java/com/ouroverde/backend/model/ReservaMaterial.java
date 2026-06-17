package com.ouroverde.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "reserva_material")
public class ReservaMaterial {

    @EmbeddedId
    private ReservaMaterialId id = new ReservaMaterialId();

    @ManyToOne
    @MapsId("idReserva")
    @JoinColumn(name = "id_reserva")
    private Reserva reserva;

    @ManyToOne
    @MapsId("idMaterial")
    @JoinColumn(name = "id_material")
    private Material material;

    @Column(name = "quantidade_alocada", nullable = false)
    private Integer quantidadeAlocada;

    @Column(name = "preco_no_momento", nullable = false)
    private BigDecimal precoNoMomento;
}