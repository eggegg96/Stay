// backend/src/main/java/com/stay/domain/auth/dto/LoginResponse.java
package com.stay.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private boolean success;
    private String message;
    private String email;
}