// API Call --------------------------------
const baseUrl = `http://localhost:3000/api/`;

const chatForm = document.getElementById("chat-form");

// form submit event -------------------------------

chatForm.addEventListener("submit", sendChat);

async function sendChat(e) {
  e.preventDefault();

  let chatMessage = document.getElementById("chatMessage").value;
  console.log(chatMessage);

  // Adding Chat in backend
  const token = localStorage.getItem("userIdToken");

  try {
    const result = await axios.post(
      `${baseUrl}sendchat`,
      {
        chatMessage: chatMessage,
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
  chatForm.chatMessage.value = "";
  document.getElementById("chatBox").innerHTML = "";
  getChats();
}

//  Getting chat from Backend =======================================================

async function getChats() {
  try {
    const response = await axios.get(`${baseUrl}getchats`);
    console.log("DATA:", response);
    showChatOnFE(response.data);
  } catch (error) {
    console.log(error);
  }
}
getChats();

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
