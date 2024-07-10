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
        console.log(count);

        // If count is null, initialize to 1 for initial row
        if (typeof count === 'undefined' || count == null || isNaN(count)) {
            count = 1;
            console.log("count set to", count);
            // Save to local storage
            localStorage.setItem("count", count);
        }

        // var count = 1;

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
        }

        // Check if the user input is a number
        function isNum(input) {
            // Accept only whole numbers and decimal numbers
            input.value = input.value.replace(/[^0-9.]/g, '');
        }


        window.onload = resetFormFields;

        