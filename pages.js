var user_friendslist = [];

const DATABASE_ID = "66f9e43e00253528c7a8";
const ACTIVITIES_COLLECTION_ID = "6702c39100338b173d15";
const GROUP_MEMBERS_COLLECTION_ID = "66ffef8e000e9a26e8bf";
const GROUPS_COLLECTION_ID = "66ffed4e001b7299c97c";
const FRIENDS_COLLECTION_ID = "66fc597e0027848acf57";
const USERS_COLLECTION_ID = "66f9e45d002562334094";

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
      DATABASE_ID,
      FRIENDS_COLLECTION_ID,
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
            DATABASE_ID,
            USERS_COLLECTION_ID,
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

            const expenses = await fetchExpenses(user.$id, friendId);
            const balance = await calculateBalance(expenses, user.$id, friendId);

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
                              <div class="balance-container">
                                  <span class="balance ${balance <= 0 ? 'positive' : 'negative'}">${balance < 0 ? "you owe" : "owes you"}</span>
                                  <span class="balance ${balance <= 0 ? 'positive' : 'negative'}">${balance < 0 ? Math.abs(balance).toFixed(2) : balance.toFixed(2)}</span>
                              </div>
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

    const user = await account.get();

    console.log("Updating Groups List");
    const response = await databases.listDocuments(
      DATABASE_ID,
      GROUP_MEMBERS_COLLECTION_ID,
      [Appwrite.Query.equal("memberId", user.$id)]
    );

    console.log(response.documents);
    const resp = response.documents;

    resp.forEach(async (element) => {
      try {
        const groupResponse = await databases.listDocuments(
          DATABASE_ID,
          GROUPS_COLLECTION_ID,
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

async function fetchExpenses(currentUserId, friendId) {
  try {
      const response = await databases.listDocuments(
          DATABASE_ID,
          ACTIVITIES_COLLECTION_ID,
          [
              Appwrite.Query.or([
                  Appwrite.Query.and([
                      Appwrite.Query.equal('paidById', currentUserId),
                      Appwrite.Query.contains('splitMembers', friendId)
                  ]),
                  Appwrite.Query.and([
                      Appwrite.Query.equal('paidById', friendId),
                      Appwrite.Query.contains('splitMembers', currentUserId)
                  ])
              ]),
              Appwrite.Query.orderDesc('$createdAt')
          ]
      );
      return response.documents;
  } catch (error) {
      console.error('Error fetching expenses:', error);
      showError('Failed to load expenses');
      return [];
  }
}

async function calculateBalance(expenses, currentUserId, friendId) {
  let totalBalance = 0;
  expenses.forEach(expense => {
    const isPayee = expense.paidById === currentUserId;

    const splits = (expense.splitMembers || "").split('##').map(split => {
        const [id, amount] = split.split('$$');
        return { id: id, amount: parseFloat(amount) };
    });

    console.log(splits);

    // Update total balance
    const split = splits.find(split => split.id === friendId);
    const splitAmount = split ? split.amount : 0;
    if (isPayee) {
        totalBalance -= splitAmount;
    } else {
        totalBalance += splitAmount;
    }
  });
  return totalBalance;
}