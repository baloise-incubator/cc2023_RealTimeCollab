package com.baloise.collab.springbackend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log
@CrossOrigin(origins = "http://localhost:4200")
public class RegistrationController {

    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder encoder;

    @PostMapping("/user/registration")
    public boolean registerUser(@RequestBody Credential credential) {

        if (userDetailsManager.userExists(credential.username())) {
            if(encoder.matches(credential.password(), userDetailsManager.loadUserByUsername(credential.username()).getPassword())){
                log.info(credential.username() + " User already exists + password is correct - returning okey");
                return true;
            } else {
                log.info(credential.username() + " User already exists but password is wrong");
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
