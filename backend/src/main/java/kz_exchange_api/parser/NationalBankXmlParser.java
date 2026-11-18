
package kz_exchange_api.parser;

import kz_exchange_api.dto.NationalBankRate;
import org.springframework.stereotype.Component;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class NationalBankXmlParser {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd.MM.uuuu");

    public List<NationalBankRate> parse(String xml) {
        try {
            DocumentBuilderFactory factory =
                    DocumentBuilderFactory.newInstance();

            factory.setFeature(
                    "http://apache.org/xml/features/disallow-doctype-decl",
                    true
            );

            factory.setFeature(
                    XMLConstants.FEATURE_SECURE_PROCESSING,
                    true
            );

            factory.setFeature(
                    "http://xml.org/sax/features/external-general-entities",
                    false
            );

            factory.setFeature(
                    "http://xml.org/sax/features/external-parameter-entities",
                    false
            );

            factory.setXIncludeAware(false);
            factory.setExpandEntityReferences(false);

            Document document = factory
                    .newDocumentBuilder()
                    .parse(new InputSource(new StringReader(xml)));

            NodeList items = document.getElementsByTagName("item");
            List<NationalBankRate> rates = new ArrayList<>();

            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);

                String code = getText(item, "title").trim();
                String rateText = getText(item, "description");
                String quantityText = getText(item, "quant");
                String dateText = getText(item, "pubDate");

                BigDecimal rate = new BigDecimal(
                        rateText.trim().replace(",", ".")
                );

                Integer quantity = Integer.parseInt(
                        quantityText.trim()
                );

                LocalDate rateDate = LocalDate.parse(
                        dateText.trim(),
                        DATE_FORMATTER
                );

                rates.add(new NationalBankRate(
                        code,
                        rate,
                        quantity,
                        rateDate
                ));
            }

            return rates;

        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Failed to parse National Bank XML", e
            );
        }
    }

    private String getText(Element element, String tagName) {
        NodeList nodes = element.getElementsByTagName(tagName);

        if (nodes.getLength() == 0) {
            throw new IllegalArgumentException(
                    "Missing XML element: " + tagName
            );
        }

        return nodes.item(0).getTextContent();
    }
}
