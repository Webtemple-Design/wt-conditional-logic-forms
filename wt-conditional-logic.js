// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the form with the attribute data-wt-conditional-form="true"
    const form = document.querySelector('[data-wt-conditional-form="true"]');
    // Check if form is found
    if (form) {
        console.log("Found form");
        // Select all elements with the attribute data-wt-conditional-element="true"
        const conditionalElements = Array.from(document.querySelectorAll('[data-wt-conditional-element="true"]'));
        // Iterate over each conditional element
        conditionalElements.forEach(element => {
            console.log("Found Element");
            // Hide the element initially
            element.style.display = 'none';
            // Get all the attributes of the element and filter those that start with data-wt-conditional-if-
            const attributes = Array.from(element.attributes).filter(attr => attr.name.startsWith('data-wt-conditional-if-'));
            // Parse the field id, comparison operator, and the value from each attribute
            const conditions = attributes.map(attr => {
                const parts = attr.name.split('-');
                const operator = parts.pop();
                parts.splice(0, 3); // remove the first three elements
                const fieldId = parts.join('-'); // join the remaining parts to get the fieldId
                console.log('FieldId = ', fieldId);
                return { fieldId, operator, value: attr.value };
            });
            // Add an event listener to the form for any input changes
            form.addEventListener('input', function(event) {
                // Get the field id from the event target
                const fieldId = event.target.id;
                // Iterate over each condition
                conditions.forEach(condition => {
                    // If the field id matches the field id from the condition
                    if (condition.fieldId === fieldId) {
                        // Get the value of the field
                        const fieldValue = event.target.value;
                        let result;
                        // Perform the comparison operation based on the operator
                        switch (condition.operator) {
                            case 'eq': result = fieldValue == condition.value; break;
                            // ... rest of the switch cases
                        }
                        // If the comparison returns true, show the element, otherwise hide it
                        element.style.display = result ? 'block' : 'none';
                    }
                });
            });
        });
    }
});