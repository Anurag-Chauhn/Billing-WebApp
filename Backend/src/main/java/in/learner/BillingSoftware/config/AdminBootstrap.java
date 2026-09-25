package in.learner.BillingSoftware.config;

import in.learner.BillingSoftware.entity.UserEntity;
import in.learner.BillingSoftware.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * FIX: /admin/register sits behind hasRole("ADMIN"), so there was no way to create
 * the very first administrator. This seeds one - and only when the users table is
 * completely empty, so it never touches an existing database.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email:}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            return;
        }
        if (userRepository.count() > 0) {
            return;
        }

        userRepository.save(UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .name("Administrator")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role("ROLE_ADMIN")
                .build());

        log.info("Bootstrapped initial admin account: {}", adminEmail);
    }
}
