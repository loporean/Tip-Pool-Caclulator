// Container to hold results
var results = [];

// Tips per hour
var tipShare = 0;

// Total hours
var totalRoundedHours = 0;

// Total tips
var totTips = 0;

// Grab the count from local storage
var count=localStorage.getItem("count", count);
console.log("initial count:", count);

// If count is null, initialize to 1 for initial row
if (typeof count === 'undefined' || count == null || isNaN(count)) {
    count = 1;
    console.log("count set to", count);
    // Save to local storage
    localStorage.setItem("count", count);
}

// Adds another employee field for calculating
function addEmployee() {
    // incrememnt employee count
    count++;

    // Save to local storage
    localStorage.setItem("count", count);

    console.log("Add employee " + count);

    // Container where new field will be added
    var container = document.getElementById("employeeContainer");

    var employeeCount = document.createElement("span");
    employeeCount.textContent = count + ". ";

    // Create new input field for name and hours
    var nameField = document.createElement("input");
    nameField.type = "text";
    nameField.name = "name";
    nameField.placeholder = "Employee Name";

    var hoursField = document.createElement("input");
    hoursField.type = "text";
    hoursField.name = "hours";
    hoursField.placeholder = "Hours Worked";
    hoursField.min = "0";
    hoursField.oninput = function() { isNum(this); };

    // Add line break
    var br = document.createElement("br");

    // Append new fields to container
    container.appendChild(employeeCount);
    container.appendChild(nameField);
    container.appendChild(hoursField);
    container.appendChild(br);

}

// Remove employee field
function removeEmployee() {
    var container = document.getElementById("employeeContainer");
    var elements = container.children;
    
    // Remove the last employee field
    // 4 because there are 4 fields to remove per line
    if (elements.length > 4) {
        for (let i=0; i<4; i++) {
            container.removeChild(container.lastChild);
        }
        count--;
        // Save to local storage
        localStorage.setItem("count", count);
    }
}

function calcTips() {
    // Clear results
    results.innerHTML = "";
    // Grab all input fields with name "hours"
    var hoursField = document.getElementsByName("hours");
    totalRoundedHours = 0;

    for (var i=0; i<hoursField.length; i++) {
        var value = parseFloat(hoursField[i].value);

        if (!isNaN(value)) {
            var roundedValue = Math.round(value);
            hoursField[i].value = roundedValue;
            totalRoundedHours += roundedValue;
        }
    }

    console.log("total rounded hours: ", totalRoundedHours);

    tipsPerHour();

    shareOfTips();

    // Might not be needed
    saveFormData();

}

// Calculate the tip share
function tipsPerHour() {
    totTips = document.getElementById("totalTips").value;
    console.log("tot tips: ", totTips);
    tipShare = totTips / totalRoundedHours;
    console.log("Share of tips per hour: ", tipShare);
}

// Calculate each employees tip share
function shareOfTips() {
    // Grab the list of employees and rounded hours each employee worked
    var employees = document.getElementsByName("name");
    var hours = document.getElementsByName("hours");

    // Container for displaying results
    results = document.getElementById("results");
    // Title
    var title = document.createElement("h2");
    title.textContent = "Tip Share";
    // Unordered list of results
    var list = document.createElement("ul");

    // Loop through each employee and generate their tips
    for (var i=0; i<hours.length; i++) {
        var nameValue = employees[i].value;
        var hoursValue = parseFloat(hours[i].value);
        var tips = 0;

        if (!isNaN(hoursValue)) {
            tips = parseFloat(hoursValue * tipShare).toFixed(2);

            // Create a list of employees, their hours and the tip share
            var listItem = document.createElement("li");
            listItem.style.padding = "3px";
            listItem.textContent = nameValue + ": $" + tips;
            
            console.log("Name: " + nameValue, "Hours: " + hoursValue, "Tip Share: " + tips);

            // Add list item
            list.appendChild(listItem);
            
        }
    }
    // Add list to div
    results.appendChild(title);
    results.appendChild(list);
}

// Clear the input fields
function resetFormFields() {
    var inputFields = document.getElementsByTagName("input");
    for (var i=0; i<inputFields.length; i++) {
        if (inputFields[i].type !== "button" && inputFields[i].type !== "submit") {
            inputFields[i].value = "";
        }
    }
    // Reset tip share
    tipShare = 0;
    // Reset total tips
    totTips = 0;
    // Clear results
    results.innerHTML = "";

    // Clear saved data
    localStorage.removeItem("formData");
    localStorage.removeItem("totalTips");
}

// Check if the user input is a number
function isNum(input) {
    // Accept only whole numbers and decimal numbers
    input.value = input.value.replace(/[^0-9.]/g, '');
}

// Save the employee input data
function saveFormData() {
    var employees = document.getElementsByName("name");
    var hours = document.getElementsByName("hours");
    var formData = [];

    for (var i = 0; i < employees.length; i++) {
        formData.push({
            name: employees[i].value,
            hours: hours[i].value
        });
    }

    // Save Names, Hours, and Total Tips
    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("totalTips", document.getElementById("totalTips").value);
}

function restoreEmployee(curr_count) {
    // Container where new field will be added
    var container = document.getElementById("employeeContainer");

    // Increment the count based on the for loop
    var employeeCount = document.createElement("span");
    employeeCount.textContent = curr_count + ". ";

    // Create new input field for name and hours
    var nameField = document.createElement("input");
    nameField.type = "text";
    nameField.name = "name";
    nameField.placeholder = "Employee Name";

    var hoursField = document.createElement("input");
    hoursField.type = "text";
    hoursField.name = "hours";
    hoursField.placeholder = "Hours Worked";
    hoursField.min = "0";
    hoursField.oninput = function() { isNum(this); };

    // Add line break
    var br = document.createElement("br");

    // Append new fields to container
    container.appendChild(employeeCount);
    container.appendChild(nameField);
    container.appendChild(hoursField);
    container.appendChild(br);
}

function restoreFields() {
    var savedFormData = JSON.parse(localStorage.getItem("formData"));
    var savedTotalTips = localStorage.getItem("totalTips");

    if (savedFormData && savedFormData.length > 0) {
        var initialCount = count;
        // Restore the number of employee fields
        for (let i = 1; i < initialCount; i++) {
            restoreEmployee(i+1);
        }

        // Restore the saved data
        var employees = document.getElementsByName("name");
        var hours = document.getElementsByName("hours");

        for (let i = 0; i < savedFormData.length; i++) {
            employees[i].value = savedFormData[i].name;
            hours[i].value = savedFormData[i].hours;
        }

        // Restore total tips
        if (savedTotalTips) {
            document.getElementById("totalTips").value = savedTotalTips;
        }
    } else if (count !== 1) {
        // If no saved data, just restore the number of fields
        var initialCount = count;
        for (let i = 1; i < initialCount; i++) {
            restoreEmployee(i+1);
        }
    }
}

// Trigger on page load
window.onload = function() {
    restoreFields();
}

// Listen for changes to forms
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT') {
        saveFormData();
    }
});