package com.empresa.bsc.iam.controller;

import com.empresa.bsc.iam.dto.UserDto;
import com.empresa.bsc.iam.model.AuditLog;
import com.empresa.bsc.iam.service.AuditService;
import com.empresa.bsc.iam.service.UserService;
import com.empresa.bsc.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "2. IAM & Auditoría", description = "Catálogo de usuarios y registro de auditoría")
public class UserController {

    private final UserService userService;
    private final AuditService auditService;

    @GetMapping("/users")
    @Operation(summary = "Listar usuarios del sistema BSC")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAllUsers()));
    }

    @GetMapping("/audit")
    @Operation(summary = "Consultar registro de auditoría reciente")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getRecentLogs()));
    }
}
