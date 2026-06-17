package com.ouroverde.backend.controller;

import com.ouroverde.backend.dto.ItemReservaDTO;
import com.ouroverde.backend.dto.ReservaRequestDTO;
import com.ouroverde.backend.model.*;
import com.ouroverde.backend.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaRepository reservaRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;
    private final MaterialRepository materialRepository;
    private final ReservaMaterialRepository reservaMaterialRepository;
    private final ParcelaRepository parcelaRepository;

    public ReservaController(ReservaRepository reservaRepository,
                             ClienteRepository clienteRepository,
                             ServicoRepository servicoRepository,
                             MaterialRepository materialRepository,
                             ReservaMaterialRepository reservaMaterialRepository,
                             ParcelaRepository parcelaRepository) {
        this.reservaRepository = reservaRepository;
        this.clienteRepository = clienteRepository;
        this.servicoRepository = servicoRepository;
        this.materialRepository = materialRepository;
        this.reservaMaterialRepository = reservaMaterialRepository;
        this.parcelaRepository = parcelaRepository;
    }

    @PostMapping
    @Transactional
    public String criarReserva(@RequestBody ReservaRequestDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + dto.getIdCliente()));

        Servico servico = servicoRepository.findById(dto.getIdServico())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado com o ID: " + dto.getIdServico()));

        Reserva reserva = new Reserva();
        reserva.setCliente(cliente);
        reserva.setServico(servico);
        reserva.setDataSolicitacao(LocalDate.now());
        reserva.setDataEvento(dto.getDataEvento());
        reserva.setDataHoraEvento(dto.getDataHoraEvento());
        reserva.setStatus("PENDENTE");

        BigDecimal valorTotal = servico.getPrecoBase();

        Reserva reservaSalva = reservaRepository.save(reserva);

        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            for (ItemReservaDTO itemDto : dto.getItens()) {
                Material material = materialRepository.findById(itemDto.getIdMaterial())
                        .orElseThrow(() -> new RuntimeException("Material não encontrado com o ID: " + itemDto.getIdMaterial()));

                if (material.getQuantidadeEstoque() < itemDto.getQuantidadeAlocada()) {
                    throw new RuntimeException("Estoque insuficiente para o material: " + material.getNome());
                }

                material.setQuantidadeEstoque(material.getQuantidadeEstoque() - itemDto.getQuantidadeAlocada());
                materialRepository.save(material);

                BigDecimal custoItem = material.getPrecoUnitario().multiply(new BigDecimal(itemDto.getQuantidadeAlocada()));
                valorTotal = valorTotal.add(custoItem);

                ReservaMaterial rm = new ReservaMaterial();
                rm.setReserva(reservaSalva);
                rm.setMaterial(material);
                rm.setQuantidadeAlocada(itemDto.getQuantidadeAlocada());
                rm.setPrecoNoMomento(material.getPrecoUnitario());

                // Criação BLINDADA da chave composta de ReservaMaterial
                ReservaMaterialId rmId = new ReservaMaterialId();
                rmId.setIdReserva(reservaSalva.getIdReserva());
                rmId.setIdMaterial(material.getIdMaterial());
                rm.setId(rmId);

                reservaMaterialRepository.save(rm);
            }
        }

        reservaSalva.setValorTotal(valorTotal);
        reservaRepository.save(reservaSalva);

        int qtdParcelas = (dto.getQuantidadeParcelas() != null && dto.getQuantidadeParcelas() > 0) ? dto.getQuantidadeParcelas() : 1;
        BigDecimal valorParcela = valorTotal.divide(new BigDecimal(qtdParcelas), 2, RoundingMode.HALF_UP);

        for (int i = 1; i <= qtdParcelas; i++) {
            Parcela parcela = new Parcela();
            parcela.setReserva(reservaSalva);
            parcela.setDataVencimento(LocalDate.now().plusMonths(i));
            parcela.setValorParcela(valorParcela);
            parcela.setStatusPagamento("PENDENTE");

            ParcelaId pId = new ParcelaId();
            pId.setIdReserva(reservaSalva.getIdReserva());
            pId.setNumeroParcela(i);
            parcela.setId(pId);

            parcelaRepository.save(parcela);
        }

        return "Reserva criada com sucesso! Código: " + reservaSalva.getIdReserva() + " | Valor Total: R$ " + valorTotal;
    }

    @GetMapping
    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Reserva buscarPorId(@PathVariable Integer id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada com o ID: " + id));
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public String atualizarStatus(@PathVariable Integer id, @RequestParam String novoStatus) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada com o ID: " + id));

        String statusFormatado = novoStatus.toUpperCase();

        if (statusFormatado.equals("CANCELADO") && !reserva.getStatus().equals("CANCELADO")) {

            List<ReservaMaterial> itens = reservaMaterialRepository.findByReserva(reserva);

            for (ReservaMaterial rm : itens) {
                Material material = rm.getMaterial();
                material.setQuantidadeEstoque(material.getQuantidadeEstoque() + rm.getQuantidadeAlocada());
                materialRepository.save(material);
            }
        }

        reserva.setStatus(statusFormatado);
        reservaRepository.save(reserva);

        return "Status da reserva " + id + " atualizado para: " + statusFormatado;
    }

    @PatchMapping("/{idReserva}/parcelas/{numeroParcela}/pagar")
    @Transactional
    public String pagarParcela(@PathVariable Integer idReserva, @PathVariable Integer numeroParcela) {

        ParcelaId pId = new ParcelaId();
        pId.setIdReserva(idReserva);
        pId.setNumeroParcela(numeroParcela);

        Parcela parcela = parcelaRepository.findById(pId)
                .orElseThrow(() -> new RuntimeException("Parcela não encontrada!"));

        if (parcela.getStatusPagamento().equals("PAGO")) {
            return "Esta parcela já consta como paga.";
        }

        parcela.setStatusPagamento("PAGO");
        parcela.setDataPagamento(LocalDate.now());
        parcelaRepository.save(parcela);

        return "Parcela " + numeroParcela + " da reserva " + idReserva + " foi paga com sucesso!";
    }
}
