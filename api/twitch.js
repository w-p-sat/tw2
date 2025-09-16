const GAME_ID = '490403'; // ID гри Slots
const LANGUAGES = ['uk', 'ru', 'en', 'es', 'de', 'fr', 'pl']; // Список мов

module.exports = async (req, res) => {
    try {
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('Failed to get access token from Twitch.');
            res.status(500).send('Error: Could not get access token.');
            return;
        }

        const languageQuery = LANGUAGES.map(lang => `language=${lang}`).join('&');
        const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?game_id=${GAME_ID}&${languageQuery}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': process.env.CLIENT_ID
            }
        });
        const streamsData = await streamsResponse.json();

        console.log('Twitch API response:', JSON.stringify(streamsData, null, 2));

        if (streamsData && streamsData.data && streamsData.data.length > 0) {
            res.status(200).json(streamsData.data);
        } else {
            console.log('No active streams found in response with specified languages.');
            res.status(200).json([]);
        }

    } catch (error) {
        console.error('Error fetching Twitch streams:', error);
        res.status(500).send('Internal Server Error');
    }
};
