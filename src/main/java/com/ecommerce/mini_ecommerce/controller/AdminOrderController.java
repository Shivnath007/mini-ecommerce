package com.ecommerce.mini_ecommerce.controller;

import com.ecommerce.mini_ecommerce.dto.AdminOrderResponse;
import com.ecommerce.mini_ecommerce.dto.UpdateOrderStatusRequest;
import com.ecommerce.mini_ecommerce.service.AdminOrderService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(
            AdminOrderService adminOrderService) {

        this.adminOrderService = adminOrderService;
    }

    // GET /admin/orders
    @GetMapping
    public List<AdminOrderResponse> getAllOrders() {

        return adminOrderService.getAllOrders();
    }

    // GET /admin/orders/{id}
    @GetMapping("/{id}")
    public AdminOrderResponse getOrderById(
            @PathVariable Long id) {

        return adminOrderService.getOrderById(id);
    }

    // PATCH /admin/orders/{id}/status
    @PatchMapping("/{id}/status")
    public AdminOrderResponse updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        return adminOrderService.updateOrderStatus(
            id,
            request.status()
        );
    }
}