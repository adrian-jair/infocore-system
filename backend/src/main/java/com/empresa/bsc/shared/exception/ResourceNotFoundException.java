package com.empresa.bsc.shared.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entity, Object id) {
        super(String.format("%s con identificador '%s' no fue encontrado", entity, id));
    }
}
