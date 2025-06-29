package com.example.demo;

// import org.springframework.boot.CommandLineRunner;

import com.example.demo.security.JwtAuthenticationFilter;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@SpringBootApplication
public class DemoApplication {

  @Autowired
  private JwtAuthenticationFilter jwtAuthenticationFilter;

  public static void main(String[] args) {
    try {
      Dotenv dotenv = Dotenv.configure()
        .ignoreIfMissing()
        .load();
      
      setPropertyIfExists("SPRING_MAIL_HOST", dotenv.get("SPRING_MAIL_HOST"));
      setPropertyIfExists("SPRING_MAIL_PORT", dotenv.get("SPRING_MAIL_PORT"));
      setPropertyIfExists("SPRING_MAIL_USERNAME", dotenv.get("SPRING_MAIL_USERNAME"));
      setPropertyIfExists("SPRING_MAIL_PASSWORD", dotenv.get("SPRING_MAIL_PASSWORD"));
      
      // Uncomment these lines if you want to use database credentials from .env file
      // setPropertyIfExists("SPRING_DATASOURCE_URL", dotenv.get("SPRING_DATASOURCE_URL"));
      // setPropertyIfExists("SPRING_DATASOURCE_USERNAME", dotenv.get("SPRING_DATASOURCE_USERNAME"));
      // setPropertyIfExists("SPRING_DATASOURCE_PASSWORD", dotenv.get("SPRING_DATASOURCE_PASSWORD"));
    } catch (Exception e) {
      System.out.println("No .env file found, using system environment variables");
    }
    
    SpringApplication.run(DemoApplication.class, args);
  }
  
  private static void setPropertyIfExists(String propertyName, String value) {
    if (value != null && !value.trim().isEmpty()) {
      System.setProperty(propertyName, value);
    }
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/users/login", "/api/users/register", "/api/contact/send").permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
      "http://localhost:*",
      "https://grade-flow-kappa.vercel.app"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
