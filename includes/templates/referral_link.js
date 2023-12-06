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
function showForm() {
    document.getElementById('menu-form').style.display = 'block';
}
jQuery(document).ready(function () {
    $("#open-dialog-form").click(function () {
        showForm();
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