package com.example.Main.domain.TechStack.entity;

import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class TechStack extends BaseEntity {
    @Column(unique = true, length = 50)
    private String name;
}
