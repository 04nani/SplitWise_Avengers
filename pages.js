var user_friendslist = [];

console.log(client);

const databases = new Appwrite.Databases(client);

// Function to update the friends list
function updateFriendsList() {
  console.log("Updating Friends List");
  getFriendsData(); 
}

// Function to update the groups list
function updateGroupsList() {
  console.log("Updating Groups List");
  getGroups(); 
}


const getFriendsData = async () => {
  try {
    const friendsListContainer = document.querySelector('ul[role="list"]');
    friendsListContainer.innerHTML = '';

    const user_1 = await account.get();
    console.log(`"user id : ${user_1.$id}"`);
    
    const response = await databases.listDocuments(
      "66f9e43e00253528c7a8",
      "66fc597e0027848acf57",
      [Appwrite.Query.equal("userId", user_1.$id),
       Appwrite.Query.equal("status", "accepted")]
    );

    console.log(response.documents);
    const resp = response.documents;
    user_friendslist = [];

    resp.forEach(async (element) => {
      if (user_1.$id != element.friendId && user_friendslist.indexOf(element.friendId) == -1) {
        user_friendslist.push(element.friendId);
        
        try {
          const friendsResponse = await databases.listDocuments(
            "66f9e43e00253528c7a8",
            "66f9e45d002562334094",
            [Appwrite.Query.equal("accountId", element.friendId)]
          );

          const friends = friendsResponse.documents;
          console.log(friends);

          if (friends.length > 0) {
            const liElement = document.createElement("li");
            liElement.className = "list-item";
            liElement.setAttribute("data-friend-id", element.friendId);

            const contentDiv = document.createElement("div");
            contentDiv.className = "item-content";

            const imgElement = document.createElement("img");
            imgElement.className = "avatar";
            imgElement.src = "https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg";
            imgElement.alt = friends[0].name;

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "item-details";

            const nameParagraph = document.createElement("p");
            nameParagraph.className = "item-name";
            nameParagraph.textContent = friends[0].name;

            const emailParagraph = document.createElement("p");
            emailParagraph.className = "item-subtitle";
            emailParagraph.textContent = friends[0].email;

            detailsDiv.appendChild(nameParagraph);
            detailsDiv.appendChild(emailParagraph);

            const statusBadge = document.createElement("span");
            const statusDot = document.createElement("span");

            if (element.status == "accepted") {
              statusBadge.className = "status-badge accepted";
              statusDot.className = "status-dot accepted";
            } else {
              statusBadge.className = "status-badge pending";
              statusDot.className = "status-dot pending";
            }

            statusBadge.appendChild(statusDot);
            statusBadge.appendChild(document.createTextNode(element.status));

            contentDiv.appendChild(imgElement);
            contentDiv.appendChild(detailsDiv);
            contentDiv.appendChild(statusBadge);

            liElement.appendChild(contentDiv);
            friendsListContainer.appendChild(liElement);
          }
        } catch (error) {
          console.error("Failed to retrieve friend details:", error);
        }
      }
    });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
  }
};

const getGroups = async () => {
  try {
    const groupsListContainer = document.querySelector('ul[role="list"]');
    groupsListContainer.innerHTML = '';

    console.log("Updating Groups List");
    const response = await databases.listDocuments(
      "66f9e43e00253528c7a8",
      "66ffef8e000e9a26e8bf",
      [Appwrite.Query.equal("memberId", "66fc9df006e60a5356bc")]
    );

    console.log(response.documents);
    const resp = response.documents;

    resp.forEach(async (element) => {
      try {
        const groupResponse = await databases.listDocuments(
          "66f9e43e00253528c7a8",
          "66ffed4e001b7299c97c",
          [Appwrite.Query.equal("$id", element.groupid)]
        );

        const groups = groupResponse.documents;
        console.log(groups);

        if (groups.length > 0) {
          const liElement = document.createElement("li");
          liElement.className = "list-item";

          const contentDiv = document.createElement("div");
          contentDiv.className = "item-content";

          const imgElement = document.createElement("img");
          imgElement.className = "avatar";
          imgElement.src = "https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg";
          imgElement.alt = groups[0]["groupName"];

          const detailsDiv = document.createElement("div");
          detailsDiv.className = "item-details";

          const nameParagraph = document.createElement("p");
          nameParagraph.className = "item-name";
          nameParagraph.textContent = groups[0]["groupName"];

          detailsDiv.appendChild(nameParagraph);

          contentDiv.appendChild(imgElement);
          contentDiv.appendChild(detailsDiv);

          liElement.appendChild(contentDiv);
          groupsListContainer.appendChild(liElement);
        }
      } catch (error) {
        console.error("Failed to retrieve group details:", error);
      }
    });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
  }
};