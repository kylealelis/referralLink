<div id="form_success" style="background:green, color=#fff"></div>
<div id="form_error" style="background:red, color=#fff"></div>

<form id="info-form">

    <?php wp_nonce_field('wp_rest'); ?>

    <label>Name</label>
    <input type="text" name="nameInput"><br>

    <label>Email</label>
    <input type="text" name="emailInput"><br>

    <label>Phone</label>
    <input type="text" name="phoneInput"><br>

    <label>Your Message</label>
    <textarea name="messageInput"></textarea><br>

    <button type="submit">Submit form</button>
</form>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script>
    jQuery(document).ready(function ($) {
        $("#info-form").submit(function (event) {
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
</script>