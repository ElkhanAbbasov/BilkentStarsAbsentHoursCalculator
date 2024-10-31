// ==UserScript==
// @name         Calculate Missed Hours for Classes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically calculates the total hours missed for each class based on attendance records when attendance content loads.
// @match        https://stars.bilkent.edu.tr/srs/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function calculateMissedHours() {
        const attendanceDivs = document.querySelectorAll(".attendDiv");
        const results = [];

        attendanceDivs.forEach(attendDiv => {
            const className = attendDiv.querySelector("h4")?.innerText.trim() || "Unknown Class";
            const attendanceRows = attendDiv.querySelectorAll("table tr");
            let totalMissedHours = 0;

            attendanceRows.forEach((row, index) => {
                if (index === 0) return; // Skip the header row
                const attendanceCell = row.cells[2];
                if (attendanceCell) {
                    const attended = parseInt(attendanceCell.querySelector("b")?.innerText || "0");
                    const total = parseInt(attendanceCell.innerText.split("/")[1].trim());
                    const missed = total - attended;
                    totalMissedHours += missed;
                }
            });

            results.push({ className, totalMissedHours });
        });

        if (results.length > 0) {
            results.forEach(result => {
                console.log(`Class: ${result.className}, Total Hours Missed: ${result.totalMissedHours}`);
                alert(`Class: ${result.className}, Total Hours Missed: ${result.totalMissedHours}`);
            });
        } else {
            console.log("No attendance data found.");
            alert("No attendance data found.");
        }
    }

    // Set up a mutation observer to detect when the attendance section loads
    const observer = new MutationObserver((mutations, obs) => {
        // Check if the attendance divs are added to the page
        const attendanceDivs = document.querySelectorAll(".attendDiv");
        if (attendanceDivs.length > 0) {
            // Stop observing once attendance divs are found
            obs.disconnect();
            // Run the function to calculate missed hours
            calculateMissedHours();
        }
    });

    // Start observing the body for changes (can also be a more specific container if known)
    observer.observe(document.body, { childList: true, subtree: true });

})();
