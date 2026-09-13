// =============================
// FIREBASE CONFIGURATION
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyAcVk2SwecMQRBmUUlJeq8F_pCrdQSBjaU",
  authDomain: "skillswap-campus-f4a80.firebaseapp.com",
  projectId: "skillswap-campus-f4a80",
  storageBucket: "skillswap-campus-f4a80.firebasestorage.app",
  messagingSenderId: "89220709647",
  appId: "1:89220709647:web:5e985ebc1073bd17c3d27a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase connected successfully!");


// =============================
// PROFILE CREATION
// =============================

// =================================
// PROFILE CREATION
// =================================

const skillForm = document.getElementById("skillForm");

skillForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value;
    const teachSkills = document.getElementById("teachSkills").value;
    const learnSkills = document.getElementById("learnSkills").value;
    const experience = document.getElementById("experience").value;
    const availability = document.getElementById("availability").value;

    const message = document.getElementById("profileMessage");

    // Check if student is logged in
    const user = auth.currentUser;

    if (!user) {
        message.innerHTML = `
            <div class="request-card">
                <h3>⚠️ Please Login First</h3>
                <p>You need to login before creating your profile.</p>
            </div>
        `;
        return;
    }

    try {

        // Save profile to Firestore
        await db.collection("users").doc(user.uid).set({

            name: name,
            email: user.email,
            teachSkills: teachSkills,
            learnSkills: learnSkills,
            experience: experience,
            availability: availability,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        message.innerHTML = `
            <div class="request-card">
                <h3>✅ Profile Saved Successfully!</h3>

                <p>Welcome, <strong>${name}</strong>! 👋</p>

                <p>
                    You can teach:
                    <strong>${teachSkills}</strong>
                </p>

                <p>
                    You want to learn:
                    <strong>${learnSkills}</strong>
                </p>

                <p>
                    Experience:
                    <strong>${experience}</strong>
                </p>

                <p>
                    Availability:
                    <strong>${availability}</strong>
                </p>
            </div>
        `;

        skillForm.reset();

    } catch (error) {

        console.error("Error saving profile:", error);

        message.innerHTML = `
            <div class="request-card">
                <h3>❌ Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }

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
// =============================
// FIREBASE AUTHENTICATION
// =============================

function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("authMessage");

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            message.textContent = "Account created successfully! 🎉";
        })
        .catch((error) => {
            message.textContent = error.message;
        });
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("authMessage");

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            message.textContent = "Login successful! 🎉";
        })
        .catch((error) => {
            message.textContent = error.message;
        });
}



