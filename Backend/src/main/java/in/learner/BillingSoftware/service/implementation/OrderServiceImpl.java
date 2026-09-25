package in.learner.BillingSoftware.service.implementation;

import in.learner.BillingSoftware.entity.OrderEntity;
import in.learner.BillingSoftware.entity.OrderItemEntity;
import in.learner.BillingSoftware.io.*;
import in.learner.BillingSoftware.repository.OrderItemRepository;
import in.learner.BillingSoftware.repository.OrderRepository;
import in.learner.BillingSoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        OrderEntity newOrder=convertToOrderEntity(request);

        PaymentDetails paymentDetails=new PaymentDetails();
        paymentDetails.setStatus(newOrder.getPaymentMethod()== PaymentMethod.CASH ?
                PaymentDetails.PaymentStatus.COMPLETED : PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);

        List<OrderItemEntity> orderItems=request.getCartItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());
        newOrder.setItems(orderItems);
        OrderEntity storeOrder=orderRepository.save(newOrder);
        return convertToOrderResponse(storeOrder);

    }

    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }



    private OrderResponse convertToOrderResponse(OrderEntity storeOrder) {
        return OrderResponse.builder()
                .orderId(storeOrder.getOrderId())
                .customerName(storeOrder.getCustomerName())
                .phoneNumber(storeOrder.getPhoneNumber())
                .subtotal(storeOrder.getSubtotal())
                .tax(storeOrder.getTax())
                .grandTotal(storeOrder.getGrandTotal())
                .paymentMethod(storeOrder.getPaymentMethod())
                .items(storeOrder.getItems().stream()
                        .map(this::convertToItemResponse)
                        .collect(Collectors.toList()))
                .paymentDetails(storeOrder.getPaymentDetails())
                .createdAt(storeOrder.getCreatedAt())
                .build();
                
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();
    }


    private OrderEntity convertToOrderEntity(OrderRequest request) {
        return OrderEntity.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .subtotal(request.getSubtotal())
                .tax(request.getTax())
                .grandTotal(request.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .build();


    }
  

    @Override
    public void deleteOrder(String orderId) {
        OrderEntity existsOrder=orderRepository.findByOrderId(orderId).orElseThrow(()->
                new RuntimeException("Order not found"));

        orderRepository.delete(existsOrder);

    }

    @Override
    public List<OrderResponse> getLatestOrders() {
     return orderRepository.findAllByOrderByCreatedAtDesc().stream()
             .map(this::convertToOrderResponse)
             .collect(Collectors.toList());

    }

    @Override
    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        OrderEntity existsOrder=orderRepository.findByOrderId(request.getOrderId()).orElseThrow(()->
                new RuntimeException("order not found"));

        if(!verifyRazorpaySignature(request.getRazorpayOrderId(),
                request.getRazorpayPaymentId()
                ,request.getRazorpaySignature())){


            throw  new RuntimeException("Payment verification failed");
        }
        PaymentDetails paymentDetails=existsOrder.getPaymentDetails();
        paymentDetails.setRazorpayOrderId(request.getRazorpayOrderId());
        paymentDetails.setRazorpayPaymentId(request.getRazorpayPaymentId());
        paymentDetails.setRazorpaySignature(request.getRazorpaySignature());
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);
        existsOrder=orderRepository.save(existsOrder);
        return convertToOrderResponse(existsOrder);
    }

    private boolean verifyRazorpaySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        return true;

    }

    @Override
    public Double sumSalesByDates(LocalDate date) {
        return orderRepository.sumSalesByDates(date);
    }

    @Override
    public Long countByOrderDate(LocalDate date) {
        return orderRepository.countByOrderDate(date);
    }

    @Override
    public List<OrderResponse> findRecentOrders() {
        return orderRepository.findRecentOrders(PageRequest.of(0,5))
                .stream()
                .map(orderEntity -> convertToOrderResponse(orderEntity))
                .collect(Collectors.toList());
    }


}
