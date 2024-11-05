// Function to update the action button icon and functionality
function updateActionButton(page) {
    const actionIcon = document.getElementById("action-icon");

    if (page === "friends") {
        actionIcon.className = "fas fa-user-plus"; // Add Friend Icon
        document.querySelector(".action-button").onclick = redirectToFriends;
    } else if (page === "groups") {
        actionIcon.className = "fas fa-users"; // Add Group Icon
        document.querySelector(".action-button").onclick = redirectToAddGroup;
    }
}

// Function to handle the action based on the page
function handleAction() {
    const title = document.querySelector(".title").innerText;
    if (title.includes("Friends")) {
        redirectToFriends();
    } else if (title.includes("Groups")) {
        redirectToAddGroup();
    }
}

// Function to redirect to Add Group
function redirectToAddGroup() {
    window.location.href = 'Group.html'; // Change this to the path for Add Group
}

// Function to update friends or groups list based on navigation
function navigate(page) {
    const listContainer = document.querySelector('ul[role="list"].max-w-sm');
    listContainer.innerHTML = ''; 
    if (page === "friends") {
        document.querySelector(".title").innerText = "Friends List";
        document.getElementById("friends").classList.add("active");
        document.getElementById("groups").classList.remove("active");
        updateFriendsList(); // Custom function to update friends list
    } else if (page === "groups") {
        document.querySelector(".title").innerText = "Groups List";
        document.getElementById("groups").classList.add("active");
        document.getElementById("friends").classList.remove("active");
        updateGroupsList(); // Custom function to update groups list
    }
    updateActionButton(page);
}

// Initialize the page with friends list on load
document.addEventListener("DOMContentLoaded", function() {
    navigate("friends");
});