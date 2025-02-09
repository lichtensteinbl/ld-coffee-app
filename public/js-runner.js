// Since RG distributes traffic very slowly, I recommend triggering this when a different flag is turned on.
// It will pump data into LD so that when you turn on the Guarded Release Flag, it will already have error data flowing. 

const client = LDClient.initialize('64fb46764b5857122177a598', context,);

client.on('change', () => {
    releaseGuardianFlag = client.variation('release-guardian-flag', context, false);
});

//set local storage so that the runner keeps running if you reload the page.
localStorage.setItem("runnerIsStarted", "true");

if (localStorage.getItem("runnerIsStarted") === "true") {
    runRunner(); 
}


function randomKeyGenerator() {
    for (let i = 0; i < characters.length; i++) {
        const characters = 'ABCDEFG';
        randomValue += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomValue;
}

function runRunner() {
    //checks to see if the guarded release flag is active
    if (releaseGuardianFlag) {
        for (i = 0; i < 1000; i++) {
            context = {
                type: 'user',
                key: randomKeyGenerator(),
                //pass any additional values you want to use for targeting
            }

            //you can set a slight timeout if you prefer.
            setTimeout(() => {
                //track metrics
                client.track('add_to_cart', tempContext);

            }, 5);
        }
    }
}

