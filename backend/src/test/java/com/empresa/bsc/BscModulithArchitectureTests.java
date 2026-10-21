package com.empresa.bsc;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class BscModulithArchitectureTests {

    @Test
    void verifyModularArchitecture() {
        ApplicationModules modules = ApplicationModules.of(BscApplication.class);
        modules.verify();
    }
}
