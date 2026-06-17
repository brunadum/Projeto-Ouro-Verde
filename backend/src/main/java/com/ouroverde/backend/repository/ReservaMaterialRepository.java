package com.ouroverde.backend.repository;

import com.ouroverde.backend.model.Reserva;
import com.ouroverde.backend.model.ReservaMaterial;
import com.ouroverde.backend.model.ReservaMaterialId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservaMaterialRepository extends JpaRepository<ReservaMaterial, ReservaMaterialId> {
    List<ReservaMaterial> findByReserva(Reserva reserva);

}
