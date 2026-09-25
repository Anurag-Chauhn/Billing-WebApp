package in.learner.BillingSoftware.service;

import in.learner.BillingSoftware.io.CategoryRequest;
import in.learner.BillingSoftware.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CategoryService {
    CategoryResponse addCategory(CategoryRequest categoryRequest, MultipartFile file) throws IOException;
    List<CategoryResponse> read();
    void delete(String categoryId);
}
