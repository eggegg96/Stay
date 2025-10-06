package com.stay.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * DataSource 수동 설정
 *
 * - 자동 설정이 실패할 때 수동으로 빈 생성
 * - HikariCP: 현업에서 가장 많이 쓰는 커넥션 풀
 * - @Primary: 여러 DataSource가 있을 때 기본으로 사용할 것 지정
 */
@Slf4j
@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        log.info("=".repeat(50));
        log.info("DataSource 수동 생성 시작...");

        try {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:mysql://127.0.0.1:3306/stay_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8");
            config.setUsername("root");
            config.setPassword("ehtjrhks3!");
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");

            // 커넥션 풀 설정
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);

            // 커넥션 테스트 쿼리
            config.setConnectionTestQuery("SELECT 1");

            HikariDataSource dataSource = new HikariDataSource(config);

            log.info("✅ DataSource 생성 성공!");
            log.info("JDBC URL: {}", config.getJdbcUrl());
            log.info("=".repeat(50));

            return dataSource;

        } catch (Exception e) {
            log.error("=".repeat(50));
            log.error("❌ DataSource 생성 실패!");
            log.error("에러: {}", e.getMessage(), e);
            log.error("=".repeat(50));
            throw new RuntimeException("DataSource 생성 실패", e);
        }
    }
}