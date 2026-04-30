import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';

const Scanner = () => {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        // Render ka live URL - Aapka live backend link
        const API_URL = "https://smart-energy-app-bbac.onrender.com/api/batteries";

        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250 },
            fps: 5,
            // YE RAHI MAIN SETTING BACK CAMERA KE LIYE
            videoConstraints: {
                facingMode: { exact: "environment" }
            },
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true
        });

        scanner.render(success, error);

        async function success(result) {
            scanner.clear();
            setScanResult(result);

            // Scan hote hi data database mein save hoga
            try {
                const response = await axios.post(API_URL, {
                    batteryId: result,
                    status: "Active",
                    lastScanned: new Date()
                });
                console.log("Data saved to MongoDB:", response.data);
                alert("Battery Scanned & Saved!");
            } catch (err) {
                console.error("Error saving to DB:", err);
                alert("Database mein save nahi hua!");
            }
        }

        function error(err) {
            // Sirf scanning ke error logs hain, ise ignore kar sakte hain
        }

        return () => scanner.clear();
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Smart Energy Battery Scanner</h2>
            {scanResult ? (
                <div>Success: <a href={scanResult}>{scanResult}</a></div>
            ) : (
                <div id="reader"></div>
            )}
        </div>
    );
};

export default Scanner;