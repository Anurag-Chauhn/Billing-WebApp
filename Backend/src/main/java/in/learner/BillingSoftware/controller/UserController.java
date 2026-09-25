package in.learner.BillingSoftware.controller;

import in.learner.BillingSoftware.io.UserRequest;
import in.learner.BillingSoftware.io.UserResponse;
import in.learner.BillingSoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(@RequestBody UserRequest userRequest){
        try{
            return userService.createUser(userRequest);

        }catch (Exception e){
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unable to create user"+e.getMessage());
        }
    }

    @GetMapping("/users")
    public List<UserResponse> readUsers(){
        return userService.readUsers();
    }

    @DeleteMapping("/users/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String userId){
        try{
            userService.deleteUser(userId);

        }catch (Exception e){
            throw  new ResponseStatusException(HttpStatus.NOT_FOUND,"Unable to delete user"+e.getMessage());
        }


    }

}
