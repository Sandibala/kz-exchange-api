
package kz_exchange_api.dto;

import kz_exchange_api.entity.Currency;

public record CurrencyResponse(String code, String name) {

    public static CurrencyResponse from(Currency currency) {
        return new CurrencyResponse(
                currency.getCode(),
                currency.getName()
        );
    }
}
