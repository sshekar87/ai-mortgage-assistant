export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const { homePrice, loanAmount, loanType, state = 'FL' } = req.query;
        
        const ZILLOW_API_BASE = 'https://mortgageapi.zillow.com/getCurrentRates';
        const PARTNER_ID = 'RD-MPWGSPZ';
        
        const url = `${ZILLOW_API_BASE}?partnerId=${PARTNER_ID}&queries.1.propertyBucket.location.stateAbbreviation=${state}&queries.1.propertyBucket.propertyValue=${homePrice}&queries.1.propertyBucket.loanAmount=${loanAmount}&queries.1.loanType=${loanType}`;
        
        console.log('Fetching from Zillow:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch rates',
            message: error.message 
        });
    }
}