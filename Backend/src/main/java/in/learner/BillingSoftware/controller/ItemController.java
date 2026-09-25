package in.learner.BillingSoftware.controller;

import in.learner.BillingSoftware.io.ItemRequest;
import in.learner.BillingSoftware.io.ItemResponse;
import in.learner.BillingSoftware.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
@RestController
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    private final ObjectMapper objectMapper;

    @PostMapping("/admin/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse addItem(@RequestPart("item") String itemString,
                                    @RequestPart("file") MultipartFile file) {
        ItemRequest itemRequest;
        try {
            itemRequest = objectMapper.readValue(itemString, ItemRequest.class);
            return itemService.addItem(itemRequest, file);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Exception occurred while parsing JSON: " + e.getMessage());
        }
    }

    @GetMapping("/items")
    @ResponseStatus(HttpStatus.OK)
    public List<ItemResponse> fetchItems() {

        return itemService.fetchItems();
    }

    @DeleteMapping("/admin/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable String itemId) {
        try {
            itemService.deleteItems(itemId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
