package in.learner.BillingSoftware.controller;

import com.razorpay.RazorpayException;
import in.learner.BillingSoftware.io.OrderResponse;
import in.learner.BillingSoftware.io.PaymentRequest;
import in.learner.BillingSoftware.io.PaymentVerificationRequest;
import in.learner.BillingSoftware.io.RazorpayOrderResponse;
import in.learner.BillingSoftware.service.OrderService;
import in.learner.BillingSoftware.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {
    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createPayment(@RequestBody PaymentRequest paymentRequest)throws RazorpayException {
        return razorpayService.createOrder(paymentRequest.getAmount(),paymentRequest.getCurrency());

    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request){
       return orderService.verifyPayment(request);

    }



}
