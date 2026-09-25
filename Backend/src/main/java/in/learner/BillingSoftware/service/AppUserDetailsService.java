package in.learner.BillingSoftware.service;

import in.learner.BillingSoftware.entity.UserEntity;
import in.learner.BillingSoftware.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        // FIX: was RuntimeException, which Spring Security cannot map to a 401.
                        new UsernameNotFoundException("No user found for the email: " + email));

        // FIX: hasRole("ADMIN") looks for the authority "ROLE_ADMIN". Storing the bare
        // "ADMIN" here made every /admin/** request fail with 403 after a successful login.
        String role = existingUser.getRole() == null ? "USER" : existingUser.getRole().trim();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new User(
                existingUser.getEmail(),
                existingUser.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(role)));
    }
}
