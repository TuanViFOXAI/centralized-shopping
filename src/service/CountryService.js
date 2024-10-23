export default class CountryService {
    getCountries() {
        return fetch('demo/data/location.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
