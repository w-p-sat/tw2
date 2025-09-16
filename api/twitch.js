module.exports = async (req, res) => {
    try {
        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const GAME_ID = '490403'; // ID гри Slots

        // Отримання токена
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Запит на стріми з мовами uk, ru
        const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?game_id=${GAME_ID}&language=uk&language=ru`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': CLIENT_ID
            }
        });
        const streamsData = await streamsResponse.json();

        console.log('Twitch API Response:', JSON.stringify(streamsData, null, 2));

        if (streamsData && streamsData.data && streamsData.data.length > 0) {
            res.status(200).json(streamsData.data);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
