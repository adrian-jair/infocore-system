package com.empresa.bsc.iam.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bsc_audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    private String id;

    @Column(nullable = false, name = "log_date")
    private LocalDateTime date;

    @Column(nullable = false, name = "user_name")
    private String user;

    @Column(nullable = false)
    private String action;

    private String entity;

    @Column(length = 1000)
    private String detail;
}
