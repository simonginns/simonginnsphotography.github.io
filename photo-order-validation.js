// There are many ways to pick a DOM node; here we get the form itself and the email
// input box, as well as the div element into which we will place the error message.
const form  = document.getElementsByTagName('form')[0];

const email = document.getElementById('emailAddress');
const emailError = document.querySelector('#emailAddress + div.invalid-feedback');

const photoid = document.getElementById('photoId');
const photoidError = document.querySelector('#photoId + div.invalid-feedback');

form.addEventListener('submit', function (event) {
    
    event.preventDefault();

    var formError = false;

    validatePhotoIds();
    if(!photoid.validity.valid) {
        photoidError.textContent = photoid.validationMessage;
        formError = true;
    }

    if(!email.validity.valid) {
        // If it isn't, we display an appropriate error message
        formError = true;
        showEmailError();
        // Then we prevent the form from being sent by canceling the event       
    }

    if(!form.classList.contains('was-validated')) {
        form.classList.add('was-validated');
    }
    
    if(!formError) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://bn9ex9ntnd.execute-api.ap-southeast-2.amazonaws.com/photoorder');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var userInfo = JSON.parse(xhr.responseText);
                console.log(userInfo);
            }
        };
        xhr.send(JSON.stringify({
            firstname: 'John Smith',
            lastname: 'John Smith',
            email: 'John Smith',
            photoids: 'A1280123C',
        }));     
    }    
});


email.addEventListener('input', function (event) {
    // Each time the user types something, we check if the
    // form fields are valid.

    if (email.validity.valid) {
        // In case there is an error message visible, if the field
        // is valid, we remove the error message.
        emailError.textContent = ''; // Reset the content of the message
        emailError.className = 'invalid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showEmailError();
    }
});


function showEmailError() {
    if(email.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        emailError.textContent = 'You need to enter an e-mail address.';
    } else if(email.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
    emailError.textContent = 'Entered value needs to be a correctly formatted e-mail address.';
    } else if(email.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
    emailError.textContent = `Email should be at least ${ email.minLength } characters; you entered ${ email.value.length }.`;
    }
}


function validatePhotoIds() {
    var id = photoid.value;
    var ids = photoid.value.split(',');
        
    if(id.length > 0) {
        var constraint = new RegExp('^P1\\d{6}\\S?$', "");
        var idErrors = [];
        for (const id of ids) {
            if (!constraint.test(id)) {
                idErrors.push(id);        
            }
        }
        if (idErrors.length > 0) {   
            var errorMsg = 'The following photo IDs are invalid: ' + idErrors.join(', ');
            photoid.setCustomValidity(errorMsg);
            photoidError.textContent = errorMsg;
        } else {
            photoid.setCustomValidity("");
        }
    } else {
        photoid.setCustomValidity("Please provide at least one ID of a photo you would like to order.")
    }
}
