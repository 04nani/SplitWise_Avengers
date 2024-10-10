var user_friendslist = [];

console.log(client);

const databases = new Appwrite.Databases(client);

const getFriendsData = async () => {
  try {
    const response = await databases.listDocuments(
      "66ffed4e001b7299c97c", // Replace with your database ID
      "66fc597e0027848acf57" // Collection ID for 'FriendCollections'
    );

    const user_1 = await account.get();
    console.log(`"user id : ${user_1.$id}"`);

    // Log the retrieved data to the console
    console.log(response.documents);

    var resp = response.documents;

    user_friendslist = [];

    resp.forEach(async (element) => {
      if (userid != element.friendId) {
        if (user_friendslist.indexOf(element.friendId) == -1) {
          user_friendslist.push(element.friendId);
          try {
            const response = await databases.listDocuments(
              "66f9e43e00253528c7a8", // Replace with your database ID
              "66f9e45d002562334094", // Collection ID for the 'users' collection
              [Appwrite.Query.equal("accountId", element.friendId)] // Query by accountId field
            );

            // Loop through the friend list and get each friend's details
            const friends = response.documents;

            console.log(friends);

            // Create <li> element with class
            const liElement = document.createElement("li");
            liElement.className = "py-3 sm:py-4";

            // Create div for flex container
            const flexDiv = document.createElement("div");
            flexDiv.className =
              "flex items-center space-x-3 rtl:space-x-reverse";

            // Create the image container
            const imgDiv = document.createElement("div");
            imgDiv.className = "flex-shrink-0";

            // Create the image element
            const imgElement = document.createElement("img");
            imgElement.className = "w-8 h-8 rounded-full";
            imgElement.src =
              "https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg";
            imgElement.alt = friends[0].name;

            // Append the image to its container
            imgDiv.appendChild(imgElement);

            // Create the flex-1 container for name and email
            const contentDiv = document.createElement("div");
            contentDiv.className = "flex-1 min-w-0";

            // Create <p> for name
            const nameParagraph = document.createElement("p");
            nameParagraph.className =
              "text-sm font-semibold text-gray-900 truncate dark:text-white";
            nameParagraph.textContent = friends[0].name;

            // Create <p> for email
            const emailParagraph = document.createElement("p");
            emailParagraph.className =
              "text-sm text-gray-500 truncate dark:text-gray-400";
            emailParagraph.textContent = friends[0].email;

            // Append name and email to the content container
            contentDiv.appendChild(nameParagraph);
            contentDiv.appendChild(emailParagraph);

            // Create span for the availability status
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

            // Create inner span for the dot

            //w-2 h-2 me-1 bg-red-500 rounded-full

            // Set availability text

            const availabilityText = document.createTextNode(element.status);

            // Append the dot and text to the availability span
            availabilitySpan.appendChild(dotSpan);
            availabilitySpan.appendChild(availabilityText);

            // Append all elements to the flex container
            flexDiv.appendChild(imgDiv);
            flexDiv.appendChild(contentDiv);
            flexDiv.appendChild(availabilitySpan);

            // Append flexDiv to the <li> element
            liElement.appendChild(flexDiv);

            // Append <li> to an existing <ul> or <ol> element
            document.querySelector("ul").appendChild(liElement);
          } catch (error) {
            console.error("Failed to retrieve data:", error);
          }
        } else {
          console.log("GAPS ");
        }

        ///// cuter
      } else {
      }
      console.log(element);

      // 66fc9df006e60a5356bc
    });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
  }
};

const getGroups = async () => {
  try {
    const response = await databases.listDocuments(
      "66f9e43e00253528c7a8", // Replace with your database ID
      "66ffef8e000e9a26e8bf", // Collection ID for 'FriendCollections'
      // Appwrite.Query.equal('$id', element.groupid),      // Filter by document ID
      [Appwrite.Query.equal("memberId", userid)]
    );

    // Log the retrieved data to the console
    console.log(response.documents);

    var resp = response.documents;

    resp.forEach(async (element) => {
      // console.log(element.groupid);

      // 66fc9df006e60a5356bc

      try {
        const response = await databases.listDocuments(
          "66f9e43e00253528c7a8", // Replace with your database ID
          "66ffed4e001b7299c97c", // Collection ID for the 'users' collection

          [Appwrite.Query.equal("$id", element.groupid)]
        );

        // Loop through the friend list and get each friend's details
        const friends = response.documents;

        // console.log(friends);

        // console.log()

        // Create <li> element with class
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
        imgElement.src =
          "https://img.freepik.com/premium-vector/man-male-young-person-icon_24877-30218.jpg";
        imgElement.alt = friends[0]["groupName"];

        // Append the image to its container
        // imgDiv.appendChild(imgElement);

        // Create the flex-1 container for name and email
        const contentDiv = document.createElement("div");
        contentDiv.className = "flex-1 min-w-0";

        // Create <p> for name
        const nameParagraph = document.createElement("p");
        nameParagraph.className =
          "text-sm font-semibold text-gray-900 truncate dark:text-white";
        nameParagraph.textContent = friends[0]["groupName"];

        // Create <p> for email
        const emailParagraph = document.createElement("p");
        emailParagraph.className =
          "text-sm text-gray-500 truncate dark:text-gray-400";
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
        flexDiv.appendChild(availabilitySpan);

        // Append flexDiv to the <li> element
        liElement.appendChild(flexDiv);

        // Append <li> to an existing <ul> or <ol> element
        document.querySelector("ul").appendChild(liElement);
      } catch (error) {
        console.error("Failed to retrieve data:", error);
      }
    });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
  }
};
