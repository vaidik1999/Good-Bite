const axios = require('axios');
const getResturants = async () => {
    
    const {data} = await axios.get('https://brene180q1.execute-api.us-east-1.amazonaws.com/dev/list-restaurants')
    return data;
}

module.exports = {
    getResturants
}