var modal = document.getElementById('menu-form');
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    document.getElementById('menu-form').style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        document.getElementById('menu-form').style.display = "none";
    }
}

// Function to display burger types
function displayBurgerTypes() {
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

function updateTypes(selectedMenuItem) {
    if (selectedMenuItem === 'burger') {
        displayBurgerTypes();
        centerForm();
    }
    else if (selectedMenuItem === 'bucketChicken') {
        displayChickenBucketTypes();
        centerForm();
    }
}

function addToCart() {
    console.log("test");
}

function showForm() {
    document.getElementById('menu-form').style.display = 'block';
    $("#menu").trigger("change");
}

function centerForm() {
    // After adding images, reposition the form to the center
    document.getElementById('menu-form')
}

jQuery(document).ready(function () {
    $("#open-dialog-form").click(function () {
        showForm();
    });
    $("#menu").on("change", function () {
        updateTypes($(this).val());
    });
    $("#info-form-inner").submit(function (event) {
        event.preventDefault();

        var form = $(this);

        $.ajax({
            type: "POST",
            url: "<?php echo get_rest_url(null, 'v1/referral_link/submit'); ?>",
            data: form.serialize(),
            success: function (res) {
                form.hide();
                $("#form_success").html(res).fadeIn();
            },
            error: function () {
                $("#form_error").html("There was an error in submitting your form.").fadeIn();
            }
        })
    });
});