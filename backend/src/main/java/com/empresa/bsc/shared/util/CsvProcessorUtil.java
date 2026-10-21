package com.empresa.bsc.shared.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class CsvProcessorUtil {

    private static final String DELIMITER = ";";

    public static ByteArrayInputStream generateCsv(List<String> headers, List<List<String>> rows) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Escribir BOM UTF-8 para que Excel abra correctamente los caracteres en español (ñ, tildes)
            out.write(0xEF);
            out.write(0xBB);
            out.write(0xBF);

            // Escribir encabezados
            writer.println(String.join(DELIMITER, headers));

            // Escribir filas
            for (List<String> row : rows) {
                writer.println(String.join(DELIMITER, row.stream()
                        .map(CsvProcessorUtil::escapeField)
                        .toList()));
            }
            writer.flush();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar archivo CSV: " + e.getMessage(), e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    private static String escapeField(String val) {
        if (val == null) return "";
        if (val.contains(DELIMITER) || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}
