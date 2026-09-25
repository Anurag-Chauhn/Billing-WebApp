package in.learner.BillingSoftware.controller;

import in.learner.BillingSoftware.io.DashboardResponse;
import in.learner.BillingSoftware.io.OrderResponse;
import in.learner.BillingSoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {
private final OrderService orderService;

    @GetMapping
    public DashboardResponse getDashBoardData(){
        LocalDate today=LocalDate.now();
        Double todaySales=orderService.sumSalesByDates(today);
        Long todayOrderCount=orderService.countByOrderDate(today);
        List<OrderResponse> recentOrders=orderService.findRecentOrders();

        return new DashboardResponse(
                todaySales !=null ? todaySales : 0.0,
                todayOrderCount !=null ? todayOrderCount : 0,
                recentOrders

        );

    }
}
