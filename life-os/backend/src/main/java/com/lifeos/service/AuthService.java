package com.lifeos.service;

import com.lifeos.dto.AuthDto;
import com.lifeos.entity.User;
import com.lifeos.repository.UserRepository;
import com.lifeos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthDto.AuthResponse register(
            AuthDto.RegisterRequest request
    ) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(User.Role.USER)
                .build();

        userRepository.save(user);

        String accessToken =
                jwtService.generateToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(AuthDto.UserDto.from(user))
                .build();
    }

    public AuthDto.AuthResponse login(
            AuthDto.LoginRequest request
    ) {

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (Exception e) {

            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        User user = userRepository.findByEmail(
                        request.getEmail()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        String accessToken =
                jwtService.generateToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(AuthDto.UserDto.from(user))
                .build();
    }

    public AuthDto.AuthResponse refreshToken(
            AuthDto.RefreshRequest request
    ) {

        String userEmail =
                jwtService.extractUsername(
                        request.getRefreshToken()
                );

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (!jwtService.isTokenValid(
                request.getRefreshToken(),
                user
        )) {

            throw new RuntimeException(
                    "Invalid refresh token"
            );
        }

        String accessToken =
                jwtService.generateToken(user);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(
                        request.getRefreshToken()
                )
                .user(AuthDto.UserDto.from(user))
                .build();
    }
}