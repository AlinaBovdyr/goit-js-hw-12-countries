import getRefs from './scripts/get-refs';
import API from './scripts/fetchCountries';
import countryCardTpl from './templates/country-card.hbs';
import { alert, error } from '@pnotify/core';

import './sass/styles.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = getRefs();
const debounce = require('lodash.debounce');
const { defaults } = require('@pnotify/core');

defaults.delay = '1500';

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    const searchQuery = e.target.value;
    if (searchQuery.trim() === '') {
        clearInterface();
    }
    
    API.fetchCountries(searchQuery)
        .then(data => { 
            if (data.length === 1) {
                refs.searchList.innerHTML = '';
                return renderCountryCard(data);
            } else if (10 >= data.length && data.length > 1) {
                refs.cardContainer.innerHTML = '';
                return refs.searchList.innerHTML = createCountryListItemsMarkup(data);
            } else if (data.length > 10) {
                clearInterface();
                onFetchAlert();
            } else {
                onFetchError();
            } 
        })
        .catch(onFetchError);
}


function renderCountryCard(country) {
    const markup = countryCardTpl(country);
    refs.cardContainer.innerHTML = markup;
}

function createCountryListItemsMarkup(items) {
    return items.map(item => `<li>${item.name}</li>`).join('')
}

function onFetchError() {
    clearInterface();

    return error({
        text: "An unexpected country name. Try to enter a different value"
    });
}

function onFetchAlert() {
    return alert({
        text: "Too many matches found. Please enter a more specific query!",
        type: 'info'
    });
}

function clearInterface() {
    refs.cardContainer.innerHTML = '';
    refs.searchList.innerHTML = '';
}
