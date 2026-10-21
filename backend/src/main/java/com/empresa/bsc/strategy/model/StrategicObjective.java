package com.empresa.bsc.strategy.model;

import com.empresa.bsc.shared.enums.PerspectiveType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bsc_strategic_objectives")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StrategicObjective {

    @Id
    private String id; // OBJ-F1, OBJ-C1, etc.

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerspectiveType perspective;

    @Column(length = 1000)
    private String description;

    private String owner;
    private String priority; // Alta, Media, Baja
    private Double weight;   // 35, 30, etc.
    private String status;   // Activo, En revisión

    @Builder.Default
    private String created = LocalDate.now().toString();
}
