package in.learner.BillingSoftware.service;

import in.learner.BillingSoftware.entity.OrderEntity;
import in.learner.BillingSoftware.io.OrderRequest;
import in.learner.BillingSoftware.io.OrderResponse;
import in.learner.BillingSoftware.io.PaymentVerificationRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    void deleteOrder(String orderId);
    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDates( LocalDate date);

    Long countByOrderDate(LocalDate date);

    List<OrderResponse> findRecentOrders();


}
