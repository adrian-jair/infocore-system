package com.empresa.bsc.strategy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bsc_strategy_links")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StrategyLink {

    @Id
    private String id;

    @Column(nullable = false)
    private String sourceObjectiveId; // e.g. OBJ-A1

    @Column(nullable = false)
    private String targetObjectiveId; // e.g. OBJ-P1

    private String description;
    private String strength; // Alta, Media
}
