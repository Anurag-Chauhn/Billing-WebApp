package in.learner.BillingSoftware.service.implementation;

import in.learner.BillingSoftware.entity.CategoryEntity;
import in.learner.BillingSoftware.io.CategoryRequest;
import in.learner.BillingSoftware.io.CategoryResponse;
import in.learner.BillingSoftware.repository.CategoryRepository;
import in.learner.BillingSoftware.repository.ItemRepository;
import in.learner.BillingSoftware.service.CategoryService;
import in.learner.BillingSoftware.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    @Value("${app.activation.url}")
    private String backend_url;
    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;
    private final ItemRepository itemRepository;

    @Override
    public CategoryResponse addCategory(CategoryRequest categoryRequest, MultipartFile file) throws IOException {
        //String imgUrl=fileUploadService.uploadFile(file);


        String fileName= UUID.randomUUID().toString()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
        Path uploadPath= Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path targetLocation=uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);
        String imgUrl=backend_url+"/api/v1.0/uploads/"+fileName;


        CategoryEntity newCategory=convertToEntity(categoryRequest);
        newCategory.setImgUrl(imgUrl);
       CategoryEntity storeCategory= categoryRepository.save(newCategory);

        return convertToResponse(storeCategory);
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryEntity -> convertToResponse(categoryEntity))
                .collect(Collectors.toList());

    }

    @Override
    public void delete(String categoryId) {
        CategoryEntity existsCategory=categoryRepository.findByCategoryId(categoryId).orElseThrow(()->
                new RuntimeException("Category not found: "+categoryId));

//        boolean isFileDeleted=fileUploadService.deleteFile(existsCategory.getImgUrl());
//        if(isFileDeleted){
//            categoryRepository.delete(existsCategory);
//        }else {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Unable to delete the image");
//
//        }

        String imgUrl=existsCategory.getImgUrl();
        String fileName=imgUrl.substring(imgUrl.lastIndexOf("/")+1);
       Path uploadPath= Paths.get("uploads").toAbsolutePath().normalize();
        Path filePath=uploadPath.resolve(fileName);

        try {
            Files.deleteIfExists(filePath);

        }catch (IOException e){
            e.printStackTrace();
        }
        categoryRepository.delete(existsCategory);

    }

    private CategoryResponse convertToResponse(CategoryEntity storeCategory) {
        Integer itemsCount=itemRepository.countByCategoryId(storeCategory.getId());
        return CategoryResponse.builder()
                .categoryId(storeCategory.getCategoryId())
                .name(storeCategory.getName())
                .description(storeCategory.getDescription())
                .bgColor(storeCategory.getBgColor())
                .imgUrl(storeCategory.getImgUrl())
                .createdAt(storeCategory.getCreatedAt())
                .updatedAt(storeCategory.getUpdatedAt())
                .items(itemsCount)
                .build();
    }

    private CategoryEntity convertToEntity(CategoryRequest categoryRequest) {
        return CategoryEntity.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .bgColor(categoryRequest.getBgColor())
                .build();
    }
}
