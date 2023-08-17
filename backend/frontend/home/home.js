// API Call --------------------------------
const baseUrl = `http://localhost:5000/api/`;

const chatForm = document.getElementById("chat-form");
const groupForm = document.getElementById("group-form");
const mediaInput = document.getElementById("mediaInput");

var socket = io();

socket.on("message", (message) => {
  console.log("MSG BE >>", message);
  document.getElementById("chatBox").innerHTML = "";
  getChats();
  sendMediaChat();
});

// form submit event -------------------------------

groupForm.addEventListener("submit", createGroup);
chatForm.addEventListener("submit", sendChat);

mediaInput.addEventListener("change", sendMediaChat);

async function sendMediaChat(e) {
  const mediaFile = e.target.files[0];
  if (mediaFile) {
    // send media to BE
    const token = localStorage.getItem("userIdToken");
    const groupId = localStorage.getItem("groupId");

    try {
      // Create FormData and append the media file
      const formData = new FormData();
      formData.append("media", mediaFile);
      console.log("MEDIA NAME >>", mediaFile);

      // Send the media file to the backend using Axios
      const response = await axios.post(
        `${baseUrl}sendmedia?group=${groupId}`,
        { media: mediaFile },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      console.log("MEDIA RES >>", response);
    } catch (error) {
      console.log(error);
    }
  } else {
    selectedMediaPath.textContent = ""; // Clear the content if no file selected
  }
}

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

  // socket ----------
  socket.emit("message", chatMessage);

  //   cleaning input fields
  chatForm.chatMessage.value = "";
  document.getElementById("chatBox").innerText = "";
  // getChats();
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

function isURL(str) {
  // Regular expression pattern for a simple URL format
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(str);
}

// show chat on frontend ============================================
let messageBox = document.getElementById("chatBox");

function showChatOnFE(chatData) {
  chatData.forEach((data) => {
    if (isURL(data.userChat)) {
      console.log(`THIS CHAT IS URL ${data._id}`);
      let box = document.createElement("div");
      box.setAttribute("width", "fit-content");

      let li = document.createElement("li");
      li.className =
        "list-group-item p-3 d-flex justify-content-between align-items-center fw-semibold  m-1 rounded";

      let img = document.createElement("img");
      img.setAttribute("src", `${data.userChat}`);
      img.setAttribute("width", "300");
      img.className = "border-5 border-primary-subtle rounded";

      li.appendChild(img);
      box.appendChild(document.createTextNode(data.userName));
      box.appendChild(li);
      document.getElementById("chatBox").appendChild(box);
    } else {
      let box = document.createElement("div");
      let li = document.createElement("li");
      li.className =
        "list-group-item p-3 d-flex justify-content-between align-items-center fw-semibold bg-success-subtle m-1 rounded";
      li.appendChild(document.createTextNode(data.userChat));
      box.appendChild(document.createTextNode(data.userName));
      box.appendChild(li);
      document.getElementById("chatBox").appendChild(box);
    }
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
