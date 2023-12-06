//Array to store selected items
var cartItems = [];

//Function when the Jollibee text is clicked
function showMenuDialog() 
{
    $("#menu-dialog-form").dialog({
        modal: true,
        width: 'auto',
        height: 'auto',
        show: {
            effect: "fade",
            duration: 300
        },
        hide: {
            effect: "fade",
            duration: 300
        },
    });

    //Close the cart dialog when the back button is clicked
    // Check if the dialog is initialized before trying to close it
    if ($("#cart-dialog").hasClass('ui-dialog-content') && $("#cart-dialog").dialog('isOpen')) 
    {
        $("#cart-dialog").dialog("close");
    }

    // Trigger the change event to update types based on the initial menu selection
    $("#menu").trigger("change");
}

// Function to show the cart dialog after clicking Next button
function showCartDialog()
{
    var selectedMenuItem = $("#menu").val();
    
    // Get all selected types and prices
    var selectedItems = $(".image-checkbox:checked").map(function () {
        var type = $(this).data("type");
        var price = getPrice(selectedMenuItem, type);
        return { item: selectedMenuItem, type: type, price: price };
    }).get();

    if (selectedItems.length === 0) {
        // Display an error message if no types are selected
        alert("Please select at least one item before proceeding.");
        return;
    }
        
    if (selectedMenuItem) 
    {
        // Close the menu dialog form
        $("#menu-dialog-form").dialog("close");
        
        // Clear the previous cart content
        $("#cart-items").empty();

        // Display each item in the cart
        for (var i = 0; i < cartItems.length; i++) {
            // Create a div for each cart item
            var cartItemDiv = $('<div class="cart-item-box"></div>');

            // Create an image element for the cart item
            var cartItemImage = $('<img class="cart-item-image">');
            cartItemImage.attr('src', getImageURL(cartItems[i].item, cartItems[i].type));

            // Append the image to the cart item div
            cartItemDiv.append(cartItemImage);

            // Append the price to the cart item div
            cartItemDiv.append('<p>' + cartItems[i].item + ' - ' + cartItems[i].type + ' - Php' + cartItems[i].price.toFixed(2) + '</p>');

            // Append the cart item div to the cart items grid
            $("#cart-items").append(cartItemDiv);
        }

        // Show the cart dialog
        $("#cart-dialog").dialog({
            modal: true,
            width: 'auto',
            height: 'auto',
            show: {
                effect: "fade",
                duration: 300
            },
            hide: {
                effect: "fade",
                duration: 300
            },
        });

        // Display the total price
        var totalPrice = calculateTotalPrice();
        $("#cart-items").append('<p>Total: Php' + totalPrice.toFixed(2) + '</p>');

    }
}

// Function to show the Guest Details dialog form after clicking Next button
function showDetailsForm() 
{
    var selectedMenuItem = $("#menu").val();

    if (selectedMenuItem) {
        // Close the menu dialog form
        $("#cart-dialog").dialog("close");

        // Show the details form
        $("#guest-dialog-form").dialog({
            modal: true,
            width: 'auto',
            height: 'auto',
            show: {
                effect: "fade",
                duration: 300
            },
            hide: {
                effect: "fade",
                duration: 300
            },
        });
    } else {
        alert("Please select an item from the menu.");
    }
}

// Function to submit the form data (you can customize this function)
function submitOrder() 
{
    // Validate the form before submitting
    if (validateForm()) 
    {
        // Form data is valid, proceed with the submission
        var formData = $("#myForm").serialize();

        // Include cart items in the form data
        formData += "&cartItems=" + encodeURIComponent(JSON.stringify(cartItems));

        // Add your AJAX request or form submission logic here
        $.ajax({
            type: "POST",
            url: "send_email.php",
            data: formData, // Serialize form data
            success: function (response) {
                console.log(formData);
                // Display thank you dialog or handle success
                // Close the menu dialog form
                $("#guest-dialog-form").dialog("close");
                // Show Thank-you dialog
                $("#thankyou-form").dialog({
                    modal: true,
                    width: 'auto',
                    height: 'auto',
                    show: {
                        effect: "fade",
                        duration: 300
                    },
                    hide: {
                        effect: "fade",
                        duration: 300
                    },
                });
            },
            error: function (error) {
                // Handle errors
                alert("An error occurred. Please try again.");
            }
        });
    }
}

