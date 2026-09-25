package in.learner.BillingSoftware.service;

import in.learner.BillingSoftware.io.ItemRequest;
import in.learner.BillingSoftware.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ItemService {
    ItemResponse addItem(ItemRequest request, MultipartFile file) throws IOException;
    List<ItemResponse> fetchItems();
    void deleteItems(String itemId);

}
