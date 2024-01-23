<?php
    // include("referral_link.html");
?>

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