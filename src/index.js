import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  countryInput: document.querySelector('.country-input'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const resetMarkup = () => {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};

const createCountryList = arr => {
  const markup = arr
    .map(({ flags, name }) => {
      return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.common} flag" width="30" height="30" class="country-list__img"><p class="country-list__text">${name.common}</p></li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
};

const createCountryInfo = arr => {
  const markup = arr
    .map(({ flags, name, capital, population, languages }) => {
      const countryLanguages = Object.values(languages).join(', ');
      return `
        <div class="country-info__wrapper">
          <div class="country-info__name-wrapper">
             <img src="${flags.svg}" alt="${name.common}" width="40" height="40" class="country-info__img" />
             <p class="country-info__name">${name.common}</p>
          </div>
          <p class="country-info__text">Capital: <span class="country-info__text-description">${capital}</span></p>
          <p class="country-info__text">Population: <span class="country-info__text-description">${population}</span></p>
          <p class="country-info__text">Languages: <span class="country-info__text-description">${countryLanguages}</span></p>
        </div>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
};

const getCountry = () => {
  const value = refs.countryInput.value.trim();

  if (value.length === 0) {
    resetMarkup();
    return;
  } else {
    fetchCountries(value)
      .then(res => {
        if (res.length > 10) {
          resetMarkup();
          return Notify.info('Too many matches found. Please enter a more specific name.');
        }
        if (res.length >= 2 && res.length <= 10) {
          resetMarkup();
          return createCountryList(res);
        }
        if (res.length === 1) {
          resetMarkup();
          return createCountryInfo(res);
        }
      })
      .catch(err => {
        resetMarkup();
        Notify.failure('Oops, there is no country with that name');
      });
  }
};

refs.countryInput.addEventListener('input', debounce(getCountry, DEBOUNCE_DELAY));