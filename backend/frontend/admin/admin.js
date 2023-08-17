// API Call --------------------------------
const baseUrl = `http://localhost:5000/api/`;

let addUserFrom = document.getElementById("adduserform");
let userListForm = document.getElementById("userListForm");

addUserFrom.addEventListener("submit", addUserToGroup);
userListForm.addEventListener("submit", getGroupUserList);

// Get group list from BE ==================================================

async function getGroupList() {
  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.get(`${baseUrl}getadminsgroups`, {
      headers: { Authorization: token },
    });
    console.log("GROUP LIST  >> :", response);
    showGroupListInAddUserForm(response.data);
  } catch (error) {
    console.log(error);
  }
}
getGroupList();

console.log(document.getElementById("userGroup"));

function showGroupListInAddUserForm(data) {
  data.forEach((data) => {
    let option = document.createElement("option");
    option.className =
      "list-group-item d-flex justify-content-between align-items-center p-4 shadow-sm";
    option.appendChild(document.createTextNode(data.groupName));
    option.setAttribute("value", data.groupName);
    document.getElementById("groupName").appendChild(option);
  });
  data.forEach((data) => {
    let option = document.createElement("option");
    option.className =
      "list-group-item d-flex justify-content-between align-items-center p-4 shadow-sm";
    option.appendChild(document.createTextNode(data.groupName));
    option.setAttribute("value", data._id);
    document.getElementById("userListOptions").appendChild(option);
  });
}

// addUserToGroup ==================================

async function addUserToGroup(e) {
  e.preventDefault();
  console.log("userId, groupName");

  let userId = document.getElementById("userId").value;
  let groupName = document.getElementById("groupName").value;
  console.log(userId, groupName);

  // create new group in backend
  const token = localStorage.getItem("userIdToken");

  try {
    const result = await axios.post(
      `${baseUrl}creategroup?userId=${userId}&groupName=${groupName}`,
      {
        groupName: groupName,
      },
      {
        headers: { Authorization: token },
      }
    );
    console.log(result);
    alert("User Added!");
  } catch (error) {
    console.log("Error", error);
  }
  //   cleaning input fields
  addUserFrom.userId.value = "";
}

// getGroupUserList ===========================

async function getGroupUserList(e) {
  e.preventDefault();
  let groupId = document.getElementById("userListOptions").value;

  const token = localStorage.getItem("userIdToken");

  try {
    const response = await axios.get(
      `${baseUrl}getgroupuserlist?groupId=${groupId}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log("GROUP Users  >> :", response);
    showUserList(response.data.result);
    // showGroupListInAddUserForm(response.data);
  } catch (error) {
    console.log(error);
  }
}

// Show User List on FE ==========================================\

function showUserList(data) {
  document.getElementById("user-list").innerHTML = "";
  data.forEach((data) => {
    let li = document.createElement("li");
    let btn = document.createElement("button");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center p-4 shadow-sm";
    btn.className = "btn btn-danger btn-sm";
    li.appendChild(document.createTextNode(data.userName));
    btn.appendChild(document.createTextNode("Remove"));
    btn.setAttribute("id", data._id);
    li.appendChild(btn);
    document.getElementById("user-list").appendChild(li);

    // Step 1: Select the button element
    const button = document.getElementById(`${data._id}`);

    // Step 2: Define the event handler function
    async function handleClick() {
      const token = localStorage.getItem("userIdToken");

      try {
        const response = await axios.delete(
          `${baseUrl}remove?userId=${data._id}&groupId=${data.groups[0]._id}`,
          {
            headers: { Authorization: token },
          }
        );
        if (response.data === 1) {
          li.remove();
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    // Step 3: Attach the event handler to the button
    button.addEventListener("click", handleClick);
  });
}