// Function to validate the form data whether the inputs has correct format
function validateForm() {
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var contactNumber = $("#contactNumber").val();
    var address = $("#address").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var zip = $("#zip").val();

    // Validate other fields as needed
    if (!isValidName(firstName)) {
        alert("Invalid first name format");
        return false;
    }

    if (!isValidName(lastName)) {
        alert("Invalid last name format");
        return false;
    }

    if (firstName.trim() === '' || 
        lastName.trim() === '' || 
        email.trim() === '' || 
        contactNumber.trim() === '' || 
        address.trim() === '' ||
        city.trim() === '' ||
        state.trim() === '' ||
        zip.trim() === '') {
        alert("Please fill in all fields.");
        return false;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        if ($("#email + .error-message").length === 0) {
            $("#email").after('<div class="error-message">Invalid email format</div>');
        }
        return false;
    } else {
        $("#email + .error-message").remove();
    }

    // Validate contact number format
    if (!isValidContactNumber(contactNumber)) {
        alert("Invalid contact number format");
        return false;
    }

    // Add check signs to the input fields
    addCheckSign("firstName");
    addCheckSign("lastName");
    addCheckSign("email");
    addCheckSign("contactNumber");
    addCheckSign("address");
    addCheckSign("city");
    addCheckSign("state");
    addCheckSign("zip");

    return true;
}

// Function to add a check sign to the input field
function addCheckSign(fieldId) 
{
    // Check if a check sign already exists
    if ($("#" + fieldId + " + .check-sign").length === 0) {
        $("#" + fieldId).after('<span class="check-sign">&#10004;</span>');
    }
}

// Function to validate contact number format
function isValidContactNumber(contactNumber)
{
    // Use a regular expression to check if the contact number contains only numeric characters
    var contactNumberRegex = /^[0-9]+$/;
    return contactNumberRegex.test(contactNumber);
}

