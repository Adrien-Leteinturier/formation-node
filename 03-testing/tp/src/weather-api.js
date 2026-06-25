export class WeatherApi {
    async forecast(city) {
        // En production : appel HTTP réel. Ici, simplifié.
        return { city, temp: 20 };
    }
}