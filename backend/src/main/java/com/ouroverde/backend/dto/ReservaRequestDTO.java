package com.ouroverde.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReservaRequestDTO {
    private Integer idCliente;
    private Integer idServico;
    private LocalDate dataEvento;
    private LocalDateTime dataHoraEvento;
    private Integer quantidadeParcelas;
    private List<ItemReservaDTO> itens;
}
