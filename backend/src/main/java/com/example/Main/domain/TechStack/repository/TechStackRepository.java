package com.example.Main.domain.TechStack.repository;

import com.example.Main.domain.TechStack.entity.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechStackRepository extends JpaRepository<TechStack, Long> {
}
