package com.ecommerce.mini_ecommerce.service;

import com.ecommerce.mini_ecommerce.exception.ProductNotFoundException;
import com.ecommerce.mini_ecommerce.model.Product;
import org.springframework.stereotype.Service;
import com.ecommerce.mini_ecommerce.repository.ProductRepository;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

    productRepository.delete(product);
}
}
