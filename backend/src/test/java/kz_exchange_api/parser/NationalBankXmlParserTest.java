
package kz_exchange_api.parser;

import kz_exchange_api.dto.NationalBankRate;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NationalBankXmlParserTest {

    private final NationalBankXmlParser parser =
            new NationalBankXmlParser();

    @Test
    void shouldParseCurrencyRates() {

        String xml = """
                <rss>
                    <channel>
                        <item>
                            <title>AUD</title>
                            <pubDate>18.11.2026</pubDate>
                            <description>299.1</description>
                            <quant>1</quant>
                            <index>DOWN</index>
                            <change>-0.87</change>
                            <link/>
                        </item>
                        <item>
                            <title>AZN</title>
                            <pubDate>18.11.2026</pubDate>
                            <description>261.92</description>
                            <quant>1</quant>
                            <index>DOWN</index>
                            <change>-0.26</change>
                            <link/>
                        </item>
                    </channel>
                </rss>
                """;

        List<NationalBankRate> rates = parser.parse(xml);

        assertEquals(2, rates.size());

        NationalBankRate aud = rates.get(0);

        assertEquals("AUD", aud.currencyCode());
        assertEquals(
                0,
                new BigDecimal("299.1").compareTo(aud.rate())
        );
        assertEquals(1, aud.quantity());
        assertEquals(
                LocalDate.of(2026, 11, 18),
                aud.rateDate()
        );

        NationalBankRate azn = rates.get(1);

        assertEquals("AZN", azn.currencyCode());
        assertEquals(
                0,
                new BigDecimal("261.92").compareTo(azn.rate())
        );
        assertEquals(1, azn.quantity());
        assertEquals(
                LocalDate.of(2026, 11, 18),
                azn.rateDate()
        );
    }

    @Test
    void shouldRejectInvalidXml() {

        String xml = "<rss><item><title>USD</title>";

        assertThrows(
                IllegalArgumentException.class,
                () -> parser.parse(xml)
        );
    }

    @Test
    void shouldRejectMissingQuantity() {

        String xml = """
                <rss>
                    <item>
                        <title>USD</title>
                        <pubDate>18.11.2026</pubDate>
                        <description>495.50</description>
                    </item>
                </rss>
                """;

        assertThrows(
                IllegalArgumentException.class,
                () -> parser.parse(xml)
        );
    }

    @Test
    void shouldRejectMissingDate() {

        String xml = """
                <rss>
                    <item>
                        <title>USD</title>
                        <description>495.50</description>
                        <quant>1</quant>
                    </item>
                </rss>
                """;

        assertThrows(
                IllegalArgumentException.class,
                () -> parser.parse(xml)
        );
    }
}
