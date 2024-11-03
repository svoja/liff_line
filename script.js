liff.init({ liffId: "2006526744-9zLD3PAm" })
    .then(() => {
        console.log("LIFF initialized");
        // Further actions after initialization
    })
    .catch((err) => {
        console.error("LIFF initialization failed", err);
    });