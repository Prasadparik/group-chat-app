// API Call --------------------------------
const baseUrl = `http://localhost:3000/api/`;

const chatForm = document.getElementById("chat-form");

// form submit event -------------------------------

chatForm.addEventListener("submit", sendChat);

async function sendChat(e) {
  e.preventDefault();

  let chatMessage = document.getElementById("chat-message").value;

  // Adding Chat in backend
  try {
    const result = await axios.post(`${baseUrl}sendchat`, {
      chatMessage: chatMessage,
    });
  } catch (error) {
    console.log("Error", error);
  }

  //   cleaning input fields
  chatForm.userName.value = "";
}
