// Conditional Form Logic

document.addEventListener('DOMContentLoaded', function() {
    initConditionalLogic();
});

function initConditionalLogic() {
    const conditionalElements = document.querySelectorAll('[wt-conditional-show], [wt-conditional-hide]');
    
    conditionalElements.forEach(element => {
        setupConditionalLogic(element);
    });
}

function setupConditionalLogic(element) {
    const showTargetId = element.getAttribute('wt-conditional-show');
    const hideTargetId = element.getAttribute('wt-conditional-hide');
    const conditionalString = element.getAttribute('wt-conditional-string');

    if (showTargetId) {
        const targetElement = document.getElementById(showTargetId);
        if (targetElement) {
            hideElement(targetElement);
            saveRequiredFields(targetElement);
        }
    }

    if (element.type === 'checkbox' || element.type === 'radio') {
        element.addEventListener('change', function() {
            handleConditionalLogic(element);
        });
        
        // If it's a radio button, we need to handle the entire group
        if (element.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[type="radio"][name="${element.name}"]`);
            radioGroup.forEach(radio => {
                if (radio !== element) {
                    radio.addEventListener('change', function() {
                        handleConditionalLogic(element);
                    });
                }
            });
        }
    } else if (element.tagName === 'SELECT' || element.type === 'text') {
        element.addEventListener('input', function() {
            handleConditionalLogic(element);
        });
    }

    // Initial check
    handleConditionalLogic(element);
}

function handleConditionalLogic(element) {
    const showTargetId = element.getAttribute('wt-conditional-show');
    const hideTargetId = element.getAttribute('wt-conditional-hide');
    const conditionalString = element.getAttribute('wt-conditional-string');

    let shouldShow = false;

    if (element.type === 'checkbox') {
        shouldShow = element.checked;
    } else if (element.type === 'radio') {
        shouldShow = element.checked;
        // If this radio button is not checked, we need to check if any other in the group is
        if (!shouldShow) {
            const radioGroup = document.querySelectorAll(`input[type="radio"][name="${element.name}"]`);
            shouldShow = Array.from(radioGroup).some(radio => radio.checked && radio !== element);
        }
    } else if (conditionalString) {
        shouldShow = element.value.includes(conditionalString);
    }

    if (showTargetId) {
        const targetElement = document.getElementById(showTargetId);
        if (targetElement) {
            if (shouldShow) {
                showElement(targetElement);
                restoreRequiredFields(targetElement);
            } else {
                hideElement(targetElement);
                removeRequiredFields(targetElement);
            }
        }
    }

    if (hideTargetId) {
        const targetElement = document.getElementById(hideTargetId);
        if (targetElement) {
            if (shouldShow) {
                hideElement(targetElement);
                removeRequiredFields(targetElement);
            } else {
                showElement(targetElement);
                restoreRequiredFields(targetElement);
            }
        }
    }
}

function hideElement(element) {
    element.style.display = 'none';
}

function showElement(element) {
    element.style.display = '';
}

function saveRequiredFields(element) {
    const requiredFields = element.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.setAttribute('wt-required', 'true');
        field.removeAttribute('required');
    });
}

function restoreRequiredFields(element) {
    const savedRequiredFields = element.querySelectorAll('[wt-required="true"]');
    savedRequiredFields.forEach(field => {
        field.setAttribute('required', '');
    });
}

function removeRequiredFields(element) {
    const savedRequiredFields = element.querySelectorAll('[wt-required="true"]');
    savedRequiredFields.forEach(field => {
        field.removeAttribute('required');
    });
}