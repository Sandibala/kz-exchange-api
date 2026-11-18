package kz_exchange_api.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class NationalBankClient {

    private static final String RATES_URL =
            "https://nationalbank.kz/rss/rates_all.xml";

    private final RestClient restClient;

    public NationalBankClient() {
        this.restClient = RestClient.create();
    }

    public String fetchRates() {
        return restClient.get()
                .uri(RATES_URL)
                .retrieve()
                .body(String.class);
    }
}
