package in.learner.BillingSoftware.repository;

import in.learner.BillingSoftware.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity,Long> {

}
