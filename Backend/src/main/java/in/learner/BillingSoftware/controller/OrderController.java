package in.learner.BillingSoftware.controller;

import in.learner.BillingSoftware.io.OrderRequest;
import in.learner.BillingSoftware.io.OrderResponse;
import in.learner.BillingSoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.internal.multipart.MpuRequestContext;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest){
        return orderService.createOrder(orderRequest);

    }

    @GetMapping("/latest")
    public List<OrderResponse> getLatestOrders(){
        return orderService.getLatestOrders();
    }


    @DeleteMapping("{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId){
        orderService.deleteOrder(orderId);
    }

}
