import './css/styles.css';
import lodash from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

Notiflix.Notify.init({ timeout: 1500 });

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', lodash(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const targetValue = e.target.value.trim();
  if (targetValue !== '') {
    fetchCountries(targetValue)
      .then(country => {
        if (country.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (country.length <= 10 && country.length >= 2) {
          createMarkupList(country);
        } else if (country.length === 1) {
          createMarkupCard(country);
        }
      })
      .catch(eror =>
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
  }
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function createMarkupList(countries) {
  countryList.innerHTML = countries
    .map(country => {
      return `<li class='item'>
  <img src='${country.flags.svg}' alt='country flag' width='30' height='20'>
  <p>${country.name.official}</p>
  </li>`;
    })
    .join('');
}

function createMarkupCard(card) {
  countryInfo.innerHTML = card.flatMap(c => {
    return `<img src='${
      c.flags.svg
    }' alt='country flag' width='250' height='150'>
    <h2 class='card-title'>${c.name.official}</h2>
    <p class='card-descr'>Capital: <span>${c.capital}</span></p>
    <p class='card-descr'>Population: <span>${c.population}<span></p>
    <p class='card-descr'>languages: <span>${Object.values(c.languages).join(
      ', '
    )}<span></p>`;
  });
}
