// Defining a variable here that will be used by the system to manage if a todo is being dragged or if its a swimlane
var todoBeingDragged = false

database.collectionGroup("ToDos").onSnapshot(todosSnapshot => {
  todosSnapshot.docChanges().forEach(todo => {
    let parentSwimlane = document.querySelector(`#${todo.doc.ref.parent.parent.id} ul`)


    if (todo.type === 'added') {
      let todoItem = document.createElement("LI");
      setAttributes(todoItem, 
        {
          "id": todo.doc.id,
          "draggable": true
        })
      todoItem.classList.add("todo")


      // Create and append P tag with Todo content
      let textNode = document.createElement("p");
      textNode.setAttribute("class", "todoContent");
      textNode.textContent = todo.doc.data().todoContent;
      todoItem.appendChild(textNode);


      // Create and Append P tag with Date content
      if (todo.doc.data().dateSubmitted) {
        var epochSeconds = todo.doc.data().dateSubmitted.seconds;
        let dateNode = document.createElement("p");
        dateNode.setAttribute("class", "todoDate");
        let date = new Date(epochSeconds * 1000);
        dateNode.textContent = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
        todoItem.appendChild(dateNode);
      }


      // Add event listeners for dragging of the Todos
      todoItem.addEventListener('dragstart', (e) => {
          todoItem.classList.add("dragging");
          todoBeingDragged = true;
          e.stopPropagation();
        })
      todoItem.addEventListener('dragend', () => {
        todoItem.classList.remove("dragging");
        todoBeingDragged = false;
      })
      todoItem.addEventListener('click', (e) => todoContentOnclick(e))

      // Append the new list item to the UL
      parentSwimlane.appendChild(todoItem);
    }
  })
})

function todoContentOnclick(e) {
  e.preventDefault()
  if (e.target.nodeName === "LI") {
    var input = document.createElement("input")
    setAttributes(input, {
      "value": e.target.firstChild.textContent,
      "class": "todo-content-setter",
      "type": "text"
      // Pulling the Parent node ID so we can update the header on unfocus
      // "data-parentID": e.target.closest("div").id
    })
    input.addEventListener("focusout", (e) => todoContentInputOnfocusout(e))
    e.target.firstChild.replaceWith(input)
    document.querySelector(".todo-content-setter").focus()
  }
}

function todoContentInputOnfocusout(e) {
  database.collection("swimlanes").doc(e.target.closest(".swimlane").id).collection("ToDos").doc(e.target.closest("li").id).update({"todoContent": e.target.value})
  var p = document.createElement("p");
  p.addEventListener("click", (e) => todoContentOnclick(e))
  p.textContent = e.target.value
  p.classList.add("todoContent")
  e.target.replaceWith(p)
}