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
    const friendsListContainer = document.querySelector('ul[role="list"].max-w-sm');
    friendsListContainer.innerHTML = '';

    const user_1 = await account.get(); // Get current user
    console.log(`"user id : ${user_1.$id}"`);
    
    console.log("Updating Friends List");

    const response = await databases.listDocuments(
      "66f9e43e00253528c7a8", // Database ID
      "66fc597e0027848acf57", // Collection ID for 'FriendCollections'
      [Appwrite.Query.equal("userId", user_1.$id),
       Appwrite.Query.equal("status","accepted")
      ] // Query by current user's ID
    );

    // Log the retrieved data to the console
    console.log(response.documents);

    const resp = response.documents;
    user_friendslist = [];

    resp.forEach(async (element) => {
      // Ensure the friend list doesn't include the current user
      if (user_1.$id != element.friendId && user_friendslist.indexOf(element.friendId) == -1) {
        user_friendslist.push(element.friendId);
        
        try {
          const friendsResponse = await databases.listDocuments(
            "66f9e43e00253528c7a8", // Database ID
            "66f9e45d002562334094", // Collection ID for the 'users' collection
            [Appwrite.Query.equal("accountId", element.friendId)] // Query by accountId field
          );

          // Get the friend's details
          const friends = friendsResponse.documents;
          console.log(friends);

          // Continue with DOM manipulation and rendering
          if (friends.length > 0) {
          const liElement = document.createElement("li");
          liElement.className = "py-3 sm:py-4";
            liElement.setAttribute("data-friend-id", element.friendId); // Add a data attribute for friend ID

          const flexDiv = document.createElement("div");
          flexDiv.className = "flex items-center space-x-3 rtl:space-x-reverse";

          const imgDiv = document.createElement("div");
          imgDiv.className = "flex-shrink-0";

          const imgElement = document.createElement("img");
          imgElement.className = "w-8 h-8 rounded-full";
          imgElement.src = "https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg";
          imgElement.alt = friends[0].name;

          imgDiv.appendChild(imgElement);

          const contentDiv = document.createElement("div");
          contentDiv.className = "flex-1 min-w-0";

          const nameParagraph = document.createElement("p");
          nameParagraph.className = "text-sm font-semibold text-white truncate dark:text-white";
          nameParagraph.textContent = friends[0].name;

          const emailParagraph = document.createElement("p");
          emailParagraph.className = "text-sm text-gray-400 truncate dark:text-gray-400";
          emailParagraph.textContent = friends[0].email;

          contentDiv.appendChild(nameParagraph);
          contentDiv.appendChild(emailParagraph);

          const availabilitySpan = document.createElement("span");
          const dotSpan = document.createElement("span");

          if (element.status == "accepted") {
            availabilitySpan.className =
              "inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300";
            dotSpan.className = "w-2 h-2 me-1 bg-green-500 rounded-full";
          } else {
            availabilitySpan.className =
              "inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300";
            dotSpan.className = "w-2 h-2 me-1 bg-red-500 rounded-full";
          }

          availabilitySpan.appendChild(dotSpan);
          availabilitySpan.appendChild(document.createTextNode(element.status));

          flexDiv.appendChild(imgDiv);
          flexDiv.appendChild(contentDiv);
          flexDiv.appendChild(availabilitySpan);

          liElement.appendChild(flexDiv);
          document.querySelector("ul").appendChild(liElement);

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
// Clear the existing list
      const groupsListContainer = document.querySelector('ul[role="list"].max-w-sm');
      groupsListContainer.innerHTML = '';

      console.log("Updating Groups List");
    const response = await databases.listDocuments(
          "66f9e43e00253528c7a8", // Database ID
          "66ffef8e000e9a26e8bf", // Collection ID for 'Group Members'
          [Appwrite.Query.equal("memberId", "66fc9df006e60a5356bc")] // Replace with the current user ID if available
    );

    // Log the retrieved data to the console
    console.log(response.documents);
      const resp = response.documents;

    resp.forEach(async (element) => {
      // console.log(element.groupid);

      // 66fc9df006e60a5356bc

      try {
              const groupResponse = await databases.listDocuments(
                  "66f9e43e00253528c7a8", // Database ID
                  "66ffed4e001b7299c97c", // Collection ID for the 'Groups' collection
          [Appwrite.Query.equal("$id", element.groupid)]
        );

              const groups = groupResponse.documents;
              console.log(groups);

              if (groups.length > 0) {
                  // Create <li> element for each group
        const liElement = document.createElement("li");
        liElement.className = "py-3 sm:py-4";

        // Create div for flex container
        const flexDiv = document.createElement("div");
        flexDiv.className = "flex items-center space-x-3 rtl:space-x-reverse";

        // Create the image container
        const imgDiv = document.createElement("div");
        imgDiv.className = "flex-shrink-0";

        // Create the image element
        const imgElement = document.createElement("img");
        imgElement.className = "w-8 h-8 rounded-full";
                  imgElement.src = "https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg";
                  imgElement.alt = groups[0]["groupName"];

        // Append the image to its container
        // imgDiv.appendChild(imgElement);

        // Create the flex-1 container for name and email
        const contentDiv = document.createElement("div");
        contentDiv.className = "flex-1 min-w-0";

        // Create <p> for name
        const nameParagraph = document.createElement("p");
                  nameParagraph.className = "text-sm font-semibold text-white truncate";
                  nameParagraph.textContent = groups[0]["groupName"];

        // Create <p> for email
        const emailParagraph = document.createElement("p");
        emailParagraph.className =
          "text-sm text-gray-400 truncate dark:text-gray-400";
        emailParagraph.textContent = friends[0].email;

        // Append name and email to the content container
        contentDiv.appendChild(nameParagraph);
        contentDiv.appendChild(emailParagraph);

        // Create span for the availability status
        const availabilitySpan = document.createElement("span");
        const dotSpan = document.createElement("span");

        // if(element.status=="accepted"){
        // availabilitySpan.className = 'inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300';
        // dotSpan.className = 'w-2 h-2 me-1 bg-green-500 rounded-full';

        // }
        // else{
        // availabilitySpan.className = 'inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300';
        // dotSpan.className = 'w-2 h-2 me-1 bg-red-500 rounded-full';
        // }

        // Create inner span for the dot

        //w-2 h-2 me-1 bg-red-500 rounded-full

        // Set availability text

        const availabilityText = document.createTextNode(element.status);

        // Append the dot and text to the availability span
        availabilitySpan.appendChild(dotSpan);
        // availabilitySpan.appendChild(availabilityText);

        // Append all elements to the flex container
        flexDiv.appendChild(imgDiv);
        flexDiv.appendChild(contentDiv);

        // Append flexDiv to the <li> element
        liElement.appendChild(flexDiv);

                  // Append the list item to the groups list container
                  groupsListContainer.appendChild(liElement);
              } else {
                  console.warn("No details found for groupId:", element.groupid);
              }
      } catch (error) {
              console.error("Failed to retrieve group details:", error);
      }
    });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
  }
};
