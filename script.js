liff.init({ liffId: "YOUR_LIFF_ID" })
    .then(() => {
        console.log("LIFF initialized");
        // Further actions after initialization
    })
    .catch((err) => {
        console.error("LIFF initialization failed", err);
    });
