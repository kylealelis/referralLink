<style>
    .modal {
        display: none;
        /* Hidden by default */
        position: fixed;
        /* Stay in place */
        z-index: 1;
        /* Sit on top */
        left: 0;
        top: 0;
        width: 100%;
        /* Full width */
        height: 100%;
        /* Full height */
        overflow: auto;
        /* Enable scroll if needed */
        background-color: rgb(0, 0, 0);
        /* Fallback color */
        background-color: rgba(0, 0, 0, 0.4);
        /* Black w/ opacity */
        -webkit-animation-name: fadeIn;
        /* Fade in the background */
        -webkit-animation-duration: 0.4s;
        animation-name: fadeIn;
        animation-duration: 0.4s
    }

    .modal-content {
        position: fixed;
        bottom: 0;
        background-color: #fefefe;
        width: 100%;
        -webkit-animation-name: slideIn;
        -webkit-animation-duration: 0.4s;
        animation-name: slideIn;
        animation-duration: 0.4s
    }

    .close {
        color: red;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }
</style>

<div id="form_success" style="background:green, color=#fff"></div>
<div id="form_error" style="background:red, color=#fff"></div>

<div id="info-form" class="modal">
    <form id="info-form-inner" class="modal-content">
        <div class="modal-header">
            <span class="close">&times;<br></span>
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
        </div>
    </form>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script>
    var modal = document.getElementById('info-form');
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        document.getElementById('info-form').style.display = 'none';
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            document.getElementById('info-form').style.display = "none";
        }
    }
    function showForm() {
        document.getElementById('info-form').style.display = 'block';
    }
    jQuery(document).ready(function ($) {
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
</script>