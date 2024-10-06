// Appwrite configuration
const client = new Appwrite.Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66f9c641001dbbd4bb66');

const databases = new Appwrite.Databases(client);
const account = new Appwrite.Account(client);

const DATABASE_ID = "66f9e43e00253528c7a8";
const FRIENDS_COLLECTION_ID = "66fc597e0027848acf57";
const USERS_COLLECTION_ID = "66f9e45d002562334094";
const ACTIVITIES_COLLECTION_ID = "6702c39100338b173d15";
const GROUP_MEMBERS_COLLECTION_ID = "66ffef8e000e9a26e8bf";
const TRANSACTION_COLLECTION_ID = "6702d327003c89118e37";
const CATEGORY_COLLECTION_ID = "66fc56ec0001a77931b0";

let allFriends = [];
let selectedFriends = [];
let splits = {};
let categories = [];
let selectedCategoryId = null;

// DOM elements
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const payerSelect = document.getElementById('payer');
const friendSearchInput = document.getElementById('friendSearch');
const friendList = document.getElementById('friendList');
const selectedFriendsContainer = document.getElementById('selectedFriends');
const splitMethodSelect = document.getElementById('splitMethod');
const splitInputsContainer = document.getElementById('splitInputs');
const form = document.getElementById('expenseForm');
const categoryInput = document.getElementById('categoryInput');
const categoryList = document.getElementById('categoryList');

async function fetchCategories() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const isGroup = urlParams.get('isGroup');
        const isFriend = urlParams.get('isFriend');
        const groupId = urlParams.get('groupId');

        let query = [];

        if (isGroup === 'false' && isFriend === 'true') {
            const user = await account.get();
            query.push(Appwrite.Query.equal("creatorId", user.$id));
        } else if (isGroup === 'true' && isFriend === 'false' && groupId !== null) {
            query.push(Appwrite.Query.equal("groupId", groupId));
        } else {
            throw new Error('Invalid URL parameters');
        }

        const response = await databases.listDocuments(DATABASE_ID, CATEGORY_COLLECTION_ID, query);
        categories = response.documents;
        console.log('Categories fetched:', categories);
        setupCategoryAutocomplete();
    } catch (error) {
        console.error('Error fetching categories:', error);
        categories = [];
        categoryInput.disabled = true;
        categoryInput.placeholder = 'Categories unavailable';
    }
}

function setupCategoryAutocomplete() {
    categoryInput.addEventListener('input', filterCategories);
    categoryInput.addEventListener('focus', () => displayCategoryList(categories));
    document.addEventListener('click', (e) => {
        if (!categoryInput.contains(e.target) && !categoryList.contains(e.target)) {
            hideCategoryList();
        }
    });
}

function filterCategories() {
    const searchTerm = categoryInput.value.toLowerCase();
    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm)
    );
    displayCategoryList(filteredCategories);
}

function displayCategoryList(categoriesToShow) {
    categoryList.innerHTML = '';
    if (categoriesToShow.length === 0) {
        hideCategoryList();
        return;
    }
    categoriesToShow.forEach(category => {
        console.log(category);
        const li = document.createElement('li');
        li.textContent = category.categoryName;
        li.addEventListener('click', () => selectCategory(category));
        categoryList.appendChild(li);
    });
    categoryList.style.display = 'block';
}


function selectCategory(category) {
    categoryInput.value = category.categoryName;
    selectedCategoryId = category.$id;
    hideCategoryList();
}

function hideCategoryList() {
    categoryList.style.display = 'none';
}

async function fetchFriendsDetails(friends) {
    try {
        const friendIds = friends.map(friend => friend.friendId);
        const response = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
            Appwrite.Query.equal("accountId", friendIds)
        ]);
        return response.documents;
    } catch (error) {
        console.error('Error fetching friends:', error);
    }
}

async function fetchGroupMembersDetails(groupMembers) {
    try {
        const memberIds = groupMembers.map(member => member.memberId);
        const response = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
            Appwrite.Query.equal("accountId", memberIds)
        ]);
        return response.documents;
    } catch (error) {
        console.error('Error fetching group members:', error);
    }
}

async function fetchFriends() {
    try {
        // get the url perameters
        const urlParams = new URLSearchParams(window.location.search);
        const isGroup = urlParams.get('isGroup');
        const isFriend = urlParams.get('isFriend');
        const groupId = urlParams.get('groupId');

        // Get the current user
        const user = await account.get();
        const currentUserId = user.$id;

        if (isGroup === 'false' && isFriend === 'true') {
            // Fetch friends
            const response = await databases.listDocuments(DATABASE_ID, FRIENDS_COLLECTION_ID, [
                Appwrite.Query.equal('userId', currentUserId),
                Appwrite.Query.equal('status', 'accepted')
            ]);

            const friends = await fetchFriendsDetails(response.documents);

            allFriends = friends.map(friend => ({ accountId: friend.accountId, name: friend.name }));
            allFriends.push({ accountId: currentUserId, name: user.name });

        } else if (isGroup === 'true' && isFriend === 'false' && groupId !== null) {
            // Fetch group members
            const groupId = urlParams.get('groupId');
            const response = await databases.listDocuments(DATABASE_ID, GROUP_MEMBERS_COLLECTION_ID, [
                Appwrite.Query.equal('groupid', groupId)
            ]);

            const groupMembers = await fetchGroupMembersDetails(response.documents);

            allFriends = groupMembers.map(member => ({ accountId: member.accountId, name: member.name }));

        } else {
            alert('Invalid URL parameters. Please try again.');
            window.location.href = '/'
        }

        // Populate payer dropdown
        populatePayerDropdown();
    } catch (error) {
        console.error('Error fetching friends:', error);
    }
}

