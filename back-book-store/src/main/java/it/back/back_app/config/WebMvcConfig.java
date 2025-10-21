package it.back.back_app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${server.file.book.path}")
    private String bookFilePath;

    @Value("${server.file.usedbook.path}")
    private String usedBookFilePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 도서 이미지
        registry.addResourceHandler("/files/book/**")
                .addResourceLocations("file:" + bookFilePath);

        // 중고 도서 이미지
        registry.addResourceHandler("/files/usedbook/**")
                .addResourceLocations("file:" + usedBookFilePath);
    }
}

