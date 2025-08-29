const API_ENDPOINT = '/devmode-guid';

start();

function start(){
    console.log('STARTING DEV MODE SCRIPT');
    let currentGuid = undefined;
    let requesting = false;
    let nullsInARow = 0;

    setInterval(async () => {
        if(requesting){
            return;
        }else{
            requesting = true;
            const guid = await fetchGuid();
            if(guid){
                nullsInARow = 0;
                if(!currentGuid){
                    currentGuid = guid;
                }else if(guid !== currentGuid){
                    window.location.reload();
                }
            }else{
                nullsInARow++;
                if(nullsInARow >= 10){
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
            requesting = false;
        }

    }, 350);

};

async function fetchGuid() {
    try {
        const response = await fetch(API_ENDPOINT, { cache: 'no-store' }); // Crucial for always getting the latest
        if (!response.ok) {
            return null;
        }
        return response.text(); // Assuming the server responds with JSON like { guid: "..." }

    } catch (error) {
        return null;
    }
}