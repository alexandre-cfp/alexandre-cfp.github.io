/**
 * Projet : Activité Pays
 * Auteur : Alexandre.Olvrd
 * Date : 25.09.23
 **/
"use strict";

const API_URL = "https://restcountries.com/v3.1/all";

// 10 minutes en millisecondes
const REFRESH_DELAY = 600000;

async function fetchCountries() {
    let response = await fetch(API_URL);
    return response;
}

/**
 * Fonction de comparaison pour trier les pays par ordre alphabétique
 * @param {Object} a Pays 1
 * @param {Object} b Pays 2
 * @returns la comparaison des deux pays
 */
function compareByName(a, b) {
    return a.translations.fra.common.localeCompare(b.translations.fra.common);
}

function getData() {
    fetchCountries()
        .then(async response => {
            localStorage.setItem("countries", await response.text());
            setData();
        })
        .catch(err => console.error(err));
}

function setData() {
    let htmlData = "";

    let countries = JSON.parse(localStorage.getItem("countries")).sort(compareByName);

    for (let c of countries) {
        htmlData += `
        <div>
            <img src="${c.flags.png}" alt="${c.translations.fra.common}">
            <h1>${c.translations.fra.common}</h1>
            <p>Population : ${c.population}</p>
        </div>
    `;
    }

    let minLastUpdate = Math.floor((Date.now() - localStorage.getItem("lastUpdate")) / 60000);

    document.querySelector("#lastUpdate").innerHTML = `Dernière mise à jour: il y a ${minLastUpdate} min.`;

    document.querySelector("section").innerHTML = htmlData;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");
    })
}

if (localStorage.getItem("lastUpdate") === null || localStorage.getItem("countries") === null || Date.now() - localStorage.getItem("lastUpdate") > REFRESH_DELAY) {
    localStorage.setItem("lastUpdate", Date.now());
    getData();
}
else {
    setData();
}