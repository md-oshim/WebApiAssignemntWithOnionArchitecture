let nextId = 3;
let allTouristPlaces = [];
let sortedBy = null;

let dynamicHeading;

let nameInput;
let addressInput;
let ratingInput;
let typeInput;
let pictureInput;


$(document).ready(function() {
    $(".tourist-place-list, .create-new").click(function(){
        resetForm();
        $("#create-page, #list-page").toggle();
    })

    $(".update").click(updateTouristPlace)
    
    $("#submit").click(submitForm);

    $('#reset').click(resetForm);

    $('.delete').click(deleteTouristPlace);

    $('.search-box').on('input', searchFunctionality);

    $('#name-col').click(sortByName);
    $('#rating-col').click(sortByRating);

    nameInput = $('#name');
    nameInput.on('input', nameErrorMessageHandler);
    addressInput = $('#address');
    addressInput.on('input', addressErrorMessageHandler);
    ratingInput = $('#rating');
    ratingInput.on('input', ratingErrorMessageHandler);
    typeInput = $('#type');
    typeInput.on('input', typeErrorMessageHandler);
    pictureInput = $('#picture');
    // picture input handler is set in the html page
    
    dynamicHeading = $('#dynamic-heading');
    
    // getting all the data from the API call and building the table based on the data.
    getAllTouristPlaces();
})

//eror message handling functions.
function nameErrorMessageHandler(event) {
    let value = event.target.value;
    if (value == '') {
        removeInputErrorMessages('name');
        createInputErrorMessage('name', 'Please enter the Tourist Place Name');
    } else {
        removeInputErrorMessages('name');
    }
}

function addressErrorMessageHandler(event) {
    let value = event.target.value;
    if (value == '') {
        removeInputErrorMessages('address');
        createInputErrorMessage('address', 'Please enter the Tourist Place Address');
    } else {
        removeInputErrorMessages('address');
    }
}

function typeErrorMessageHandler(event) {
    let value = event.target.value;
    if (value == '') {
        removeInputErrorMessages('type');
        createInputErrorMessage('type', 'Please enter the Tourist Place Type');
    } else {
        removeInputErrorMessages('type');
    }
}

function ratingErrorMessageHandler(event) {
    let value = event.target.value;

    if (value == '') {
        removeInputErrorMessages('rating');
        createInputErrorMessage('rating', "Please enter the Tourist Place rating");
    } else if (value > 5 || value < 1) {
        removeInputErrorMessages('rating');
        createInputErrorMessage('rating', 'Entered rating is not within the range');
    } else {
        removeInputErrorMessages('rating');
    }
}

