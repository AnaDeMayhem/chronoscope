document.addEventListener('DOMContentLoaded', function() {
    AOS.init();

    const calculateButton = document.getElementById('calculate');
    const resultsSection = document.querySelector('.results-section');
    const mainAgeDiv = document.getElementById('main-age');
    const timelineBreakdownDiv = document.getElementById('timeline-breakdown');
    const birthdayCountdownDiv = document.getElementById('birthday-countdown');
    const zodiacInfoDiv = document.getElementById('zodiac-info');
    const dayBornDiv = document.getElementById('day-born');
    const historicalFactsDiv = document.getElementById('historical-facts');
    const dobInput = document.getElementById('dob');
    const tobInput = document.getElementById('tob');

    calculateButton.addEventListener('click', function() {
        console.log('Calculate button clicked!');
        const dobValue = dobInput.value;

        if (!dobValue) {
            alert('Please enter a valid date.');
            return;
        }

        const dob = new Date(dobValue + 'T00:00:00'); // Default time to 12:00 AM
        const now = new Date();

        if (isNaN(dob.getTime())) {
            alert('Please enter a valid date.');
            return;
        }

        // Clear previous results
        mainAgeDiv.innerHTML = '';
        timelineBreakdownDiv.innerHTML = '';
        birthdayCountdownDiv.innerHTML = '';
        zodiacInfoDiv.innerHTML = '';
        dayBornDiv.innerHTML = '';
        historicalFactsDiv.innerHTML = '';

        // Detailed Age Breakdown
        let ageInYears = now.getFullYear() - dob.getFullYear();
        let ageInMonths = now.getMonth() - dob.getMonth();
        let ageInDays = now.getDate() - dob.getDate();

        if (ageInDays < 0) {
            ageInMonths--;
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            ageInDays = lastDayOfMonth + ageInDays;
        }

        if (ageInMonths < 0) {
            ageInYears--;
            ageInMonths = 12 + ageInMonths;
        }

        let totalMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
        if (now.getDate() < dob.getDate()) {
            totalMonths--;
        }

        const totalWeeks = Math.floor((now - dob) / (7 * 24 * 60 * 60 * 1000));
        const totalDays = Math.floor((now - dob) / (24 * 60 * 60 * 1000));
        const totalHours = Math.floor((now - dob) / (60 * 60 * 1000));
        const totalMinutes = Math.floor((now - dob) / (60 * 1000));
        const totalSeconds = Math.floor((now - dob) / 1000);

        mainAgeDiv.innerHTML = `
            <h3>Main Age</h3>
            <p>You are ${ageInYears} years, ${ageInMonths} months, and ${ageInDays} days old.</p>
        `;

        timelineBreakdownDiv.innerHTML = `
            <h3>Timeline Breakdown</h3>
            <p>Total Weeks: ${totalWeeks}</p>
            <p>Total Days: ${totalDays}</p>
            <p>Total Hours: ${totalHours}</p>
            <p>Total Minutes: ${totalMinutes}</p>
            <p>Total Seconds: ${totalSeconds}</p>
        `;

        // Birthday Countdown
        const nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate(), dob.getHours(), dob.getMinutes(), dob.getSeconds());
        if (nextBirthday < now) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        const timeLeft = nextBirthday - now;
        const daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hoursLeft = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);

        birthdayCountdownDiv.innerHTML = `
            <h3>Countdown to Next Birthday</h3>
            <p>Days: ${daysLeft}, Hours: ${hoursLeft}, Minutes: ${minutesLeft}, Seconds: ${secondsLeft}</p>
        `;

        // Zodiac Signs
        const westernZodiac = getWesternZodiac(dob.getMonth() + 1, dob.getDate());
        const chineseZodiac = getChineseZodiac(dob.getFullYear());

        const westernZodiacEmoji = getZodiacEmoji(westernZodiac);
        const chineseZodiacEmoji = getChineseZodiacEmoji(chineseZodiac);

        zodiacInfoDiv.innerHTML = `
            <h3>Zodiac Signs</h3>
            <p>Western Zodiac: ${westernZodiac} ${westernZodiacEmoji},</p>
            <p>Chinese Zodiac: ${chineseZodiac} ${chineseZodiacEmoji},</p>
        `;

        // Day of the Week Born
        const dayOfWeek = dob.toLocaleDateString('en-US', { weekday: 'long' });

        dayBornDiv.innerHTML = `
            <h3>Day of the Week Born</h3>
            <p>${dayOfWeek}</p>
        `;

        // Famous Birthday Twin
        const famousTwinDiv = document.getElementById('famous-twin');
        const monthValue = dob.getMonth() + 1;
        const dayValue = dob.getDate();

        fetchFamousTwin(monthValue, dayValue)
            .then(famousTwin => {
                famousTwinDiv.innerHTML = `
                    <h3>Famous Birthday Twin</h3>
                    <p>${famousTwin}</p>
                `;
            })
            .catch(error => {
                famousTwinDiv.innerHTML = `
                    <h3>Famous Birthday Twin</h3>
                    <p>Error fetching famous twin data.</p>
                `;
            });

        // Historical Events on Birth Date
        const historicalEventsDiv = document.getElementById('historical-facts');
        const birthDate = dob.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const month = dob.getMonth() + 1;
        const day = dob.getDate();
        historicalEventsDiv.innerHTML = `
            <h3>Historical Events on ${birthDate}</h3>
            <div id="historicalEventsData">
                <p>Fetching historical events...</p>
            </div>
        `;

        fetch(`https://history.muffinlabs.com/date/${month}/${day}`)
            .then(response => response.json())
            .then(data => {
                const events = data.data.Events;
                const historicalEventsData = document.getElementById('historicalEventsData');
                historicalEventsData.innerHTML = ''; // Clear loading message

                if (events && events.length > 0) {
                    events.forEach(event => {
                        const eventParagraph = document.createElement('p');
                        eventParagraph.textContent = `${event.year}: ${event.text}`;
                        historicalEventsData.appendChild(eventParagraph);
                    });
                } else {
                    historicalEventsData.innerHTML = '<p>No notable historical events found for this date.</p>';
                }
            })
            .catch(error => {
                historicalEventsDiv.innerHTML = '<p>Error fetching historical events data.</p>';
            });

        // Show the results section
        resultsSection.style.display = 'grid';
    });


    function getWesternZodiac(month, day) {
        if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
            return "Capricorn";
        } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
            return "Aquarius";
        } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
            return "Pisces";
        } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
            return "Aries";
        } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
            return "Taurus";
        } else if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) {
            return "Gemini";
        } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
            return "Cancer";
        } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
            return "Leo";
        } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
            return "Virgo";
        } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
            return "Libra";
        } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
            return "Scorpio";
        } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
            return "Sagittarius";
        }
        return "Unknown";
    }

    function getChineseZodiac(year) {
        const zodiacs = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];
        return zodiacs[year % 12];
    }

    function getChineseZodiacEmoji(zodiac) {
        switch (zodiac) {
            case "Monkey": return "🐒";
            case "Rooster": return "🐓";
            case "Dog": return "🐕";
            case "Pig": return "🐖";
            case "Rat": return "🐀";
            case "Ox": return "🐂";
            case "Tiger": return "🐅";
            case "Rabbit": return "🐇";
            case "Dragon": return "🐉";
            case "Snake": return "🐍";
            case "Horse": return "🐎";
            case "Goat": return "🐐";
            default: return "";
        }
    }


    async function queryWikidata(month, day) {
        const sparqlQuery = `
        SELECT ?item ?itemLabel WHERE {
          ?item wdt:P31 wd:Q5 .
          ?item wdt:P569 ?birthDate .
          FILTER (MONTH(?birthDate) = ${month} && DAY(?birthDate) = ${day})
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        LIMIT 1
        `;

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error("Wikidata API Error:", response.status, response.statusText);
                return `Wikidata API Error: ${response.status} ${response.statusText}`;
            }

            const data = await response.json();

            if (data && data.results && data.results.bindings && data.results.bindings.length > 0) {
                const firstResult = data.results.bindings[0];
                console.log("Wikidata Result:", firstResult);
                return firstResult.itemLabel.value;
            } else {
                console.log("No famous twin found on Wikidata!");
                return "You’re unique — no twin could match your vibe today 💅✨";
            }
        } catch (error) {
            console.error("Error querying Wikidata:", error);
            return "You’re unique — no twin could match your vibe today 💅✨";
        }
    }

    async function fetchFamousTwin(month, day) {
        const result = await queryWikidata(month, day);
        if (result.startsWith("Wikidata API Error")) {
            return "You’re unique — no twin could match your vibe today 💅✨";
        }
        return result;
    }

    // Download PDF Functionality
    const downloadButton = document.getElementById('downloadPdfButton');

    downloadButton.addEventListener('click', function() {
        console.log('Download button clicked!');
        const content = document.querySelector('.results-section');

        if (typeof html2pdf === 'function') {
            console.log('html2pdf is available');
            try {
                html2pdf().set({
                    margin: 10,
                    filename: 'ChronoScope_Results.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                }).from(content).save();
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        } else {
            console.log('html2pdf is not available');
        }
    });
});

function getZodiacEmoji(zodiac) {
    switch (zodiac) {
        case "Aries": return "♈";
        case "Taurus": return "♉";
        case "Gemini": return "♊";
        case "Cancer": return "♋";
        case "Leo": return "♌";
        case "Virgo": return "♍";
        case "Libra": return "♎";
        case "Scorpio": return "♏";
        case "Sagittarius": return "♐";
        case "Capricorn": return "♑";
        case "Aquarius": return "♒";
        case "Pisces": return "♓";
        default: return "";
    }
}
