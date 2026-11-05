package com.ecommerce.mini_ecommerce.dto;

import com.ecommerce.mini_ecommerce.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(

    @NotNull(message = "Order status is required")
    OrderStatus status

) {}