function populatePayerDropdown() {
    payerSelect.innerHTML = '<option value="">Select payer</option>';
    allFriends.forEach(friend => {
        const option = document.createElement('option');
        option.value = friend.accountId;
        option.textContent = friend.name;
        payerSelect.appendChild(option);
    });
}

friendSearchInput.addEventListener('input', () => {
    const searchTerm = friendSearchInput.value.toLowerCase();
    const filteredFriends = allFriends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm) &&
        !selectedFriends.some(selected => selected.accountId === friend.accountId)
    );
    friendList.innerHTML = '';
    filteredFriends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.textContent = friend.name;
        friendItem.addEventListener('click', () => addFriend(friend));
        friendList.appendChild(friendItem);
    });
    friendList.style.display = filteredFriends.length > 0 ? 'block' : 'none';
});

function addFriend(friend) {
    selectedFriends.push(friend);
    friendSearchInput.value = '';
    friendList.style.display = 'none';
    updateSelectedFriends();
    updateSplits();
}

function removeFriend(friendId) {
    selectedFriends = selectedFriends.filter(f => f.accountId !== friendId);
    delete splits[friendId];
    updateSelectedFriends();
    updateSplits();
}

function updateSelectedFriends() {
    selectedFriendsContainer.innerHTML = '';
    selectedFriends.forEach(friend => {
        const chip = document.createElement('div');
        chip.className = 'friend-chip';
        chip.innerHTML = `
    ${friend.name}
    <button type="button" onclick="removeFriend('${friend.accountId}')">&times;</button>
`;
        selectedFriendsContainer.appendChild(chip);
    });
}

function updateSplits() {
    const amount = parseFloat(amountInput.value) || 0;
    const splitMethod = splitMethodSelect.value;
    const numFriends = selectedFriends.length;

    if (numFriends === 0) {
        splitInputsContainer.innerHTML = '';
        return;
    }

    splits = {};
    selectedFriends.forEach(friend => {
        switch (splitMethod) {
            case 'equal':
                splits[friend.accountId] = (amount / numFriends).toFixed(2);
                break;
            case 'percentages':
                splits[friend.accountId] = splits[friend.accountId] || (100 / numFriends).toFixed(2);
                break;
            case 'shares':
                splits[friend.accountId] = splits[friend.accountId] || '1';
                break;
            case 'exact':
                splits[friend.accountId] = splits[friend.accountId] || (amount / numFriends).toFixed(2);
                break;
        }
    });

    renderSplitInputs();
}

function renderSplitInputs() {
    splitInputsContainer.innerHTML = '';
    selectedFriends.forEach(friend => {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'split-input';
        inputContainer.innerHTML = `
    <span>${friend.name}</span>
    <input type="${splitMethodSelect.value === 'percentages' ? 'number' : 'text'}"
           value="${splits[friend.accountId]}"
           onchange="handleSplitChange('${friend.accountId}', this.value)"
           placeholder="${splitMethodSelect.value === 'percentages' ? 'Percentage' : splitMethodSelect.value === 'shares' ? 'Shares' : 'Amount'}">
    ${splitMethodSelect.value === 'percentages' ? '<span>%</span>' : ''}
`;
        splitInputsContainer.appendChild(inputContainer);
    });
}

function handleSplitChange(friendId, value) {
    splits[friendId] = value;
}

async function performTransaction(activityId, payer, splits) {
    try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('groupId');

        for (const friendId of Object.keys(splits)) {
            // Create transaction object
            const transactionData = {
                payerId: payer,
                receiverId: friendId,
                amount: parseFloat(splits[friendId]),
                time: new Date().toISOString(),
                status: 'pending',
                groupId: groupId,
                activityId: activityId
            };

            // Create transaction
            const response = await databases.createDocument(
                DATABASE_ID,
                TRANSACTION_COLLECTION_ID,
                Appwrite.ID.unique(),
                transactionData
            );
            console.log('Transaction created:', response);
        }

        console.log('All transactions created successfully');
    } catch (error) {
        console.error('Error performing transaction:', error);
    }
}

async function sendDataToDatabase(formData) {
    // get the url perameters
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('groupId');

    try {
        formData.splitMembers = Object.entries(formData.splits).map(([key, value]) => `${key}$$${value}`).join('##');
        const dbData = {
            description: formData.description,
            paidById: formData.payer,
            groupId: groupId,
            time: new Date(formData.date).toISOString(),
            amount: parseFloat(formData.amount),
            splitMembers: formData.splitMembers,
            user_involvement: true,
            expense_category: formData.categoryId
        };
        const response = await databases.createDocument(DATABASE_ID, ACTIVITIES_COLLECTION_ID, Appwrite.ID.unique(), dbData);

        // Perform transaction
        await performTransaction(
            activityId = response.$id,
            payer = formData.payer,
            splits = formData.splits
        );

        console.log('Data sent to database:', response);
        alert('Expense added successfully!');
    } catch (error) {
        console.error('Error sending data to database:', error);
        alert('Error adding expense. Please try again.');
    }
}

amountInput.addEventListener('input', updateSplits);
splitMethodSelect.addEventListener('change', updateSplits);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        amount: amountInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        payer: payerSelect.value,
        splitMethod: splitMethodSelect.value,
        splits: splits,
        categoryId: selectedCategoryId
    };
    console.log('Form submitted:', formData);
    await sendDataToDatabase(formData);
});

// Set default date to today
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

// Initialize the application
fetchFriends();
fetchCategories();