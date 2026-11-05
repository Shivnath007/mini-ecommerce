package com.ecommerce.mini_ecommerce.controller;

import com.ecommerce.mini_ecommerce.dto.CheckoutRequest;
import com.ecommerce.mini_ecommerce.dto.OrderResponse;
import com.ecommerce.mini_ecommerce.model.Order;
import com.ecommerce.mini_ecommerce.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(
            @Valid @RequestBody CheckoutRequest request) {

        Order order = orderService.placeOrder(request);

        return OrderResponse.from(order);
    }
}