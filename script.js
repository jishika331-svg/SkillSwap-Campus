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

// Firebase App Check
const appCheck = firebase.appCheck();

appCheck.activate(
    new firebase.appCheck.ReCaptchaEnterpriseProvider(
        "6Le5EbktAAAAAKfORqPQj1X8k24Ah8BSD02-QLQs"
    ),
    true
);

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
      generateAIMatches();

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
// ==============================
// SAVE PROFILE TO FIRESTORE
// ==============================

document.getElementById("skillForm").addEventListener("submit", function () {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first!");
        return;
    }

    const name = document.getElementById("studentName").value;
    const teachSkills = document.getElementById("teachSkills").value;
    const learnSkills = document.getElementById("learnSkills").value;
    const experience = document.getElementById("experience").value;
    const availability = document.getElementById("availability").value;

    db.collection("users").doc(user.uid).set({
        name: name,
        email: user.email,
        teachSkills: teachSkills,
        learnSkills: learnSkills,
        experience: experience,
        availability: availability,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => {
        console.log("Profile saved to Firestore!");
        alert("Profile saved successfully! 🎉");
    })
    .catch((error) => {
        console.error("Error saving profile:", error);
        alert("Error saving profile: " + error.message);
    });

});
// =====================================
// GEMINI AI SKILL MATCHING
// =====================================

async function generateAIMatches() {

    const matchContainer = document.getElementById("matchContainer");

    const user = auth.currentUser;

    if (!user) {
        return;
    }

    if (!window.geminiModel) {
        matchContainer.innerHTML = `
            <p>🤖 Gemini is still loading. Please try again.</p>
        `;
        return;
    }

    try {

        matchContainer.innerHTML = `
            <p>🤖 Gemini AI is finding your best skill matches...</p>
        `;

        // Get current student's profile
        const currentUserDoc = await db
            .collection("users")
            .doc(user.uid)
            .get();

        if (!currentUserDoc.exists) {
            matchContainer.innerHTML = `
                <p>⚠️ Please create your skill profile first.</p>
            `;
            return;
        }

        const currentUser = currentUserDoc.data();

        // Get all other student profiles
        const snapshot = await db.collection("users").get();

        const students = [];

        snapshot.forEach((doc) => {

            if (doc.id !== user.uid) {

                const data = doc.data();

                students.push({
                    id: doc.id,
                    name: data.name || "Student",
                    teachSkills: data.teachSkills || "",
                    learnSkills: data.learnSkills || "",
                    experience: data.experience || "Beginner",
                    availability: data.availability || "Not specified"
                });

            }

        });

        if (students.length === 0) {

            matchContainer.innerHTML = `
                <p>👥 No other student profiles available yet.</p>
            `;

            return;
        }

        // Ask Gemini to find the best matches
        const prompt = `
You are the AI matching system for SkillSwap Campus.

Current student:
Name: ${currentUser.name}
Can teach: ${currentUser.teachSkills}
Wants to learn: ${currentUser.learnSkills}
Experience: ${currentUser.experience}
Availability: ${currentUser.availability}

Other students:
${JSON.stringify(students)}

Find the best skill-exchange matches.

A strong match happens when:
1. The other student can teach something the current student wants to learn.
2. The current student can teach something the other student wants to learn.
3. Consider semantic similarity, not only exact skill names.
4. Consider experience and availability when useful.

Return ONLY valid JSON in this exact format:

[
  {
    "studentId": "student id",
    "name": "student name",
    "matchScore": 95,
    "reason": "Short explanation of why they are a good skill exchange match."
  }
]

Return at most 5 matches.
Sort from highest match score to lowest.
Do not include markdown or code fences.
`;

        const result = await window.geminiModel.generateContent(prompt);

        const response = result.response;
        const text = response.text();

        console.log("Gemini response:", text);

        // Clean possible markdown formatting
        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const matches = JSON.parse(cleanedText);

        // Display AI matches
        matchContainer.innerHTML = "";

        matches.forEach((match) => {

            const student = students.find(
                (s) => s.id === match.studentId
            );

            if (!student) {
                return;
            }

            const card = document.createElement("div");

            card.className = "match-card";

            card.innerHTML = `
                <div class="student-avatar">
                    🤖
                </div>

                <div class="match-info">

                    <h3>${match.name}</h3>

                    <p>
                        <strong>Can teach:</strong>
                        ${student.teachSkills}
                    </p>

                    <p>
                        <strong>Wants to learn:</strong>
                        ${student.learnSkills}
                    </p>

                    <div class="match-score">
                        🎯 ${match.matchScore}% AI Match
                    </div>

                    <p>
                        🤖 <strong>Why:</strong>
                        ${match.reason}
                    </p>

                </div>

                <button onclick="sendRequest('${match.name}')">
                    Send Request
                </button>
            `;

            matchContainer.appendChild(card);

        });

    } catch (error) {

        console.error("Gemini matching error:", error);

        matchContainer.innerHTML = `
            <div class="request-card">
                <h3>❌ AI Matching Error</h3>
                <p>${error.message}</p>
            </div>
        `;

    }
}



