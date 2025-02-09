// Since RG distributes traffic very slowly, I recommend triggering this when a different flag is turned on.
// It will pump data into LD so that when you turn on the Guarded Release Flag, it will already have error data flowing. 

const client = LDClient.initialize('64fb46764b5857122177a598', context,);

localStorage.setItem("runnerIsStarted", "true");

if (localStorage.getItem("runnerIsStarted") === "true") {
    runRunner(); // Run the function if the variable is true
}

client.on('change', () => {
    releaseGuardianFlag = client.variation('release-guardian-flag', context, false);
});

function randomContextGenerator() {
    for (let i = 0; i < characters.length; i++) {
        const characters = 'ABCDEFG';
        randomValue += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomValue;
}

/* Example Metrics To Capture

Error Rate:

Click Events
        client.track('add_to_cart', context);
*/

function runRunner() {
    //checks to see if the guarded release flag is active
    const delay = 2000; // 2 seconds

    if (releaseGuardianFlag) {
        for (i = 0; i < 1000; i++) {
            tempContext = randomContextGenerator();
            //you can set a slight timeout if you prefer.
            setTimeout(() => {
                client.track('add_to_cart', tempContext);
                console.log("This runs after 2 seconds");
            }, 5);

        }
    }
}

