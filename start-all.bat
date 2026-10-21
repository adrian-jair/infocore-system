@echo off
title Balanced Scorecard Full-Stack Launcher - TechPeru SAC 2025
echo =========================================================================
echo Levantando Aplicacion Empresarial Full-Stack Balanced Scorecard (BSC)
echo Backend: Spring Boot 3.3.4 + Spring Modulith (Puerto 8080)
echo Frontend: Angular 19+ Standalone + Signals (Puerto 4200)
echo =========================================================================
start "BSC Backend" cmd /k "cd /d %~dp0backend && mvn.cmd spring-boot:run"
timeout /t 5 /nobreak >nul
start "BSC Frontend" cmd /k "cd /d %~dp0frontend && npm start"
echo.
echo Los servicios se estan iniciando en terminales dedicadas:
echo - Frontend Angular: http://localhost:4200
echo - Backend API REST: http://localhost:8080/api/analytics/dashboard
echo - Documentacion Swagger: http://localhost:8080/swagger-ui.html
echo =========================================================================
pause
