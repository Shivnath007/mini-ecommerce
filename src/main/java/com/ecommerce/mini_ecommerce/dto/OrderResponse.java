package com.ecommerce.mini_ecommerce.dto;

import com.ecommerce.mini_ecommerce.model.Order;
import com.ecommerce.mini_ecommerce.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long orderId,
    String orderNumber,
    String customerName,
    BigDecimal totalAmount,
    OrderStatus status,
    LocalDateTime createdAt,
    List<ItemResponse> items
) {
    public record ItemResponse(
        Long productId,
        String productName,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal
    ) {}

    public static OrderResponse from(Order order) {
        List<ItemResponse> items = order.getItems()
            .stream()
            .map(item -> new ItemResponse(
                item.getProductId(),
                item.getProductName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal()
            ))
            .toList();

        return new OrderResponse(
            order.getId(),
            order.getOrderNumber(),
            order.getCustomerName(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getCreatedAt(),
            items
        );
    }
}