// =================================
// PROFILE CREATION
// =================================

const skillForm = document.getElementById("skillForm");

skillForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("studentName").value;

    const teachSkills =
        document.getElementById("teachSkills").value;

    const learnSkills =
        document.getElementById("learnSkills").value;

    const experience =
        document.getElementById("experience").value;

    const availability =
        document.getElementById("availability").value;


    const message =
        document.getElementById("profileMessage");


    message.innerHTML = `
        <div class="request-card">

            ✅ Profile created successfully!

            <br><br>

            Welcome, <strong>${name}</strong>! 👋

            <br>

            You can teach:
            <strong>${teachSkills}</strong>

            <br>

            You want to learn:
            <strong>${learnSkills}</strong>

            <br>

            Experience:
            <strong>${experience}</strong>

            <br>

            Availability:
            <strong>${availability}</strong>

        </div>
    `;

});


// =================================
// SCROLL TO PROFILE
// =================================

function showProfile() {

    document
        .getElementById("profile")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// =================================
// SEND SKILL EXCHANGE REQUEST
// =================================

function sendRequest(studentName) {

    const requestMessage =
        document.getElementById("requestMessage");


    requestMessage.innerHTML = `
        <div class="request-card">

            <h3>📩 Request Sent!</h3>

            <p>
                Your skill exchange request has been
                sent to <strong>${studentName}</strong>.
            </p>

            <p>
                Waiting for them to accept your request...
            </p>

        </div>
    `;

}
