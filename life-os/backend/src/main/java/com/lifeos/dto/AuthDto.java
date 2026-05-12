package com.lifeos.dto;

import com.lifeos.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "First name is required")
        private String firstName;
        private String lastName;
        @Email(message = "Valid email required")
        @NotBlank(message = "Email is required")
        private String email;
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private UserDto user;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String avatar;
        private User.Role role;

        public static UserDto from(User user) {
            return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshRequest {
        private String refreshToken;
    }
}
