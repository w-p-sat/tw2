module.exports = async (req, res) => {
    try {
        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const GAME_NAME = 'Slots';

        // 1. Отримання токена доступу
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('Failed to get access token from Twitch.');
            res.status(500).send('Error: Could not get access token.');
            return;
        }

        // 2. Пошук ID гри за назвою
        const gamesResponse = await fetch(`https://api.twitch.tv/helix/games?name=${encodeURIComponent(GAME_NAME)}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': CLIENT_ID
            }
        });
        const gamesData = await gamesResponse.json();

        if (!gamesData || gamesData.data.length === 0) {
            console.log('Game "Slots" not found.');
            res.status(200).json([]);
            return;
        }

        const gameId = gamesData.data[0].id;

        // 3. Отримання стрімів за знайденим ID
        const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': CLIENT_ID
            }
        });
        const streamsData = await streamsResponse.json();

        console.log('Twitch API response:', JSON.stringify(streamsData, null, 2));

        if (streamsData && streamsData.data && streamsData.data.length > 0) {
            res.status(200).json(streamsData.data);
        } else {
            console.log('No active streams found for the game ID.');
            res.status(200).json([]);
        }

    } catch (error) {
        console.error('Error fetching Twitch streams:', error);
        res.status(500).send('Internal Server Error');
    }
};
