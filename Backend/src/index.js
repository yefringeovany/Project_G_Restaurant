const app = require('./app/app');

const PORT = 5000;

async function init() {
    try {
        await app.listen(PORT);
        console.log('Server on port 5000')
    } catch (error) {
        console.error('Error occurred during initialization:', error);
    }
}

init().catch(error => {
    console.error('Error occurred during initialization:', error);
});
