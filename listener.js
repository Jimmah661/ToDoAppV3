const listenForChanges = () => {
  // Open snapshot listener
  database.collection('todo').orderBy("position").onSnapshot(querySnapshot => {
    // Check snapshot for changes from the last version
    querySnapshot.docChanges().forEach(change => {
      // If an item was Added to the firestore database run this action
      if (change.type === 'added') {
        // Create List item
        let listItem = document.createElement("LI");
        setAttributes(listItem, 
          {
            "id": change.doc.id,
            "class":change.doc.data().isCompleted ? "finishedTodo" : "unfinishedTodo",
            "draggable": true
          })
          listItem.classList.add("todo")

        // Create and append P tag with Todo content
        let textNode = document.createElement("p");
        textNode.setAttribute("class", "todoContent");
        textNode.textContent = change.doc.data().todoContent;
        listItem.appendChild(textNode);

        // Create and Append P tag with Date content
        var epochSeconds = change.doc.data().dateSubmitted.seconds;
        let dateNode = document.createElement("p");
        dateNode.setAttribute("class", "todoDate");
        let date = new Date(epochSeconds * 1000);
        dateNode.textContent = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
        listItem.appendChild(dateNode);

        listItem.addEventListener('dragstart', () => listItem.classList.add("dragging"))
        listItem.addEventListener('dragend', () => listItem.classList.remove("dragging"))

        // Append the new list item to the UL
        container.appendChild(listItem);
      }
      // If an item was Changed run this action
      if (change.type === 'modified') {
        let updateTodo = document.getElementById(change.doc.id)
        updateTodo.setAttribute('class', change.doc.data().isCompleted ? "finishedTodo" : "unfinishedTodo")
        console.log('Item Changed')
      }
      // If an item was Removed run this action
      if (change.type === 'removed') {

        document.getElementById(change.doc.id).remove()
        console.log('Item removed')
      }
    })
  })
}

// Adding event listeners
submitButton.addEventListener("click", addTodo);
window.addEventListener('click', e => {
  if (e.target.tagName === "LI") {
    console.log('Clicked')
    if (e.target.className === "finishedTodo") {
      database.collection('todo').doc(e.target.id).update({isCompleted: false}).then(console.log("Todo has been set to Incomplete"))
    } else {
      database.collection('todo').doc(e.target.id).update({isCompleted: true}).then(console.log("Todo has been set to Complete"))
    }
  }
})
listenForChanges()

// These functions convert the Swimlane Header into an input field so that you can modify the title
function swimlaneHeaderOnclick(e) {
  var input = document.createElement("input")
  setAttributes(input, {
    "value": e.target.textContent,
    "class": "swimlane-header-setter"
  })
  input.addEventListener("focusout", (e) => swimlaneHeaderInputOnfocusout(e))
  e.target.replaceWith(input)
  document.querySelector(".swimlane-header-setter").focus()
}

function swimlaneHeaderInputOnfocusout(e) {
  var span = document.createElement("span");
  span.addEventListener("click", (e) => swimlaneHeaderOnclick(e))
  span.append(e.target.value)
  span.classList.add("swimlane-header")
  e.target.replaceWith(span)
}

var swimlanes = [...document.querySelectorAll(".swimlane-header")]
swimlanes.forEach(swimlane => {
  swimlane.addEventListener("click", e => swimlaneHeaderOnclick(e))
})