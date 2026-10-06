package com.ecommerce.mini_ecommerce.repository;

import com.ecommerce.mini_ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}