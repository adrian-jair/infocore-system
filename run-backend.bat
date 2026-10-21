@echo off
title Balanced Scorecard - Backend (Spring Boot 3 + Spring Modulith)
echo ========================================================
echo Iniciando Backend Spring Boot en http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo H2 Console: http://localhost:8080/h2-console
echo ========================================================
cd /d "%~dp0backend"
mvn.cmd spring-boot:run
pause
