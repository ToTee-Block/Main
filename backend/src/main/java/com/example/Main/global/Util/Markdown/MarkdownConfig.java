package com.example.Main.global.Util.Markdown;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.html.HtmlRenderer;

@Configuration
public class MarkdownConfig {

    @Bean
    public Parser  parser() {
        return Parser.builder().build();
    }

    @Bean
    public HtmlRenderer htmlRenderer() {
        return HtmlRenderer.builder().build();
    }
}