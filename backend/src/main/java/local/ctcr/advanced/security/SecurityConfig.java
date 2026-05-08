package local.ctcr.advanced.security;

import local.ctcr.advanced.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Public: auth ───────────────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()

                // ── Public: read-only browsing ─────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/modules/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lessons/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/questions/lesson/**").permitAll()

                // ── Admin only: module write ───────────────────────────────
                .requestMatchers(HttpMethod.POST,   "/api/modules/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/modules/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/modules/**").hasRole("ADMIN")

                // ── Admin only: lesson write ───────────────────────────────
                .requestMatchers(HttpMethod.POST,   "/api/lessons/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/lessons/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/lessons/**").hasRole("ADMIN")

                // ── Admin only: question write ─────────────────────────────
                .requestMatchers(HttpMethod.POST,   "/api/questions").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/questions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/questions/**").hasRole("ADMIN")

                // ── Everything else requires auth (e.g. answer submission) ─
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ── CORS — allows React dev server at localhost:3000 ──────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}