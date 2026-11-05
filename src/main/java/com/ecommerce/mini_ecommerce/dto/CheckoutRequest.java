package com.ecommerce.mini_ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record CheckoutRequest(

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    String customerName,

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 254, message = "Email is too long")
    String email,

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[0-9+()\\- ]{7,20}$",
        message = "Enter a valid phone number"
    )
    String phone,

    @NotBlank(message = "Address is required")
    @Size(max = 1000, message = "Address is too long")
    String address,

    @NotEmpty(message = "Cart cannot be empty")
    @Size(max = 50, message = "Too many different products in one order")
    List<@Valid CheckoutItemRequest> items

) {
    public record CheckoutItemRequest(

        @NotNull(message = "Product ID is required")
        @Positive(message = "Product ID must be positive")
        Long productId,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @Max(value = 100, message = "Quantity cannot exceed 100")
        Integer quantity

    ) {}
}