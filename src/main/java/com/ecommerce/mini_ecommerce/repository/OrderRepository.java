package com.ecommerce.mini_ecommerce.repository;

import com.ecommerce.mini_ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

}