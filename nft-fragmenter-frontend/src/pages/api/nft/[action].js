import axios from 'axios';

const handler = async (req, res) => {

    const {
        query: { action },
    } = req;

    if (req.method === 'POST') {
        try {
            const backendResponse = await axios.post(`http://localhost:3001/api/nft/${action}`, req.body);
            res.status(200).json(backendResponse.data);
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default handler;
