package in.learner.BillingSoftware.service;

import com.razorpay.RazorpayException;
import in.learner.BillingSoftware.io.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
