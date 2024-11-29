package com.example.Main.domain.TechStack.entity;

import com.example.Main.domain.Mentor.entity.MentorTechStack;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class TechStack extends BaseEntity {
    @Column(unique = true, length = 50)
    private String name;

    @OneToMany(mappedBy = "techStack")
    private List<MentorTechStack> mentors;
}
