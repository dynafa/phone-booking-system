$(document).ready(function() {
    //-------------------------------------------------
    // Process form when users click "submit" button.
    $('form').submit(function (e) {
        //Prevent the default behavour/action: send form out to server.
        e.preventDefault();
        //Get the entered values: in "name" and "email" fields
        var name = $('input#name').val();
        var email = $('input#email').val();
        //Validate form before submitting
        if (name === "" || name == null) {
            //alert("Please enter your name!");
            // Append an error message below (after) the field "name"
            $('input#name').after('<p class="error_message">Please enter your name!</p>');
            return false;
        }
        if (email === "" || email == null) {
            //alert("Please enter your email!");
            // Append an error message below (after) the field "name"
            $('input#email').after('<p class="error_message">Please enter your email!</p>');
            return false;
        }
        //NO ERROR --> Save the invoice to dbIndexed database
        alert("Save into dbIndexed: Name: " + name + ". Email: " + email);
        //Open a new webpage to display the invoice
        displayInvoice(name, email);
    });
    //-------------------------------------------------
    // Click "reset" button
    $('#btnReset').click(function () {
        $('p.error_message').hide();
        //Hide all error message
    });
    //-------------------------------------------------
    // Use "focus" and "blur" to each form element (input).
    // When the input is "focus" or on entering data, change background color to "pink"
    // Select input element of type text
    $('input:text').focus(function () {
        $(this).css('background', 'pink');
        //change background color to "pink"
        $('p.error_message').hide();
        //Hide all error message
    });
    $('input#email').focus(function () {
        $(this).css('background', 'pink');
        //change background color to "pink"
        $('p.error_message').hide();
        //Hide all error message });
        // 'When users complete and leave the input element, change the background back to "white"
        // Select input element of type text
        $(':text').blur(function () {
            $(this).css('background', 'white');
        });
        $('input#email').blur(function () {
            $(this).css('background', 'white');
        });
        //-------------------------------------------------
        // When users complete and leave the "input" element, hide all error message
        $('input').keyup(function (e) {
            $('p.error_message').hide();
            //Hide all error message
        });
    });

    //-----------------------------------------------------------------------------------
    function displayInvoice(name, email) {
        //Open a "blank" webpage
        let invoiceWindow = window.open('', '_blank');
        letuserName = name;
        letuserEmail = email;
        //Write invoice info in "html" format on this blank page: "head" section
        invoiceWindow.document.write(
            `
            <html>
                <head>
                    <title>Booking Invoice</title>
                    <link rel="stylesheet"href="css/style.css">
                </head>                `
        );
        //Write the "body" section
        invoiceWindow.document.write(
            `
            <body>
                <div class="container">
                    <ul>
                        <li>Name: ${userName}</li>
                        <li>Email: ${userEmail}</li>
                    </ul>
                </div>
            </body>
            </html>                
            `
        );
    }
});