function picturePreviewAndErrorMessageHandler(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (event) {
            removeInputErrorMessages('picture');
            createPreviewPicture(event.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        removePreviewPicture();
        removeInputErrorMessages('picture');
        createInputErrorMessage('picture', 'Please enter the Tourist Place Image');
    }
}

function createInputErrorMessage(id, errorMessage) {
    let paragraphElement = `<p class="error-message">${errorMessage}</p>`;
    $(`#${id}`).parent().append(paragraphElement);
}

function removeInputErrorMessages(id) {
    $(`#${id}~.error-message`).remove();
}

function removeErrorMessages(){
    $('.error-message').remove();
}

function createPreviewPicture(picture) {
    let previewPicture = $('#picture~.side');
    if (previewPicture.children().length > 0) {
        previewPicture.children().eq(0).attr('src', picture);
    } else {
        let img = `<img src="${picture}" >`;
        previewPicture.append(img);
    }
}

function removePreviewPicture () {
    $('.side img')?.remove();
}
//end of error message handlers.

//client side helping functions
function resetDynamicHeadingAndSubmitButton() {
    dynamicHeading.html('Add a new Tourist Place');
    $("#submit").html('Submit');
}

function setDynamicHeadingAndSubmitButton() {
    dynamicHeading.html("Edit a Tourist Place");
    $("#submit").html('Update');
}

function showCreatePage() {
    $("#create-page, #list-page").toggle();
}

function submitForm(event) {
    //delete the error-message paragraphElements first
    removeErrorMessages();
    //here data validation will be done first
    let touristPlace = dataValidation();
    //then adding/updating the data to the database
    if (touristPlace != false) {
        if(touristPlace.id == 0) {
            createTouristPlace(touristPlace);
        } else {
            updateExistingOne(touristPlace);
        }
    }
}

function dataValidation() {
    //data will be validated here
    let error = false;
    let touristPlace = {};
    
    let id = $('#id').val().trim();
    touristPlace.id = id;

    let name = nameInput.val().trim();
    if (name == '') {
        createInputErrorMessage('name', 'Please enter the Tourist Place Name')
        error = true;
    }
    touristPlace.name = name;

    let address = addressInput.val().trim();
    if (address == '') {
        createInputErrorMessage('address', 'Please enter the Tourist Place Address');
        error = true;
    }
    touristPlace.address = address;

    let rating = ratingInput.val().trim();
    if (rating == '') {
        createInputErrorMessage('rating', 'Please enter the Tourist Place rating');
        error = true;
    }
    else if (rating < 1 || rating > 5) {
        createInputErrorMessage('rating', 'Entered rating is not within the range');
        error = true;
    }
    touristPlace.rating = rating;

    let type = typeInput.val().trim();
    if (type == '' && id == '0') {
        createInputErrorMessage('type', 'Please enter the Tourist Place Type');
        error = true;
    }
    touristPlace.type = type;

    let picture = pictureInput.val()? pictureInput.val().trim().split('\\')[2] : "";
    if (picture == '' && id == '0') {
        createInputErrorMessage('picture', 'Please enter the Tourist Place Image');
        error = true;
    }
    let extention = picture?.split('.');
    extention = extention[extention.length - 1].toLowerCase();
    if (extention.length > 0 && !(extention == 'jpg' || extention == 'png' || extention == 'jpeg')) {
        createInputErrorMessage('picture', 'Invalid file type');
        error = true;
    }
    let previewPicture = $('#picture~.side');
    touristPlace.picture = previewPicture.children().eq(0).attr('src');

    if (error == true) return false;
    return touristPlace;
}

function resetForm() {
    $('form input').val(function(index, data){
        if (index == 0) {
            return "0";
        } else {
            return "";
        }
    })
    $('#type').val((index, data) => "");
    $('.side img')?.remove();
    removeErrorMessages();
    resetDynamicHeadingAndSubmitButton();
}

function sortByName(event) {
    let searchedText = $(event.target).val().trim();
    let URL = `https://localhost:7243/api/touristplace/getalltouristplaces?searchedText=${searchedText}&&`;
    if (sortedBy != 'name') {
        URL += `&&sortBy=Name&&sortType=ASC`;
        sortedBy = 'name';
    } else {
        URL += `&&sortBy=Name&&sortType=DESC`;
        sortedBy = null;
    }
    sortRowsAjaxCall(URL);
}

function sortByRating(event) {
    let searchedText = $(event.target).val().trim();
    let URL = `https://localhost:7243/api/touristplace/getalltouristplaces?searchedText=${searchedText}&&`;
    if (sortedBy != 'rating') {
        URL += `sortBy=Rating&&sortType=ASC`;
        sortedBy = 'rating';
    } else {
        URL += `&&sortBy=Rating&&sortType=DESC`;
        sortedBy = null;
    }
    sortRowsAjaxCall(URL);
}
//end of client side helping functions.

//table building functions.
function insertAllRows(database = allTouristPlaces) {
    let tbody = $('tbody');
    for (let touristPlace of database) {
        let row = createARow(touristPlace);
        tbody.append(row);
    }
    $('.update').click(updateTouristPlace);
    $('.delete').click(deleteTouristPlace);
}

function deleteAllRows(){
    $('tbody tr').remove();
}

function createARow(touristPlace) {
    console.log("creating a row based on the touristPlace = ");
    console.log(touristPlace);
    return `<tr><td class="hidden">${touristPlace.id}</td><td>${touristPlace.name}</td><td>${touristPlace.address}</td><td>${touristPlace.rating}</td><td><img src="${touristPlace.picture}"></td><td class="cell-button"><button class="blue update">Update</button><button class="red delete">Delete</button></td></tr>`
}

function rebuildTable(database = allTouristPlaces) {
    deleteAllRows();
    insertAllRows(database);
}
//end of table building functions