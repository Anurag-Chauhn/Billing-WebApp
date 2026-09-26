package in.learner.BillingSoftware.service.implementation;

import in.learner.BillingSoftware.entity.CategoryEntity;
import in.learner.BillingSoftware.entity.ItemEntity;
import in.learner.BillingSoftware.io.ItemRequest;
import in.learner.BillingSoftware.io.ItemResponse;
import in.learner.BillingSoftware.repository.CategoryRepository;
import in.learner.BillingSoftware.repository.ItemRepository;
import in.learner.BillingSoftware.service.FileUploadService;
import in.learner.BillingSoftware.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
public class ItemServiceIml implements ItemService {
    @Value(("${app.activation.url}"))
    private String backend_url;
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;
    @Override
    public ItemResponse addItem(ItemRequest request, MultipartFile file) throws IOException {
//        String imgUrl=fileUploadService.uploadFile(file);


        String fileName= UUID.randomUUID().toString()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
        Path uploadPath= Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path targetLocation=uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);
        String imgUrl=backend_url+"/api/v1.0/uploads/"+fileName;

        ItemEntity newItem=convertToEntity(request);
        CategoryEntity existingCategory=categoryRepository.findByCategoryId(request.getCategoryId())
                        .orElseThrow(()-> new RuntimeException("Category Not Found for the categortId:"+request.getCategoryId()));

        newItem.setCategory(existingCategory);
        newItem.setImgUrl(imgUrl);
        ItemEntity storeItem= itemRepository.save(newItem);

        return convertToResponse(storeItem);
    }

    private ItemResponse convertToResponse(ItemEntity storeItem) {
        return ItemResponse.builder()
                .itemId(storeItem.getItemId())
                .name(storeItem.getName())
                .description(storeItem.getDescription())
                .price(storeItem.getPrice())
                .imgUrl(storeItem.getImgUrl())
                .categoryName(storeItem.getCategory().getName())
                .categoryId(storeItem.getCategory().getCategoryId())
                .createdAt(storeItem.getCreatedAt())
                .updatedAt(storeItem.getUpdatedAt())
                .build();
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll()
                .stream()
                .map(itemEntity -> convertToResponse(itemEntity))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItems(String itemId) {
        ItemEntity existsItem=itemRepository.findByItemId(itemId).orElseThrow(()->
                new RuntimeException("item not found: "+itemId));
//        boolean isFileDeleted=fileUploadService.deleteFile(existsItem.getImgUrl());
//        if(isFileDeleted){
//            itemRepository.delete(existsItem);
//
//        }else {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Unable to delete the image");
//
//        }
        String imgUrl=existsItem.getImgUrl();
        String fileName=imgUrl.substring(imgUrl.lastIndexOf("/")+1);
        Path uploadPath= Paths.get("uploads").toAbsolutePath().normalize();
        Path filePath=uploadPath.resolve(fileName);

        try {
            Files.deleteIfExists(filePath);

        }catch (IOException e){
            e.printStackTrace();
        }
        itemRepository.delete(existsItem);


    }
}
