package com.empresa.bsc.iam.controller;

import com.empresa.bsc.iam.dto.LoginRequest;
import com.empresa.bsc.iam.dto.LoginResponse;
import com.empresa.bsc.iam.dto.UserDto;
import com.empresa.bsc.iam.service.UserService;
import com.empresa.bsc.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "1. Autenticación y Acceso", description = "Endpoints de inicio de sesión y verificación de token JWT")
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión en el Balanced Scorecard", description = "Valida credenciales y genera token JWT")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Sesión iniciada exitosamente", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener información del usuario autenticado", description = "Retorna el perfil del usuario activo")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No hay usuario autenticado"));
        }
        UserDto dto = userService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
