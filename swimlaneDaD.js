document.querySelector(".swimlaneContainer").addEventListener("dragover", (e) => {
  // The If check is here to prevent this dragover event firing while a todo is being dragged
  if (todoBeingDragged != true) {
    let swimlaneContainer = document.querySelector(".swimlaneContainer")
    e.preventDefault();
    let swimlaneDragging = document.querySelector(".swimlaneDragging")
    const afterSwimlane = getDragAfterSwimlane(e.clientX)
    if (afterSwimlane == null) {
      swimlaneContainer.insertBefore(swimlaneDragging, document.querySelector(".newSwimlane"))
    } else {
      swimlaneContainer.insertBefore(swimlaneDragging, afterSwimlane)
    } 
  }
})

function getDragAfterSwimlane(xCoordinate) {
  let swimlaneArray = [...document.querySelectorAll(".swimlane:not(.swimlaneDragging):not(.newSwimlane)")]
  return swimlaneArray.reduce((previous, current) => {
    let box = current.getBoundingClientRect();
    const offset = xCoordinate - box.left - box.width / 2
    if (offset < 0 && offset > previous.offset) {
      return {offset: offset, element: current}
    } else {
      return previous
    }
  }, { offset: Number.NEGATIVE_INFINITY}).element
}

document.querySelector(".swimlaneContainer").addEventListener("dragend", (e) => {
  let newIndex = [...document.querySelectorAll(".swimlane:not(.newSwimlane")]
  newIndex.forEach((item, index) => {
    database.collection("swimlanes").doc(item.id).update({"swimlanePosition": index})
  })
})
