package com.ouroverde.backend.repository;

import com.ouroverde.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
}