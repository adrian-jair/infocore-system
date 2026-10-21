package com.empresa.bsc.iam.service;

import com.empresa.bsc.iam.model.AuditLog;
import com.empresa.bsc.iam.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(String user, String action, String entity, String detail) {
        AuditLog audit = AuditLog.builder()
                .id("AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .date(LocalDateTime.now())
                .user(user != null ? user : "Sistema")
                .action(action)
                .entity(entity)
                .detail(detail)
                .build();
        auditLogRepository.save(audit);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByDateDesc();
    }
}
