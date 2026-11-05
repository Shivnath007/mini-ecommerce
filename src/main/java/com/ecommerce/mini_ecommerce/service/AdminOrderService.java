package com.ecommerce.mini_ecommerce.service;

import com.ecommerce.mini_ecommerce.dto.AdminOrderResponse;
import com.ecommerce.mini_ecommerce.model.Order;
import com.ecommerce.mini_ecommerce.model.OrderItem;
import com.ecommerce.mini_ecommerce.model.OrderStatus;
import com.ecommerce.mini_ecommerce.model.Product;
import com.ecommerce.mini_ecommerce.repository.OrderRepository;
import com.ecommerce.mini_ecommerce.repository.ProductRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminOrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // Fetch all orders
    @Transactional
    public List<AdminOrderResponse> getAllOrders() {

        return orderRepository
            .findAllByOrderByCreatedAtDesc()
            .stream()
            .map(AdminOrderResponse::from)
            .toList();
    }

    // Fetch single order
    @Transactional
    public AdminOrderResponse getOrderById(Long id) {

        Order order = findOrder(id);

        return AdminOrderResponse.from(order);
    }

    // Update order status
    @Transactional
    public AdminOrderResponse updateOrderStatus(
            Long id,
            OrderStatus newStatus) {

        Order order = findOrder(id);

        OrderStatus currentStatus = order.getStatus();

        if (currentStatus == newStatus) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Order already has this status."
            );
        }

        validateStatusTransition(currentStatus, newStatus);

        if (newStatus == OrderStatus.CANCELLED) {
            restoreStock(order);
        }

        order.setStatus(newStatus);

        Order savedOrder = orderRepository.save(order);

        return AdminOrderResponse.from(savedOrder);
    }

    // Find order or throw exception
    private Order findOrder(Long id) {

        return orderRepository.findWithItemsById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Order not found with id: " + id
            ));
    }

    // Validate status transitions
    private void validateStatusTransition(
            OrderStatus current,
            OrderStatus next) {

        boolean valid = switch (current) {

            case PLACED ->
                next == OrderStatus.PROCESSING ||
                next == OrderStatus.CANCELLED;

            case PROCESSING ->
                next == OrderStatus.SHIPPED ||
                next == OrderStatus.CANCELLED;

            case SHIPPED ->
                next == OrderStatus.DELIVERED;

            case DELIVERED, CANCELLED -> false;
        };

        if (!valid) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid order status transition: "
                    + current + " -> " + next
            );
        }
    }

    // Restore stock when an order is cancelled
    private void restoreStock(Order order) {

        for (OrderItem item : order.getItems()) {

            Product product = productRepository
                .findByIdForUpdate(item.getProductId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot restore stock. Product not found: "
                        + item.getProductId()
                ));

            product.setQuantity(
                product.getQuantity() + item.getQuantity()
            );
        }
    }
}