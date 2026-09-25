package in.learner.BillingSoftware.service;

import in.learner.BillingSoftware.io.UserRequest;
import in.learner.BillingSoftware.io.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest userRequest);
     String getUserRole(String email);
     List<UserResponse> readUsers();
     void deleteUser(String id);
}
