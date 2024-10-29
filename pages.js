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

    const user = await account.get();
    console.log(`"user id : ${user.$id}"`);

    // Fetch all friend relationships
    const response = await databases.listDocuments(
      "66f9e43e00253528c7a8",
      "66fc597e0027848acf57",
      [
        Appwrite.Query.equal('status', 'accepted'),
        Appwrite.Query.or([
          Appwrite.Query.equal('userId', user.$id),
          Appwrite.Query.equal('friendId', user.$id)
        ])
      ]
    );

    console.log(response.documents);
    const friendRelations = response.documents;
    const user_friendslist = new Set(); // Using Set to avoid duplicates

    // Process each friend relationship
    for (const relation of friendRelations) {
      // Determine which ID is the friend's ID
      const friendId = relation.userId === user.$id ? relation.friendId : relation.userId;

      if (!user_friendslist.has(friendId)) {
        user_friendslist.add(friendId);

        try {
          // Fetch friend's details
          const friendsResponse = await databases.listDocuments(
            "66f9e43e00253528c7a8",
            "66f9e45d002562334094",
            [Appwrite.Query.equal("accountId", friendId)]
          );

          const friends = friendsResponse.documents;
          console.log(friends);

          if (friends.length > 0) {
            const friend = friends[0];

            // Create friend list item
            const liElement = document.createElement("li");
            liElement.className = "list-item";
            liElement.setAttribute("data-friend-id", friendId);

            liElement.onclick = () => {
              window.location.href = `/displayDetails/friend.html?friendId=${friendId}`;
            };

            // Create content structure
            liElement.innerHTML = `
                          <div class="item-content">
                              <img class="avatar" 
                                   src="https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg" 
                                   alt="${friend.name}">
                              <div class="item-details">
                                  <p class="item-name">${friend.name}</p>
                                  <p class="item-subtitle">${friend.email}</p>
                              </div>
                              <span class="status-badge ${relation.status}">
                                  <span class="status-dot ${relation.status}"></span>
                                  ${relation.status}
                              </span>
                          </div>
                      `;

            friendsListContainer.appendChild(liElement);
          }
        } catch (error) {
          console.error("Failed to retrieve friend details:", error);
        }
      }
    }
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
          liElement.setAttribute("data-group-id", element.groupid);

          liElement.onclick = () => {
            window.location.href = `/displayDetails/group.html?groupId=${element.groupid}`;
          };

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