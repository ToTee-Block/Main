package com.example.Main.domain.TechStack.enums;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public enum TechStacks {
    C("C"),
    CC("C++"),
    CCC("C#"),
    JAVA("JAVA"),
    JSP("JSP"),
    JAVASCRIPT("JavaScript"),
    KOTLIN("Kotlin"),
    OBJC("Obj-C"),
    PERL("Perl"),
    PHP("PHP"),
    PYTHON("Python"),
    RUBY("Ruby"),
    RUST("Rust"),
    SWIFT("Swift"),
    TYPESCRIPT("TypeScript"),
    ;

    private String value;

    TechStacks(String value) {
        this.value = value;
    }

    public static List<String> printAllTechStacks() {
        List<String> allStacks = new ArrayList<>();
        for (TechStacks techStack : TechStacks.values()) {
            allStacks.add(techStack.getValue());
        }

        return allStacks;
    }

}
