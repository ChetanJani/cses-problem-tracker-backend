const availableStatuses = {
    UNSOLVED : "unsolved",
    SOLVED : "solved",
    ATTEMPTED : "attempted"
}

const listOfAvailableStatuses = Object.values(availableStatuses)
console.log(listOfAvailableStatuses);


export { availableStatuses, listOfAvailableStatuses };