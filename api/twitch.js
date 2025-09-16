module.exports = async (req, res) => {
    try {
        const response = await fetch('https://streamers.stream/api/v1/search/channel_by_game?game_name=Slots');
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching streams from alternative API:', error);
        res.status(500).send('Internal Server Error');
    }
};
