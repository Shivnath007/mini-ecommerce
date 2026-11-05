package com.ecommerce.mini_ecommerce.dto;

import com.ecommerce.mini_ecommerce.model.Order;
import com.ecommerce.mini_ecommerce.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminOrderResponse(
    Long id,
    String orderNumber,
    String customerName,
    String email,
    String phone,
    String address,
    BigDecimal totalAmount,
    OrderStatus status,
    LocalDateTime createdAt,
    List<OrderItemResponse> items
) {

    public static AdminOrderResponse from(Order order) {

        List<OrderItemResponse> itemResponses =
            order.getItems()
                .stream()
                .map(OrderItemResponse::from)
                .toList();

        return new AdminOrderResponse(
            order.getId(),
            order.getOrderNumber(),
            order.getCustomerName(),
            order.getEmail(),
            order.getPhone(),
            order.getAddress(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getCreatedAt(),
            itemResponses
        );
    }
}