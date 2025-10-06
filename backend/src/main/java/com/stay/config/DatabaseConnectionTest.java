package com.stay.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;

@Slf4j
@Configuration
public class DatabaseConnectionTest {

    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                log.info("=".repeat(50));
                log.info("✅ Database Connection SUCCESS!");
                log.info("DB URL: {}", connection.getMetaData().getURL());
                log.info("DB User: {}", connection.getMetaData().getUserName());
                log.info("DB Product: {}", connection.getMetaData().getDatabaseProductName());
                log.info("=".repeat(50));
            } catch (Exception e) {
                log.error("=".repeat(50));
                log.error("❌ Database Connection FAILED!");
                log.error("Error: {}", e.getMessage());
                log.error("=".repeat(50));
                throw e; // 예외를 다시 던져서 애플리케이션 시작 중단
            }
        };
    }
}