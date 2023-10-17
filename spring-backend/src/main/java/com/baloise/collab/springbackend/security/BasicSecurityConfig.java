package com.baloise.collab.springbackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class BasicSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authorize) -> authorize
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .formLogin(Customizer.withDefaults());

        return http.build();
    }


    /* Insecure - only for demo purposes */
    @Bean
    public UserDetailsService userDetailsService() {
        var users = new String[]{"alex", "lukas", "daniel", "bastian"};
        var userDetails = Arrays.stream(users).map(user -> User.withDefaultPasswordEncoder()
                .username(user)
                .password("geheim")
                .roles("USER")
                .build());

        return new InMemoryUserDetailsManager(userDetails.toList());
    }

}
