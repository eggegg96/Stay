package com.stay.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig { //JPA Auditing을 위한 AuditorAware 빈 등록

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.of("system");
        // TODO: Spring Security 적용 후 실제 사용자 정보로 변경
    }
}