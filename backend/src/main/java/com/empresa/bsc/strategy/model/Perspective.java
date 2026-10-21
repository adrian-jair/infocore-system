package com.empresa.bsc.strategy.model;

import com.empresa.bsc.shared.enums.PerspectiveType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bsc_perspectives")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Perspective {

    @Id
    private String code; // FIN, CLI, PRO, APR

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private PerspectiveType type;

    @Column(nullable = false)
    private String label;

    private String color;
    private String softColor;
    private String icon;
    private int displayOrder;
}
