// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCnag-BJpnfcTbf1oVMACMYKsIE26TxoMg",
  authDomain: "todolistv3-c5920.firebaseapp.com",
  projectId: "todolistv3-c5920",
  storageBucket: "todolistv3-c5920.appspot.com",
  messagingSenderId: "435939733429",
  appId: "1:435939733429:web:b2cf44af52faf1217233fc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();


function setAttributes(element, attributes) {
  for(var key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

const container = document.querySelector("#todoList");

var submitButton = document.getElementById("submitButton");
var inputField = document.getElementById("todoInput");


const addTodo = () => {
  var currentToDos = [...document.querySelectorAll(".todo")]
  let newTodo = {
    todoContent: inputField.value,
    isCompleted: false,
    dateSubmitted: new Date(),
    position: currentToDos.length,
    // Needs to specify which swimlane it's going to be in
    // swimlane: 
  };
  database.collection('todo').add(newTodo);
  console.log('Todo Added');
  inputField.value = "";
}

const addSwimlane = () => {
  let currentSwimlanes = [...document.querySelectorAll(".swimlane")]
  let newSwimlane = {
    swimlaneTitle: "Untitled",
    swimlaneOrder: currentSwimlanes.length
  }
}