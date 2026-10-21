package com.empresa.bsc.strategy.repository;

import com.empresa.bsc.strategy.model.Perspective;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerspectiveRepository extends JpaRepository<Perspective, String> {
    List<Perspective> findAllByOrderByDisplayOrderAsc();
}
