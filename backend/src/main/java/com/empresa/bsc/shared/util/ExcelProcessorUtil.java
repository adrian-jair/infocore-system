package com.empresa.bsc.shared.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelProcessorUtil {

    public static ByteArrayInputStream generateExcel(String sheetName, List<String> headers, List<List<Object>> rows) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(sheetName);

            // Estilos para encabezado corporativo (Azul oscuro / Blanco)
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setFontHeightInPoints((short) 11);

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Estilos para datos
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle numberStyle = workbook.createCellStyle();
            numberStyle.cloneStyleFrom(dataStyle);
            DataFormat format = workbook.createDataFormat();
            numberStyle.setDataFormat(format.getFormat("#,##0.0"));

            // Fila de encabezado
            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(26);
            for (int col = 0; col < headers.size(); col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers.get(col));
                cell.setCellStyle(headerCellStyle);
            }

            // Filas de datos
            int rowIdx = 1;
            for (List<Object> rowData : rows) {
                Row row = sheet.createRow(rowIdx++);
                for (int col = 0; col < rowData.size(); col++) {
                    Cell cell = row.createCell(col);
                    Object val = rowData.get(col);
                    if (val == null) {
                        cell.setCellValue("");
                        cell.setCellStyle(dataStyle);
                    } else if (val instanceof Number num) {
                        cell.setCellValue(num.doubleValue());
                        cell.setCellStyle(numberStyle);
                    } else if (val instanceof Boolean b) {
                        cell.setCellValue(b);
                        cell.setCellStyle(dataStyle);
                    } else {
                        cell.setCellValue(val.toString());
                        cell.setCellStyle(dataStyle);
                    }
                }
            }

            // Auto-ajustar ancho de columnas
            for (int col = 0; col < headers.size(); col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al generar archivo Excel .xlsx: " + e.getMessage(), e);
        }
    }
}
