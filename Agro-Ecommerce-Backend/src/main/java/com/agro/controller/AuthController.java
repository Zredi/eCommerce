package com.agro.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.UserDto;
import com.agro.model.User;
import com.agro.request.CreateUserRequest;
import com.agro.request.LoginRequest;
import com.agro.response.ApiResponse;
import com.agro.response.JwtResponse;
import com.agro.security.AppUserDetails;
import com.agro.security.AppUserDetailsService;
import com.agro.security.jwt.JwtUtils;
import com.agro.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import static org.springframework.http.HttpStatus.CONFLICT;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
@CrossOrigin
public class AuthController {

    private final UserService userService;
    private final AppUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    /**
     * Logs in a user and returns a JWT token to be used for subsequent calls
     * @return a response with a JWT response containing the user id and the JWT token
     * @throws Exception if the login fails, returns a 401 Unauthorized with an error message
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateTokenForUser(authentication);
            AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
            String refreshToken = jwtUtils.generateRefreshToken(userDetails);
            JwtResponse jwtResponse = new JwtResponse(userDetails.getId(), jwt, refreshToken,userDetails.getRole());
            return ResponseEntity.ok(new ApiResponse("Login Successful", jwtResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request) {
        try {
            User user = userService.createUser(request);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Create User Success!", userDto));
        } catch (Exception e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (jwtUtils.validateToken(refreshToken)) {
            String username = jwtUtils.getUsernameFromToken(refreshToken);
            AppUserDetails userDetails = (AppUserDetails) userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            String newJwtToken = jwtUtils.generateTokenForUser(authenticationToken);
            String newRefreshToken = jwtUtils.generateRefreshToken(userDetails);

            JwtResponse jwtResponse = new JwtResponse(userDetails.getId(), newJwtToken, newRefreshToken,userDetails.getRole());
            return ResponseEntity.ok(new ApiResponse("Token refreshed successfully", jwtResponse));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Invalid or expired refresh token", null));
        }
    }

}
