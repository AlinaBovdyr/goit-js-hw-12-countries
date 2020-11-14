import './sass/styles.scss';
// import fetchCountries from './scripts/fetchCountries'
import countryCardTpl from './templates/country-card.hbs';
const debounce = require('lodash.debounce');

const refs = {
    cardContainer: document.querySelector('.js-card-container'),
    searchForm: document.querySelector('.form-input'),
    searchList: document.querySelector('.js-list')
}

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    e.preventDefault();

    const searchQuery = e.target.value;
    
    fetchCountries(searchQuery).then(data => {
        if (data.length === 1) {
            refs.searchList.innerHTML = '';
            return renderCountryCard(data);
        } else if (10 >= data.length && data.length > 1) {     
            return refs.searchList.innerHTML = createCountryListItemsMarkup(data);
        }
        console.log('too many countries');   
    });
}


function fetchCountries(countryName) {
    return fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
        .then(response => {
            return response.json();
        })
}

function renderCountryCard(country) {
    const markup = countryCardTpl(country);
    refs.cardContainer.innerHTML = markup;
}

function createCountryListItemsMarkup(items) {
    return items.map(item => `<li>${item.name}</li>`).join('')
}
