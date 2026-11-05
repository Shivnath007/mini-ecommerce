package com.ecommerce.mini_ecommerce.service;

import com.ecommerce.mini_ecommerce.dto.CheckoutRequest;
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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order placeOrder(CheckoutRequest request) {

        Set<Long> productIds = new HashSet<>();

        for (CheckoutRequest.CheckoutItemRequest item : request.items()) {
            if (!productIds.add(item.productId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Each product must appear only once in the cart.");
            }
        }

        Order order = new Order();

        // Generate order number before saving.
        order.setOrderNumber(
                "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());

        order.setCustomerName(request.customerName().trim());
        order.setEmail(request.email().trim());
        order.setPhone(request.phone().trim());
        order.setAddress(request.address().trim());
        order.setStatus(OrderStatus.PLACED);

        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutRequest.CheckoutItemRequest requestedItem : request.items()) {

            Product product = productRepository
                    .findByIdForUpdate(requestedItem.productId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Product not found: " + requestedItem.productId()));

            int quantity = requestedItem.quantity();

            if (product.getQuantity() < quantity) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Insufficient stock for product: " + product.getName());
            }

            BigDecimal unitPrice = BigDecimal
                    .valueOf(product.getPrice())
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal lineTotal = unitPrice
                    .multiply(BigDecimal.valueOf(quantity))
                    .setScale(2, RoundingMode.HALF_UP);

            OrderItem orderItem = new OrderItem();

            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setQuantity(quantity);
            orderItem.setLineTotal(lineTotal);

            order.addItem(orderItem);

            total = total.add(lineTotal);

            product.setQuantity(product.getQuantity() - quantity);
        }

        order.setTotalAmount(
                total.setScale(2, RoundingMode.HALF_UP));

        return orderRepository.saveAndFlush(order);
    }

}
