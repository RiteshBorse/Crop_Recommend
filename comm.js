document.addEventListener("DOMContentLoaded", function () {
    const jobDetailsPopup = document.getElementById("jobDetailsPopup");
    const chatPopup = document.getElementById("chatPopup");
    const farmersPopup = document.getElementById("farmersPopup");
    const body = document.body;

    const overlay = document.createElement("div");
    overlay.id = "overlay";
    body.appendChild(overlay);

    function openPopup(popup) {
        popup.style.display = "block";
        setTimeout(() => {
            popup.classList.add("show");
        }, 10);
        body.classList.add("blurred");
        overlay.style.display = "block";
    }

    function closePopup(popup) {
        popup.classList.remove("show");
        setTimeout(() => {
            popup.style.display = "none";
        }, 300);
        body.classList.remove("blurred");
        overlay.style.display = "none";
    }

    // Job Details Popup
    const viewDetailsButtons = document.querySelectorAll(".view-details-btn");
    viewDetailsButtons.forEach(button => {
        button.addEventListener("click", () => {
            const jobListing = button.closest('.job-listing');
            const jobTitle = jobListing.querySelector('h3').textContent;
            const jobLocation = jobListing.querySelectorAll('p')[0].textContent.replace('Location: ', '');
            const jobWages = jobListing.querySelectorAll('p')[1].textContent.replace('Wages: ', '');
            const jobDescription = jobListing.dataset.description;
            const jobWorkingHours = jobListing.dataset.workingHours;
            const jobTotalWages = jobListing.dataset.totalWages;

            document.getElementById('jobTitle').textContent = jobTitle;
            document.getElementById('jobLocation').textContent = jobLocation;
            document.getElementById('jobWages').textContent = jobWages;
            document.getElementById('jobDescription').textContent = jobDescription;
            document.getElementById('jobWorkingHours').textContent = jobWorkingHours;
            document.getElementById('jobTotalWages').textContent = jobTotalWages;

            openPopup(jobDetailsPopup);
        });
    });

    // Chat Popup
    const viewForumButton = document.getElementById("viewForumButton"); // Use ID if possible!
    if (viewForumButton) { // Check if the element exists
        viewForumButton.addEventListener("click", (event) => {
            event.preventDefault();
            openPopup(chatPopup);
        });
    } else {
        console.error("View Forum button not found. Check your HTML.");
    }



    // Farmers Popup
    const findFarmersButton = document.getElementById("findFarmersButton");  // Use ID if possible!
    if (findFarmersButton) { // Check if the element exists
        findFarmersButton.addEventListener("click", (event) => {
            event.preventDefault();
            openPopup(farmersPopup);
            populateFarmers(farmersPopup);
        });
    } else {
        console.error("Find Farmers button not found. Check your HTML.");
    }

    // Close Popups (using overlay - Corrected)
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closePopup(jobDetailsPopup);
            closePopup(chatPopup);
            closePopup(farmersPopup);
        }
    });

    const closeJobPopup = jobDetailsPopup.querySelector(".close-popup");
    if(closeJobPopup){
        closeJobPopup.addEventListener("click", () => closePopup(jobDetailsPopup));
    }

    const closeChatPopup = chatPopup.querySelector(".close-popup");
    if(closeChatPopup){
        closeChatPopup.addEventListener("click", () => closePopup(chatPopup));
    }

    const closeFarmersPopup = farmersPopup.querySelector(".close-popup");
    if(closeFarmersPopup){
        closeFarmersPopup.addEventListener("click", () => closePopup(farmersPopup));
    }



    // Chat functionality
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = chatPopup.querySelector(".send-btn");
    const chatMessages = document.getElementById("chatMessages");

    if(sendMessageButton){
        sendMessageButton.addEventListener("click", sendMessage);
    }
    if(chatInput){
        chatInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }


    function sendMessage() {
        if(!chatInput || !chatMessages){
            return;
        }
        const messageText = chatInput.value.trim();
        if (messageText !== "") {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("chat-message");
            messageDiv.textContent = messageText;
            chatMessages.appendChild(messageDiv);
            chatInput.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function populateFarmers(popup) {
        const farmerProfilesContainer = popup.querySelector('.farmer-profiles');
        if(!farmerProfilesContainer){
            return;
        }
        farmerProfilesContainer.innerHTML = '';

        const farmers = [
            { name: "Sharad Patil", location: "Nashik", specialty: "Tomatoes, Onions", image: "Bhupendra Jogi.png" },
            { name: "Vikas Rathod", location: "Pune", specialty: "Rice, Wheat", image: "Bhupendra Jogi.png" },
            // ... more farmers
        ];

        farmers.forEach(farmer => {
            const profileDiv = document.createElement('div');
            profileDiv.classList.add('farmer-profile');
            profileDiv.innerHTML = `
                <img src="${farmer.image}" alt="${farmer.name}">
                <h4>${farmer.name}</h4>
                <p>Location: ${farmer.location}</p>
                <p>Specialty: ${farmer.specialty}</p>
                <button class="connect-btn">Connect</button>
            `;
            farmerProfilesContainer.appendChild(profileDiv);

            const connectButton = profileDiv.querySelector('.connect-btn');
            connectButton.addEventListener('click', () => {
                console.log(`Connecting with ${farmer.name}`);
                // Add your connect logic here (e.g., sending a request)
            });
        });
    }
});