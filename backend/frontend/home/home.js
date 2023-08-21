// API Call --------------------------------
// const baseUrl = `http://16.171.170.198:5000/api/`;
const baseUrl = `http://localhost:5000/api/`;

const chatForm = document.getElementById("chat-form");
const groupForm = document.getElementById("group-form");
const mediaInput = document.getElementById("mediaInput");
const chatBox = document.getElementById("chatBox");

// Localstorage ----------------------------
const userNameLS = localStorage.getItem("userName");
const userEmailLS = localStorage.getItem("userEmail");
const userid = localStorage.getItem("userId");

document.getElementById("user-name").innerText = `${userNameLS}`;

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

var socket = io();
socket.on("message", (message) => {
  console.log("MSG BE >>", message);
  document.getElementById("chatBox").innerHTML = "";

  sendMediaChat();
  getChats();
  document.getElementById("send-audio").play();
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
      // socket ----------
      socket.emit("message", chatMessage);
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
  if (chatData.length === 0) {
    console.log("EMPTY", chatData.length);
    let img = document.createElement("img");
    img.setAttribute("src", `./nochatbg.png`);
    img.setAttribute("width", "auto");
    img.setAttribute("style", "margin-left: 20% !important;  ");
    img.setAttribute("height", "100%");
    img.className = "border-5 border-primary-subtle rounded";

    document.getElementById("chatBox").appendChild(img);
  }
  chatData.forEach((data) => {
    if (detectURLType(data.userChat) === "image") {
      console.log(`THIS CHAT IS URL ${data._id}`);
      if (userid == data.userId) {
        let box = document.createElement("div");
        box.className = "d-flex flex-column align-items-end";

        box.setAttribute("width", "fit-content");

        let li = document.createElement("li");
        li.className = "list-group-item p-3 fw-semibold  m-1 rounded shadow-sm";
        li.setAttribute(
          "style",
          "width:max-content; background-color: #7289da"
        );
        let img = document.createElement("img");
        img.setAttribute("src", `${data.userChat}`);
        img.setAttribute("width", "300");
        img.className = "border-5 border-primary-subtle rounded";

        li.appendChild(img);
        box.appendChild(document.createTextNode(data.userName));
        box.appendChild(li);
        document.getElementById("chatBox").appendChild(box);
      } else if (detectURLType(data.userChat) === "video") {
        let box = document.createElement("div");
        box.innerHTML = `
        <video controls width="640" height="360">
        <source src="https://youtu.be/3vSxHROQ4Hs" type="video/mp4">
        Your browser does not support the video tag.
    </video>
        `;
        box.appendChild(document.createTextNode("THIS IS DOC !!"));
      } else {
        let box = document.createElement("div");
        box.className = " mt-4";

        box.setAttribute("width", "fit-content");

        let li = document.createElement("li");
        li.className =
          "list-group-item p-3 fw-semibold bg-light-subtle m-1 rounded shadow-sm";
        li.setAttribute("style", "width:max-content");
        let img = document.createElement("img");
        img.setAttribute("src", `${data.userChat}`);
        img.setAttribute("width", "300");
        img.className = "border-5 border-primary-subtle rounded";

        li.appendChild(img);
        box.appendChild(document.createTextNode(data.userName));
        box.appendChild(li);
        document.getElementById("chatBox").appendChild(box);
      }
    } else {
      const userid = localStorage.getItem("userId");

      if (userid == data.userId) {
        let box = document.createElement("div");
        box.className = "d-flex flex-column align-items-end";
        let li = document.createElement("li");
        li.className =
          "list-group-item p-3 fw-semibold text-light m-1 rounded px-3 shadow-sm";
        li.style.width = "max-content"; // Alternatively, you can use li.setAttribute("style", "width:max-content");
        li.style.float = "right"; // Apply the float property
        li.setAttribute("style", "background-color: #7289da");

        li.appendChild(document.createTextNode(data.userChat));
        box.appendChild(document.createTextNode(data.userName));
        box.appendChild(li);
        document.getElementById("chatBox").appendChild(box);
      } else {
        let box = document.createElement("div");
        box.className = "d-flex flex-column";
        let li = document.createElement("li");
        li.className =
          "list-group-item p-3 fw-semibold bg-light m-1 rounded px-3 shadow-sm";
        li.style.width = "max-content"; // Alternatively, you can use li.setAttribute("style", "width:max-content");
        li.style.float = "right"; // Apply the float property

        li.appendChild(document.createTextNode(data.userChat));
        box.appendChild(document.createTextNode(data.userName));
        box.appendChild(li);
        document.getElementById("chatBox").appendChild(box);
      }
    }
  });
  scrollToBottom();
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
  const groupId = localStorage.getItem("groupId");

  data.forEach((data) => {
    let li = document.createElement("div");
    li.className = `list-group-item d-flex justify-content-between align-items-center p-4 shadow-sm fw-medium my-1 rounded `;
    li.appendChild(document.createTextNode(data.groupName));
    li.setAttribute("id", data._id);
    document.getElementById("group-list").appendChild(li);

    document.getElementById("group-title").innerText = `${data.groupName}`;

    // Step 1: Select the button element
    const button = document.getElementById(`${data._id}`);

    // Step 2: Define the event handler function
    function handleClick() {
      localStorage.setItem("groupId", data._id);
      document.getElementById("group-title").innerText = `${data.groupName}`;
      document.getElementById(`${data._id}`).className =
        "list-group-item d-flex justify-content-between align-items-center p-4 shadow-sm fw-medium my-1 rounded ";
      document.getElementById("chatBox").innerHTML = "";

      getChats();
    }

    // Step 3: Attach the event handler to the button
    button.addEventListener("click", handleClick);
  });
}

// detectURLType =====================================

function detectURLType(url) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  if (urlPattern.test(url)) {
    if (/\.(jpg|jpeg|png|gif)$/i.test(url)) {
      return "image";
    } else if (/\.(mp4|avi|mov|webm)$/i.test(url)) {
      return "video";
    } else if (/\.(pdf|doc|docx|ppt|pptx)$/i.test(url)) {
      return "document";
    } else {
      return "other";
    }
  } else {
    return "invalid";
  }
}
