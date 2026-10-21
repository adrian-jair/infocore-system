package com.empresa.bsc.iam.repository;

import com.empresa.bsc.iam.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findTop100ByOrderByDateDesc();
}
