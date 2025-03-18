package org.example.services;

import jakarta.enterprise.context.ApplicationScoped;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@ApplicationScoped
public class FileService {

    public List<String> listFiles() {
        URL url = getClass().getClassLoader().getResource("file");
        if (url == null) {
            throw new IllegalStateException("Директория 'file' не найдена в ресурсах.");
        }
        try {
            File dir = new File(url.toURI());
            return Arrays.stream(Objects.requireNonNull(dir.listFiles()))
                    .filter(file -> file.isFile() &&
                            (file.getName().endsWith(".txt") || file.getName().endsWith(".pdf")))
                    .map(File::getName)
                    .collect(Collectors.toList());
        } catch (URISyntaxException e) {
            throw new RuntimeException("Ошибка доступа к директории /file", e);
        }
    }

    public byte[] getFileContent(String fileName) throws IOException {
        String path = "file/" + fileName;
        try (var is = getClass().getClassLoader().getResourceAsStream(path)) {
            if (is == null) {
                throw new IOException("Файл не найден: " + fileName);
            }
            return is.readAllBytes();
        }
    }
}
