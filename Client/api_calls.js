// defining all the API call functions
function getAllTouristPlaces() {
    let URL = "https://localhost:7243/api/touristplace/getalltouristplaces";

    $.ajax({
        url: URL,
        type: 'GET',
        contentType: 'application/json;',
        success: function (result) {
            rebuildTable(result);
        },
        error: function () {
            debugger;
            alert("Something went wrong!");
        }
    });
}

function searchFunctionality(event) {
    let searchedText = $(event.target).val().trim();
    let URL = `https://localhost:7243/api/touristplace/getalltouristplaces?searchedText=${searchedText}`;

    $.ajax({
        url: URL,
        type: 'GET',
        contentType: 'application/json;',
        success: function (result) {
            rebuildTable(result);
        },
        error: function () {
            debugger;
            alert("Something went wrong!");
        }
    });
}

function createTouristPlace(touristPlace) {
    let URL = "https://localhost:7243/api/TouristPlace/InsertTouristPlace";
    touristPlace = JSON.stringify(touristPlace);
    $.ajax({
        url: URL,
        contentType: "application/json",
        data: touristPlace,
        type: "POST",
        success: (result) => {
            window.location.reload();
        },
        error: (xhr, status, error) => {
            alert(xhr.responseText);
        }
    })
}

function deleteTouristPlace(event) {
    if(confirm("Are you sure to delete this row?") == true)
    {   
        let Id =  $(event.target).parent().parent().children().eq(0).html();
        let URL = `https://localhost:7243/api/touristplace/DeleteTouristPlace/${Id}`;
        $.ajax({
            url: URL,
            type: "DELETE",
            success: (result) => {
                console.log(result);
                window.location.reload();
            },
            error: (xhr, status, error) => {
                console.log("error => ", error);
                console.log("status => ", status);
            },
            complete: () => {
                console.log("Get touristPlace by ID API call is complete")
            }
        })
    }
}

function updateExistingOne(touristPlace) {
    let URL = "https://localhost:7243/api/TouristPlace/UpdateTouristPlace";

    $.ajax({
        url: URL,
        contentType: "application/json",
        type: "PATCH",
        data: JSON.stringify(touristPlace),
        success: (result) => {
            window.location.reload();
        },
        error: (xhr, status, error) => {
            alert(xhr.responseText);
        }
    })
}

function updateTouristPlace(event) {
    let Id = $(event.target).parent().parent().children().eq(0).text();
    let URL = `https://localhost:7243/api/touristplace/GetTouristPlaceById/${Id}`;
    $.ajax({
        url: URL,
        type: "GET",
        success: (result) => {
            console.log(result);
            let touristPlace = result;
            $('#id').val(touristPlace.id);
            nameInput.val(touristPlace.name);
            addressInput.val(touristPlace.address);
            ratingInput.val(touristPlace.rating);
            typeInput.val(touristPlace.type);

            createPreviewPicture(touristPlace.picture);
            setDynamicHeadingAndSubmitButton();
            showCreatePage();
        },
        error: (xhr, status, error) => {
            alert(xhr.responseText);
        }
    })
}

function sortRowsAjaxCall(URL) {
    $.ajax({
        url: URL,
        type: "GET",
        contentType: "application/json",
        success: (result) => {
            rebuildTable(result);
        },
        error: (xhr, status, error) => {
            alert(xhr.responseText);
        }
    })
}