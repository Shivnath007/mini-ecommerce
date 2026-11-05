package com.ecommerce.mini_ecommerce.config;

import java.util.List;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .cors(Customizer.withDefaults())

                                .csrf(csrf -> csrf
                                                .csrfTokenRepository(
                                                                CookieCsrfTokenRepository.withHttpOnlyFalse())
                                                .csrfTokenRequestHandler(
                                                                new CsrfTokenRequestAttributeHandler()))

                                .authorizeHttpRequests(auth -> auth

                                                // Public authentication endpoints
                                                .requestMatchers(
                                                                "/auth/csrf",
                                                                "/auth/login")
                                                .permitAll()

                                                // Public product listing
                                                .requestMatchers(
                                                                org.springframework.http.HttpMethod.GET,
                                                                "/products",
                                                                "/products/**")
                                                .permitAll()

                                                // Admin product operations
                                                .requestMatchers(
                                                                org.springframework.http.HttpMethod.POST,
                                                                "/products/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                org.springframework.http.HttpMethod.PUT,
                                                                "/products/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                org.springframework.http.HttpMethod.DELETE,
                                                                "/products/**")
                                                .hasRole("ADMIN")

                                                // Admin order operations
                                                .requestMatchers("/admin/orders/**").hasRole("ADMIN")

                                                // Customer checkout remains public
                                                .requestMatchers(
                                                                org.springframework.http.HttpMethod.POST,
                                                                "/orders")
                                                .permitAll()

                                                // Everything else requires authentication
                                                .anyRequest().authenticated())

                                // React will provide its own login page
                                .formLogin(form -> form.disable())

                                // Do not use browser-native HTTP Basic authentication
                                .httpBasic(basic -> basic.disable())

                                // Configure server-side session authentication
                                .sessionManagement(session -> session
                                                .sessionFixation(fixation -> fixation.changeSessionId()));

                return http.build();
        }

        @Bean
        public UserDetailsService userDetailsService(
                        PasswordEncoder passwordEncoder) {

                UserDetails admin = User.builder()
                                .username("admin")
                                .password(
                                                passwordEncoder.encode("ChangeThisPassword123!"))
                                .roles("ADMIN")
                                .build();

                return new InMemoryUserDetailsManager(admin);
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration)
                        throws Exception {

                return configuration.getAuthenticationManager();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of("http://localhost:5173"));

                configuration.setAllowedMethods(
                                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of("Content-Type", "X-XSRF-TOKEN"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}
