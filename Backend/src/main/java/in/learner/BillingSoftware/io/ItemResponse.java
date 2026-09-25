package in.learner.BillingSoftware.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private String itemId;
    private String name;
    private BigDecimal price;
    private  String categoryId;
    private String description;
    private String categoryName;
    private String imgUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
