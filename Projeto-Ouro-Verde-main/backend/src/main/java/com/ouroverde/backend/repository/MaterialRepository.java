package com.ouroverde.backend.repository;

import com.ouroverde.backend.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Integer> {
}