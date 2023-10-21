package com.baloise.collab.springbackend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@Log
@CrossOrigin(origins = "http://localhost:4200")
public class RegistrationController {

    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder encoder;

    @PostMapping("/user/registration")
    public boolean registerUser(HttpServletRequest request, @RequestBody Credential credential) throws ServletException, IOException {

        if (userDetailsManager.userExists(credential.username())) {
            if(Objects.equals(userDetailsManager.loadUserByUsername(credential.username()).getPassword(), credential.password())){
                log.info("User already exists + password is correct - returning okey");
                return true;
            } else {
                return false;
            }
        } else {
            log.info("Creating User");
            var user = User.builder()
                    .username(credential.username())
                    .password(credential.password())
                    .roles("User")
                    .passwordEncoder(encoder::encode)
                    .build();
            userDetailsManager.createUser(user);
            return true;
        }
    }
}