// Function to validate email format using regular expression
function isValidEmail(email) 
{
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

// Function to validate name format
function isValidName(name) 
{
    var nameRegex = /^[a-zA-Z ]*$/;
    return nameRegex.test(name);
}

// Function to update types based on the selected menu item
function updateTypes(selectedMenuItem) 
{
    if(selectedMenuItem === 'burger')
    {
        displayBurgerTypes();
        centerForm();
    }
    else if (selectedMenuItem === 'bucketChicken') 
    {
        displayChickenBucketTypes();
        centerForm();
    }
}

// Function to display burger types
function displayBurgerTypes() 
{
    var typesHtml = '<div id="typeContainerInner" class="image-grid">';

    // Define burger types
    var burgerTypes = [
        { name: 'yumburger', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/32daacbe-753a-4a11-b7b2-e1254ddf94e3.png', price: 40.00 },
        { name: 'cheesyyumburger', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/c8e4dd5f-d1ed-45e1-931c-a59873ea2b7e.png', price: 69.00 },
        { name: 'baconcheesyyumburger', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/f6129bbb-80a7-4080-8c9d-4010498fee3b.png', price: 96.00 },
        { name: 'champjr', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/0788c224-3baa-44a9-a1e0-41534e5dff00.png', price: 105.00 },
        { name: 'champ', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/315af317-e0b3-4c15-a077-68a6677999e8.png', price: 179.00 },
        { name: 'alohachamp', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/6044c673-2529-412f-87b6-d2a1e482266c.png', price: 246.00 }
        
        // Add more burger types as needed
    ];

    // Display each chicken bucket type as an image with a checkbox
   burgerTypes.forEach(function (burgerType) {
        typesHtml += '<div class="image-item-box">';
        typesHtml += '<input type="checkbox" class="image-checkbox" data-type="' + burgerType.name.toLowerCase() + '">';
        typesHtml += '<img class="image-item-image" src="' + burgerType.image + '" alt="' + burgerType.name + '">';
        typesHtml += '<p>' + burgerType.name + ' - Php' + burgerType.price.toFixed(2) + '</p>'; // Display price
        typesHtml += '</div>';
    });

    typesHtml += '</div>';

    // Append the types to the menu dialog form
    $("#itemTypeContainer").html(typesHtml);
}

// Function to display chicken bucket types
function displayChickenBucketTypes() 
{
    var typesHtml = '<div id="typeContainerInner" class="image-grid">';

    // Define chicken bucket types
    var chickenBucketTypes = [
        { name: '8pcbucket', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/1dbe4c35-87bb-49b2-958b-8130485f4bba.png', price: 549.00 },
        { name: '6pcbucket', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/1dbe4c35-87bb-49b2-958b-8130485f4bba.png', price: 449.00 },
        { name: '4pcbucket', image: 'https://jb-ph-cdn.tillster.com/menu-images/prod/e39c15e2-e026-4676-be4d-f645c9c1887d.png', price: 326.00 }
        // Add more chicken bucket types as needed
    ];

    // Display each chicken bucket type as an image with a checkbox
    chickenBucketTypes.forEach(function (chickenBucketType) {
        typesHtml += '<div class="image-item-box">';
        typesHtml += '<input type="checkbox" class="image-checkbox" data-type="' + chickenBucketType.name.toLowerCase() + '">';
        typesHtml += '<img class="image-item-image" src="' + chickenBucketType.image + '" alt="' + chickenBucketType.name + '">';
        typesHtml += '<p>' + chickenBucketType.name + ' - Php' + chickenBucketType.price.toFixed(2) + '</p>'; // Display price
        typesHtml += '</div>';
    });

    typesHtml += '</div>';

    // Append the types to the menu dialog form
    $("#itemTypeContainer").html(typesHtml);
}

// Function to get the image path based on the selected item and type
function getImageURL(item, type) 
{
    // Define a mapping of item and type combinations to image URLs
    var imageMapping = {
        'burger_yumburger': 'https://jb-ph-cdn.tillster.com/menu-images/prod/32daacbe-753a-4a11-b7b2-e1254ddf94e3.png',
        'burger_cheesyyumburger': 'https://jb-ph-cdn.tillster.com/menu-images/prod/c8e4dd5f-d1ed-45e1-931c-a59873ea2b7e.png',
        'burger_baconcheesyyumburger': 'https://jb-ph-cdn.tillster.com/menu-images/prod/f6129bbb-80a7-4080-8c9d-4010498fee3b.png',
        'burger_champjr': 'https://jb-ph-cdn.tillster.com/menu-images/prod/0788c224-3baa-44a9-a1e0-41534e5dff00.png',
        'burger_champ': 'https://jb-ph-cdn.tillster.com/menu-images/prod/315af317-e0b3-4c15-a077-68a6677999e8.png',
        'burger_alohachamp': 'https://jb-ph-cdn.tillster.com/menu-images/prod/6044c673-2529-412f-87b6-d2a1e482266c.png',
        // Add more entries as needed
        'bucketchicken_8pcbucket': 'https://jb-ph-cdn.tillster.com/menu-images/prod/1dbe4c35-87bb-49b2-958b-8130485f4bba.png',
        'bucketchicken_6pcbucket': 'https://jb-ph-cdn.tillster.com/menu-images/prod/1dbe4c35-87bb-49b2-958b-8130485f4bba.png',
        'bucketchicken_4pcbucket': 'https://jb-ph-cdn.tillster.com/menu-images/prod/e39c15e2-e026-4676-be4d-f645c9c1887d.png',
    };

    // Generate a key for the mapping
    var key = item.toLowerCase() + '_' + type.toLowerCase();

    // Check if the key exists in the mapping
    if (imageMapping.hasOwnProperty(key)) {
        return imageMapping[key];
    } else {
        // If no specific image found, provide a default image or handle it as needed
        return 'https://example.com/images/default.jpg';
    }
}

// Function to add selected item and type to the cart
function addToCart() 
{
    // Check if the selected menu item
    var selectedMenuItem = $("#menu").val();

    // Get all selected types and prices
    var selectedItems = $(".image-checkbox:checked").map(function () {
        var type = $(this).data("type");
        var price = getPrice(selectedMenuItem, type); // Add a function to get the price
        return { item: selectedMenuItem, type: type, price: price };
    }).get();

    if (selectedItems.length === 0) {
        // Display an error message if no types are selected
        alert("Please select at least one item to add to the cart.");
        return;
    }

    // Add the selected items and types to the cartItems array
    cartItems = cartItems.concat(selectedItems);

    // Display the selected items in the cart
    displayCart();
}

// Function to display the selected items in the cart
function displayCart() {
    // Clear the previous cart content
    $("#cart").empty();
    
    // Display each item in the cart with a remove button
    for (var i = 0; i < cartItems.length; i++) {
        var cartItemDiv = $('<div class="cart-item-box"></div>');

        var cartItemImage = $('<img class="cart-item-image">');
        cartItemImage.attr('src', getImageURL(cartItems[i].item, cartItems[i].type));

        cartItemDiv.append(cartItemImage);
        cartItemDiv.append('<p>' + cartItems[i].item + ' - ' + cartItems[i].type + ' - Php' + cartItems[i].price.toFixed(2) + '</p>');

        // Add a remove button with a data attribute for index
        var removeButton = $('<button class="remove-item" data-index="' + i + '">Remove</button>');

        cartItemDiv.append(removeButton);
        $("#cart").append(cartItemDiv);
    }

    // Bind the click event to the remove buttons
    $(".remove-item").on("click", function (event) {
        event.stopPropagation(); // Stop the click event from propagating to parent elements
        var index = $(this).data("index");
        removeCartItem(index);
    });

    // Display the total price
    var totalPrice = calculateTotalPrice();
    $("#cart").append('<p>Total: Php' + totalPrice.toFixed(2) + '</p>');
}

// Function to calculate the total price of items in the cart
function calculateTotalPrice() {
    var totalPrice = cartItems.reduce(function (total, item) {
        return total + item.price;
    }, 0);
    return totalPrice;
}

// Function to get the price based on the selected item and type
function getPrice(item, type) 
{
    // Define a mapping of item and type combinations to prices
    var priceMapping = {
        'burger_yumburger': 40.00,
        'burger_cheesyyumburger': 69.00,
        'burger_baconcheesyyumburger': 96.00,
        'burger_champjr': 105.00,
        'burger_champ': 179.00,
        'burger_alohachamp': 246.00,
        // Add more entries as needed
        'bucketchicken_8pcbucket': 549.00,
        'bucketchicken_6pcbucket': 449.00,
        'bucketchicken_4pcbucket': 326.00,
    };

    // Generate a key for the mapping
    var key = item.toLowerCase() + '_' + type.toLowerCase();

    // Check if the key exists in the mapping
    if (priceMapping.hasOwnProperty(key)) {
        return priceMapping[key];
    } else {
        // If no specific price found, provide a default price or handle it as needed
        return 0.00;
    }
}

// Function to view the cart
function viewCart() 
{
    // Clear the previous cart content
    $("#cart-items").empty();

    // Display each item in the cart
    for (var i = 0; i < cartItems.length; i++) {
        // Create a div for each cart item
        var cartItemDiv = $('<div class="cart-item-box"></div>');

        // Create an image element for the cart item
        var cartItemImage = $('<img class="cart-item-image">');
        cartItemImage.attr('src', getImageURL(cartItems[i].item, cartItems[i].type));

        // Append the image to the cart item div
        cartItemDiv.append(cartItemImage);

        // Append the cart item div to the cart items grid
        $("#cart-items").append(cartItemDiv);
    }

    // Open the cart dialog
    $("#cart-dialog").dialog({
        modal: true,
        width: 'auto',
        height: 'auto',
        show: {
            effect: "fade",
            duration: 300
        },
        hide: {
            effect: "fade",
            duration: 300
        },
    });
}

// Function to close the cart dialog
function closeCart() 
{
    $("#cart-dialog").dialog("close");
}

// Function to refresh the page
function refreshPage() 
{
    location.reload(true); // Reload the page with a hard refresh (bypassing the cache)
    // Close the thank you dialog form
    $("#thankyou-form").dialog("close");
}

function removeCartItem(index) {
    // Remove the item at the specified index
    cartItems.splice(index, 1);

    // Redisplay the updated cart
    displayCart();
}

function centerForm() {
    // After adding images, reposition the form to the center
    $("#menu-dialog-form").dialog("option", "position", { my: "center", at: "center", of: window });
}

// Document ready function
$(document).ready(function () 
{
    // Add the change event listener for menu selection
    $("#menu").on("change", function () {
        updateTypes($(this).val());
    });

    //hide the menu, guest details, thank you form first
    $("#thankyou-form, #guest-dialog-form, #menu-dialog-form").hide();
    
    // Attach click event when jollibee is clicked
    $("#open-dialog-text").click(function () 
    {
        showMenuDialog();
    });

    // Add event listeners for input validation
    $("#firstName").on("input", function() {
        if ($(this).val().trim() !== '' && isValidName($(this).val().trim())) {
            addCheckSign("firstName");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#lastName").on("input", function() {
        if ($(this).val().trim() !== '' && isValidName($(this).val().trim())) {
            addCheckSign("lastName");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#email").on("input", function() {
        var email = $(this).val();
        if (isValidEmail(email)) {
            addCheckSign("email");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#contactNumber").on("input", function () {
        var contactNumber = $(this).val();
        if (isValidContactNumber(contactNumber)) {
            addCheckSign("contactNumber");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#address").on("input", function() {
        if ($(this).val().trim() !== '') {
            addCheckSign("address");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#city").on("input", function() {
        if ($(this).val().trim() !== '') {
            addCheckSign("city");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#state").on("input", function() {
        if ($(this).val().trim() !== '') {
            addCheckSign("state");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    $("#zip").on("input", function() {
        if ($(this).val().trim() !== '') {
            addCheckSign("zip");
        } else {
            $("#" + $(this).attr("id") + " + .check-sign").remove();
        }
    });

    // Event listener for remove buttons in the cart
    $(document).on("click", ".remove-item", function () {
        var index = $(this).data("index");
        removeCartItem(index);
    });

});