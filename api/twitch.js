const fetch = require('node-fetch');

// Змінні, які будуть взяті з Vercel (КРОК 5!)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const GAME_ID = '490403'; // ID гри Slots

module.exports = async (req, res) => {
    try {
        // Отримання токена доступу
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            res.status(500).send('Error: Could not get access token from Twitch.');
            return;
        }

        // Отримання списку стрімів
        const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?game_id=${GAME_ID}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': CLIENT_ID
            }
        });
        const streamsData = await streamsResponse.json();

        // Повертаємо дані про стріми
        res.status(200).json(streamsData.data);
    } catch (error) {
        console.error('Error fetching Twitch streams:', error);
        res.status(500).send('Internal Server Error');
    }
};