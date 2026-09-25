package in.learner.BillingSoftware.service.implementation;

import in.learner.BillingSoftware.entity.UserEntity;
import in.learner.BillingSoftware.io.UserRequest;
import in.learner.BillingSoftware.io.UserResponse;
import in.learner.BillingSoftware.repository.UserRepository;
import in.learner.BillingSoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// FIX: class was named UserServiceIml.
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        // FIX: the old code returned the pre-save entity, so createdAt/updatedAt
        // came back null in the response.
        UserEntity savedUser = userRepository.save(convertToEntity(userRequest));
        return convertToResponse(savedUser);
    }

    private UserResponse convertToResponse(UserEntity user) {
        return UserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getUserId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .role(user.getRole())
                .build();
    }

    private UserEntity convertToEntity(UserRequest userRequest) {
        String role = userRequest.getRole() == null || userRequest.getRole().isBlank()
                ? "USER"
                : userRequest.getRole().trim().toUpperCase();

        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(role)
                .name(userRequest.getName())
                .build();
    }

    @Override
    public String getUserRole(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found for the email: " + email))
                .getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String userId) {
        UserEntity existingUser = userRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found for the id: " + userId));
        userRepository.delete(existingUser);
    }
}
