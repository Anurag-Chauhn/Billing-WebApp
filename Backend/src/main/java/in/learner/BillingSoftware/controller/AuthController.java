package in.learner.BillingSoftware.controller;

import in.learner.BillingSoftware.io.AuthRequest;
import in.learner.BillingSoftware.io.AuthResponse;
import in.learner.BillingSoftware.service.AppUserDetailsService;
import in.learner.BillingSoftware.service.UserService;
import in.learner.BillingSoftware.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        authenticate(authRequest.getEmail(), authRequest.getPassword());

        final UserDetails userDetails =
                appUserDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        final String role = userService.getUserRole(authRequest.getEmail());

        return new AuthResponse(authRequest.getEmail(), role, jwtToken);
    }

    private void authenticate(String email, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));
        } catch (DisabledException e) {
            // FIX: throwing a bare Exception here produced a 500 instead of a 4xx.
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User account is disabled");
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Email or password is incorrect");
        }
    }

    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request) {
        return passwordEncoder.encode(request.get("password"));
    }
}
