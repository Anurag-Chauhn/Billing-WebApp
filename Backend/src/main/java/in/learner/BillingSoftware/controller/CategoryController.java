package in.learner.BillingSoftware.controller;

import in.learner.BillingSoftware.io.CategoryRequest;
import in.learner.BillingSoftware.io.CategoryResponse;
import in.learner.BillingSoftware.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    // FIX: use the Spring-managed mapper instead of allocating a new one per request.
    private final ObjectMapper objectMapper;

    @PostMapping("/admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString,
                                        @RequestPart("file") MultipartFile file) {
        CategoryRequest categoryRequest;
        try {
            categoryRequest = objectMapper.readValue(categoryString, CategoryRequest.class);
            return categoryService.addCategory(categoryRequest, file);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Exception occurred while parsing JSON: " + e.getMessage());
        }
    }

    // FIX: a bare @GetMapping mapped this to "/" instead of "/categories".
    @GetMapping("/categories")
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> fetchCategories() {
        return categoryService.read();
    }

    // FIX: path was missing its leading slash.
    @DeleteMapping("/admin/categories/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable String categoryId) {
        try {
            categoryService.delete(categoryId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
