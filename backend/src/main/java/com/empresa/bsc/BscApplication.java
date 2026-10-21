package com.empresa.bsc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BscApplication {

    public static void main(String[] args) {
        SpringApplication.run(BscApplication.class, args);
    }
}
