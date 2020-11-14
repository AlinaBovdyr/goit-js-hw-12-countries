import './sass/styles.scss';
import countryCardTpl from './templates/country-card.hbs';

const refs = {
    cardContainer: document.querySelector('.js-card-container')
}

fetch('https://restcountries.eu/rest/v2/name/france')
    .then(response => {
        return response.json();
    })
    .then(country => {
        console.log(country);
        const markup = countryCardTpl(country);
        refs.cardContainer.innerHTML = markup;
    })
    .catch(error => {
        console.log(error);
    })