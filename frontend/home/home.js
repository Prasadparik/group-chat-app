// API Call --------------------------------
const baseUrl = `http://localhost:3000/api/`;

const chatForm = document.getElementById("chat-form");
const groupForm = document.getElementById("group-form");

// form submit event -------------------------------

groupForm.addEventListener("submit", createGroup);
chatForm.addEventListener("submit", sendChat);

async function createGroup(e) {
  e.preventDefault();

  let groupName = document.getElementById("groupName").value;
  console.log(groupName);

  // create new group in backend
  const token = localStorage.getItem("userIdToken");

  try {
    const result = await axios.post(
      `${baseUrl}creategroup`,
      {
        groupName: groupName,
      },
      {
        headers: { Authorization: token },
      }
    );
    console.log(result);
  } catch (error) {
    console.log("Error", error);
  }

  //   cleaning input fields
  groupForm.groupName.value = "";
  document.getElementById("group-list").innerHTML = "";
  getGroupList();
}

async function sendChat(e) {
  e.preventDefault();

  let chatMessage = document.getElementById("chatMessage").value;
  console.log(chatMessage);

  // Adding Chat in backend
  const token = localStorage.getItem("userIdToken");
  const groupId = localStorage.getItem("groupId");

  try {
    const result = await axios.post(
      `${baseUrl}sendchat?group=${groupId}`,
      {
        chatMessage: chatMessage,
      },
      {
        headers: { Authorization: token, groupId: groupId },
      }
    );
    console.log(result);
  } catch (error) {
    console.log("Error", error);
  }

  //   cleaning input fields
  chatForm.chatMessage.value = "";
  document.getElementById("chatBox").innerHTML = "";
  getChats();
}

// Store Chat in Localstorage ========================================

async function storeChatLS(chatData) {
  // store chat in localStorage
  // await localStorage.setItem("chats", JSON.stringify(chatData));
  // getting  chat from localStorage
  let Allchats = JSON.parse(localStorage.getItem("chats"));
  // console.log(Allchats.length);

  // get last chat Id
  let lastChatId =
    Allchats === null || Allchats.length === 0 || Allchats.length === undefined
      ? 0
      : Allchats[Allchats.length - 1]._id;
  console.log("lastChatId >>>> ", lastChatId);

  // getting new chat from Backend

  getChats(lastChatId);
  getGroupList();
}
// storeChatLS();

//  Getting chat from Backend =======================================================

async function getChats(lastChatId) {
  const token = localStorage.getItem("userIdToken");
  const groupId = localStorage.getItem("groupId");
  console.log("groupId FE >>>>> ", groupId);

  try {
    const response = await axios.get(
      `${baseUrl}getchats?lastChatId=${lastChatId}&group=${groupId}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log("DATA from LastChatId  >> :", response);

    // adding new chat to localStorage
    let oldChat = JSON.parse(localStorage.getItem("chats"));
    console.log("oldChat >>", oldChat);
    if (oldChat === null) {
      let updatedChat = [...response.data];
      await localStorage.setItem("chats", JSON.stringify(updatedChat));
    } else {
      let updatedChat = [...oldChat, ...response.data];
      await localStorage.setItem("chats", JSON.stringify(updatedChat));
    }

    // showing chat on frontend
    // showChatOnFE(JSON.parse(localStorage.getItem("chats")));

    showChatOnFE(response.data);
  } catch (error) {
    console.log(error);
  }
}
getChats();
getGroupList();

// ==================================================================

function dateToTime(data) {
  const dateTimeString = data;
  const dateTime = new Date(dateTimeString);

  const hours = dateTime.getUTCHours();
  const minutes = dateTime.getUTCMinutes();
  const seconds = dateTime.getUTCSeconds();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}

// show chat on frontend ============================================
let messageBox = document.getElementById("chatBox");

function showChatOnFE(chatData) {
  chatData.forEach((data) => {
    let box = document.createElement("div");
    let li = document.createElement("li");
    li.className =
      "list-group-item p-3 d-flex justify-content-between align-items-center fw-semibold bg-success-subtle m-1 rounded";
    li.appendChild(document.createTextNode(data.userChat));

    let span = document.createElement("span");
    span.className = "badge bg-light-subtle p-1 px-4 text-dark rounded-pill";
    span.appendChild(document.createTextNode(dateToTime(data.updatedAt)));

    li.appendChild(span);

    box.appendChild(document.createTextNode(data.userName));
    box.appendChild(li);
    document.getElementById("chatBox").appendChild(box);
  });
}

// Get group list from BE ==================================================

async function getGroupList() {
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.get(`${baseUrl}getallgroups`, {
      headers: { Authorization: token },
    });
    console.log("GROUP LIST  >> :", response);
    showGroupListOnFE(response.data);
  } catch (error) {
    console.log(error);
  }
}

function showGroupListOnFE(data) {
  data.forEach((data) => {
    let li = document.createElement("div");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center p-4 shadow-sm";
    li.appendChild(document.createTextNode(data.groupName));
    li.setAttribute("id", data._id);
    document.getElementById("group-list").appendChild(li);

    // Step 1: Select the button element
    const button = document.getElementById(`${data._id}`);

    // Step 2: Define the event handler function
    function handleClick() {
      localStorage.setItem("groupId", data._id);
      document.getElementById("group-title").innerText = `${data.groupName}`;
      document.getElementById("chatBox").innerHTML = "";
      getChats();
    }

    // Step 3: Attach the event handler to the button
    button.addEventListener("click", handleClick);
  });
}
