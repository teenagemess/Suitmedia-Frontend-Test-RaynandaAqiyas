document.addEventListener("DOMContentLoaded", function () {
    var prevScrollpos = window.pageYOffset;

    window.addEventListener('scroll', function () {
        var currentScrollPos = window.pageYOffset;

        if (prevScrollpos > currentScrollPos) {
            // Scrolling up
            document.querySelector('.scrolling-navbar').classList.remove('hidden');
        } else {
            // Scrolling down
            document.querySelector('.scrolling-navbar').classList.add('hidden');
        }

        prevScrollpos = currentScrollPos;
    });

    var selectElement = document.getElementById('floatingSelect');
    selectElement.addEventListener('change', handleSelectChange);

    var sortBySelectElement = document.getElementById('sortBySelect');
    sortBySelectElement.addEventListener('change', handleSortByChange);
    
    window.onscroll = handleScroll;
    generateCards();

    var initialShowPerPage = getShowPerPageFromLocalStorage() || 10;
    adjustCardDisplay(initialShowPerPage);
    selectElement.value = initialShowPerPage;
    updateShowingText(initialShowPerPage);

    // Initialize the sorting value from local storage or default to 'newest'
    var initialSortValue = getSortByFromLocalStorage() || 'newest';
    sortBySelectElement.value = initialSortValue;
    sortCards(initialSortValue);

    function handleSelectChange() {
        var selectedValue = parseInt(selectElement.value);
        saveShowPerPageToLocalStorage(selectedValue);
        localStorage.setItem('selectedValue', selectedValue);
        adjustCardDisplay(selectedValue);
        updateShowingText(selectedValue);
    }

    function saveShowPerPageToLocalStorage(value) {
        localStorage.setItem('showPerPage', value);
    }

    function getShowPerPageFromLocalStorage() {
        return parseInt(localStorage.getItem('showPerPage'));
    }

    function updateShowingText(selectedValue) {
        var showingTextElement = document.querySelector('#sort-list .text');
        var upperBound = selectedValue < 100 ? selectedValue : 100;
        showingTextElement.textContent = `Showing 1 - ${upperBound} of 100`;
    }

    function adjustCardDisplay(cardsPerPage) {
        var cards = document.querySelectorAll('.card');
        cards.forEach(function (card, index) {
            card.style.display = 'none';
        });

        for (var i = 0; i < cardsPerPage && i < cards.length; i++) {
            cards[i].style.display = 'block';
        }
    }

    function handleSortByChange() {
        var selectedSortValue = sortBySelectElement.value;
        saveSortByToLocalStorage(selectedSortValue);
        sortCards(selectedSortValue);
    }

    function saveSortByToLocalStorage(value) {
        localStorage.setItem('sortBy', value);
    }

    function getSortByFromLocalStorage() {
        return localStorage.getItem('sortBy');
    }

    function sortCards(sortValue) {
        var cards = document.querySelectorAll('.card');
        var cardsArray = Array.from(cards);

        if (sortValue === 'newest') {
            cardsArray.sort(compareDatesDesc);
        } else if (sortValue === 'oldest') {
            cardsArray.sort(compareDatesAsc);
        }

        var cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';

        cardsArray.forEach(function (card) {
            cardContainer.appendChild(card);
        });
    }

    function compareDatesAsc(card1, card2) {
        var date1 = new Date(card1.querySelector('.card-date').textContent);
        var date2 = new Date(card2.querySelector('.card-date').textContent);
        return date1 - date2;
    }

    function compareDatesDesc(card1, card2) {
        var date1 = new Date(card1.querySelector('.card-date').textContent);
        var date2 = new Date(card2.querySelector('.card-date').textContent);
        return date2 - date1;
    }

    function handleScroll() {
        const currentScrollPos = window.pageYOffset;

        const bannerImage = document.querySelector(".banner img");
        bannerImage.style.transform = `translateY(${-currentScrollPos * 0.7}px)`;

        const bannerText = document.querySelector(".banner-text h1");
        bannerText.style.transform = `translateX(${-currentScrollPos * 0.7}px)`;

        const bannerText2 = document.querySelector(".banner-text p");
        bannerText2.style.transform = `translateX(${-currentScrollPos * 0.7}px)`;

        const header = document.querySelector("header");
        header.classList.toggle("inactive", prevScrollpos <= currentScrollPos);

        prevScrollpos = currentScrollPos;
    }

    function generateCards() {
        const cardContainer = document.getElementById('cardContainer');
        const existingCard = document.querySelector('.card');

        cardContainer.innerHTML = '';

        for (let i = 0; i < 100; i++) {
            if (i === 5) {
                continue;
            }

            const newCard = existingCard.cloneNode(true);

            newCard.querySelector('.card-text').textContent = getCardText(i);

            const imageUrl = i % 2 === 0 ?
                'assets/photocard1.jpg' :
                'assets/photocard2.jpg';

            newCard.querySelector('.card-img-top').src = imageUrl;

            const randomDate = generateRandomDate();
            newCard.querySelector('.card-date').textContent = randomDate;

            cardContainer.appendChild(newCard);
        }
    }

    function generateRandomDate() {
        const startDate = new Date('2020-01-01');
        const endDate = new Date('2023-12-31');

        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return randomDate.toLocaleDateString('en-US', options);
    }

    function getCardText(index) {
        return index % 2 === 0 ?
            "Jangan Asal Pilih Influencer Berikut Cara Menyusun Strategi Influencer agar hidup tenang dan nyaman" :
            "Kenali Tingkatan Influencers berdasarkan jumlah Followers";
    }
    
});
