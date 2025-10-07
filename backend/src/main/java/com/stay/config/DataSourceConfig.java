package com.stay.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * DataSource 수동 설정
 *
 * - HikariCP: 현업에서 가장 많이 쓰는 커넥션 풀
 * - @Primary: 여러 DataSource가 있을 때 기본으로 사용할 것 지정
 * - @Profile("!test"): 테스트 프로필에서는 이 설정을 비활성화 (H2 등으로 대체)
 */
@Slf4j
@Configuration
@Profile("!test")

public class DataSourceConfig {

    @Value("${DB_URL}")
    private String dbUrl;

    @Value("${DB_USERNAME}")
    private String dbUsername;

    @Value("${DB_PASSWORD}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        log.info("=".repeat(50));
        log.info("DataSource 수동 생성 시작...");

        try {
            if (dbUrl == null || dbUrl.isBlank()) {
                throw new IllegalArgumentException("DB_URL이 비어 있습니다. 환경 변수를 확인하세요.");
            }

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(dbUrl);
            config.setUsername(dbUsername);
            config.setPassword(dbPassword);
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");

            // 커넥션 풀 설정
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);
            config.setConnectionTestQuery("SELECT 1");

            HikariDataSource dataSource = new HikariDataSource(config);

            log.info("✅ DataSource 생성 성공!");
            log.info("JDBC URL: {}", config.getJdbcUrl());
            log.info("=".repeat(50));

            return dataSource;

        } catch (Exception e) {
            log.info("=".repeat(50));
            log.error("❌ DataSource 생성 실패!");
            log.error("에러: {}", e.getMessage(), e);
            log.info("=".repeat(50));
            throw new RuntimeException("DataSource 생성 실패", e);
        }
    }
}