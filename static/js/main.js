    // Import .format() function
    String.prototype.format = function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
        });
    };

    // Will create a Jquery-UI datepicker for the given input fields
    $( function() {
        $( "#Purchasedate" ).datepicker();
        $( "#Repairdate" ).datepicker();
    } );

    // Declaration of relevant ID values in the document
    var formvalues = [
        "Firstname",
        "Lastname",
        "street_number",
        "route",
        "locality",
        "administrative_area_level_1",
        "country",
        "postal_code",
        "Phonenumber",
        "Email",
        "Purchasedate",
        "Repairdate",
        "Warranty",
        "IMEInumber",
        "Make",
        "Modelnumber",
        "Faultcategory",
        "Description",
        "Bond",
        "Servicefee",
        "Total",
        "GST",
        "TotalplusGST",
        "Phonelist"
    ];
    // Declaration of ID values in the document that are required
    var required = [
        "Customer",
        "Firstname",
        "Lastname",
        "street_number",
        "route",
        "locality",
        "country",
        "Phonenumber",
        "Email",
        "IMEInumber",
        "Make",
        "Faultcategory",
        "Description",
    ];

    // Object literal declarations
    var warrantyStatus = {};
    var firstname = {};
    var lastname = {};
    var postcode = {};
    var phnum = {};
    var email = {};
    var IMEInumber = {}
    var purchaseDate = $("#{0}".format("Purchasedate"));
    var repairDate = $("#{0}".format("Repairdate"));

    // Object literal declaration and object assoications to the date validation function
    var date = {};
    var form = {};
    form.haserror = true;
    date.currentdate = new Date();
    date.purchaseDateconverted = null;
    date.repairDateconverted = null;
    date.purchaseDatevalid = false;
    date.repairDatevalid = false;

    // Regex expressions for validation of general fields
    date.regex = "^(0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01])[\\/\\-]\\d{4}$";
    firstname.regex = /^[A-Za-z\-]+[a-zA-Z]$/;
    postcode.regex = /^\d\d\d\d$/;
    IMEInumber.regex = /^\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d$/;
    phnum.regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    email.regex = "[a-zA-Z-_0-9]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    //Error messages displayed when validation fails
    firstname.error_message = "Names can only be letters and hyphens";
    postcode.error_message = "Postcodes can be 4 digits only";
    IMEInumber.error_message = "IMEI numbers can be 15 digits only";
    phnum.error_message = "Phone enter a valid phone number";
    email.error_message = "Please enter a valid email address";

    //Placeholder values for error IDs
    firstname.error_id = "firstname_error";
    lastname.error_id = "lastname_error";
    postcode.error_id = "postcode_error";
    IMEInumber.error_id = "IMEInum_error";
    phnum.error_id = "Phonenumber_error";
    email.error_id = "Email_error";

    //References values for IDs of inputs in forms
    firstname.DOM_id = "Firstname";
    lastname.DOM_id = "Lastname";
    postcode.DOM_id = "postal_code";
    IMEInumber.DOM_id = "IMEInumber";
    phnum.DOM_id = "Phonenumber";
    email.DOM_id = "Email";

    //Functions resets all input values to nothing, also toggles customer type back to default
    function resetForms() {
        for (i = 0; i < formvalues.length; i++) {
            setValue(formvalues[i])
        }
        document.getElementById("Business").checked = false;
        document.getElementById("Customer").checked = true;
        removeAllErrors();
    }

    //Basic getter funct
    function getValue(foo) {
        return document.getElementById(foo).value;
    }

    //Basic setter funct
    function setValue(foo) {
        document.getElementById(foo).value = null;
    }

    //Emunerate all input fields and find blanks, for every blank post an error message
    function findBlankInputs() {
        var a;
        for (i = 0; i < required.length; i++) {
            a = getValue(required[i]);
            var error = $("#blank_error{0}".format(i));
            if (error) {
                error.remove();
            }
            if (a === "" || a == null) {
                $('#{0}'.format(required[i]))
                    .after('<a id="blank_error{0}">Input cannot be blank</a>'.format(i))
            }
        }
    }

    // Function to validate if the dates have been entered correctly
    function validateDates() {
        // Intially, the validity is assume to be false
        date.repairDatevalid = false;
        date.purchaseDatevalid = false;
        // Declaration of the validation function
        var validate = function (value) {
            // Evaluation
            let result = value.match(date.regex);
            // If the input matches the regex, then proceed
            return !!result;
        };
        // Call to function which removes all error divs on the page
        // (Had issues with them adding an error message each time the error was found without deleting the previous one)
        removeAllDateErrors();
        // Checks if the input field has been filled already
        if (purchaseDate.val() !== null) {
            // Checks if the date entered is actually valid
            if (validate(purchaseDate.val())) {
                // Upon validation success, the date is converted to a JS Date object format for later comparison
                date.purchaseDateconverted = new Date(purchaseDate.val());
                // Checks if the date is in the future
                if (date.currentdate < date.purchaseDateconverted) {
                    // If is in future, then sets the form.haserror value to false, preventing the form being sent
                    form.haserror = true;
                    // Throw error to user
                    purchaseDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 0, "Date cannot be in the future"));
                } else {
                    // Else, the date passed all tests, flag set to true
                    date.purchaseDatevalid = true;
                }
            } else {
                // Otherwise, the date was found to be in the wrong format
                form.haserror = true;
                // Inform the user
                purchaseDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 1, "Invalid date format"));
            }
        } else {
            // This error happens when the input field is totally blank
            form.haserror = true;
            // Inform the user
            repairDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 2, "Input cannot be blank"));
        }
        // Same process repeated for second date input field
        if (repairDate.val() !== null) {
            if (validate(repairDate.val())) {
                date.repairDateconverted = new Date(repairDate.val());
                if (date.currentdate < date.repairDateconverted) {
                    form.haserror = true;
                    repairDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 3, "Date cannot be in the future"));
                } else {
                    date.repairDatevalid = true;
                }
            }
            else {
                form.haserror = true;
                repairDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 4, "Invalid date format"));
            }
        } else {
            form.haserror = true;
            repairDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 5, "Input cannot be blank"));
        }
        // Checks that both dates are valid, and also checks that the purchase date is after the repair, making it invalid
        if ((date.purchaseDatevalid && date.repairDatevalid) && date.purchaseDateconverted > date.repairDateconverted ) {
            // Set flag to true, submission can't proceed
            form.haserror = true;
            // Inform the user
            repairDate.after("<a id='{0}{1}'>{2}</a>".format("Date_error", 6, "Purchase date cannot be after repair date"));
        }
        // Else all checks have passed
        else {
            // Form has no error
            form.haserror = false;
            //Calculates one day
            var one_day = 1000 * 60 * 60 * 24;
            // To Calculate the result in milliseconds and then converting into days
            var result = Math.round(date.repairDateconverted.getTime() - date.purchaseDateconverted.getTime()) / (one_day);
            // To remove the decimals from the (Result) resulting days value
            warrantyStatus.time = result.toFixed(0);
        }
    }
    // Validates warranty based on the outcome of the date validation
    function validateWarranty() {
        // Find warranty ele in doc
        warrantyStatus.element = document.getElementById("Warranty");
        // Ensures both dates are valid
        if (date.purchaseDatevalid && date.repairDatevalid) {
            // Checks that the phone hasn't been purchased more than 24 months ago
            if (warrantyStatus.time > (365 * 2)) {
                // If greater than 24 months, then warranty is void
                warrantyStatus.element.checked = false;
            } // Otherwise warranty is still good
            else {
                warrantyStatus.element.checked = true;
            }
        }

    }
    // Function to remove all date errors
    function removeAllDateErrors() {
        for (i = 0; i < 7; i++) {
            var error = $("#Date_error{0}".format(i));
            if (error) {
                error.remove();
            }
        }
    }
    // Remove all errors from the page except for date errors
    function removeAllErrors() {
         for (i = 0; i < required.length; i++) {
             a = getValue(required[i]);
             var error = $("#blank_error{0}".format(i));
             if (error) {
                 error.remove();
             }
         }

    }

        /*This function optimizes the code required to validate the 6 different fields
        that all have different regex and error output values. There would otherwise be 6 repeated functions
        with different local variables to obtain different outputs.
        */
        function validateField(DOM_id, RegexStr, Error_id, Error_message) {
            var element = $("#{0}".format(DOM_id));
            const validate = function (value) {
                // Evaluation
                let result = value.match(RegexStr);
                // If the input matches the regex, then proceed
                return !!result;
            };
            var error = $("#{0}".format(Error_id));
            if (error) {
                error.remove();
            }
            if (element.val() !== "" && !validate(element.val())) {
                element.after("<a id='{0}'>{1}</a>".format(Error_id, Error_message));
                form.haserror = true;
            }
        }
        // Declaration for variables used by the Courtesy phone section
        var phonetype = $("#{0}".format("Phonelist"));
        var courtesyPhone = {};
        courtesyPhone.phonecost = "";
        courtesyPhone.chargercost = 30;
        courtesyPhone.totalcost = 0;
        courtesyPhone.customerType = "";
        courtesyPhone.added = false;
        var totalcost = {};
        totalcost.servicefee = 85;

        // Function to add courtesy phone
        function addCourtesyphone() {
            if (!courtesyPhone.added) {
                // Checks what phonetype is selected, sets price accordingly
                if (phonetype.val() === "iPhone") {
                    courtesyPhone.phonecost = 275;
                } else {
                    courtesyPhone.phonecost = 100;
                }
                // Sets total cose
                courtesyPhone.totalcost = courtesyPhone.chargercost + courtesyPhone.phonecost;
                // Add row to div
                appendTable(phonetype.val(), courtesyPhone.phonecost);
                // Add row to div
                appendTable("Charger", courtesyPhone.chargercost);
                // Call function to calculate cost and fill in last section
                calculateCosts();
                // Set phoneadded flag to true
                courtesyPhone.added = true;
            }
        }
    // Basic function to append rows to table element
    function appendTable(name, value) {
        var table = document.getElementById("Courtesyphonetable");
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = name;
        cell2.innerHTML = value;
    }
    // Function to calculate all costs for courtesy phone
    function calculateCosts() {
        // Checks customer type
        if (document.getElementById("Customer").checked) {
            totalcost.costs = courtesyPhone.totalcost;
            if (!document.getElementById("Warranty").checked) {
                document.getElementById("Servicefee").value = "$" + totalcost.servicefee.toFixed(2);
                totalcost.costs += totalcost.servicefee;
            } else {
                document.getElementById("Servicefee").value = "$" + "0.00";
            }
            // Calculates GST based on total cost
            totalcost.gst = totalcost.costs * 0.15;
            // Creates object value to store calculated cost
            totalcost.totalwithgst = totalcost.costs + totalcost.gst;
            // Convert all values into $x.xx format
            document.getElementById("Bond").value = "$" + courtesyPhone.totalcost.toFixed(2);
            document.getElementById("Total").value = "$" + totalcost.costs.toFixed(2);
            document.getElementById("GST").value = "$" + totalcost.gst.toFixed(2);
            document.getElementById("TotalplusGST").value = "$" + totalcost.totalwithgst.toFixed(2);
        } // Else if customer type is business, fill all fields with $0.00
        else {
            var list = ["Bond", "Total", "GST", "Servicefee", "TotalplusGST"];
            // Iterate through list
            for (var l = 0; l < list.length; l++) {
                document.getElementById(list[l]).value = "$" + "0.00";
            }
        }
    }
    // Object to store final values to
    var dict = {};
    // Final function to collect all data for the invoice
    function getAllData() {
        // Init vars
        var a;
        // Controls while loop
        var control = true;
        // Determines pass or fail
        var pass = false;
        while (control) {
            // Get all values in formvalues string array
            for (i = 0; i < formvalues.length; i++) {
                // Get value from form
                a = getValue(formvalues[i]);
                // If value is nothing, loop breaks and test fails immediately
                if (a === "" || a === null) {
                    pass = false;
                    control = false;
                }
                // Else loop continues
                else {
                    dict[i] = a;
                    // Special exception for "warranty" field which is a check box
                    if (formvalues[i] === "Warranty") {
                        // Instead of getting value, get checked boolean
                        dict[i] = document.getElementById("Warranty").checked;
                    pass = true;
                    }
                }
            }
            // For loop finishes, breaking while loop
            control = false;
        }
        // Final check for errors based on flags
        if (pass && !form.haserror) {
            // Dump data object to console
            console.log(dict);
            // Call funct to load invoice
            displayInvoice(dict);
        } else {
            // Inform user of faults
            alert("Validation failed, please check inputs")
        }
    }

    // Function to remove child nodes of table
    function removeChildren() {
        let element = document.getElementById("Courtesyphonetable");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // Function to load data from JSON formate into FAQS
    function showFaqs() {
        var mydata = JSON.parse(data);
        var one = mydata[0].title;
        var two = mydata[0].data;
        var three = mydata[1].title;
        var four = mydata[1].data;
        var five = mydata[2].title;
        var six = mydata[2  ].data;
        let invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(
            `
            <html>
                <head>
                    <title>Repair Invoice</title>
                    <link rel="stylesheet" href="./static/css/invoice_styles.css">
                </head>                `
        );
        //Write the "body" section
        invoiceWindow.document.write(
            `
            <body>
                <header>
                    <h1 class="invoice-title">Frequently Asked Questions</h1>
                </header>
                <div class="container1">
                    <p>${one}</p>
                    <p>${two}</p>
                    <p>${three}</p>
                    <p>${four}</p>
                    <p>${five}</p>
                    <p>${six}</p>
                </div>
                <footer>
                    <h3>Fixit Services</h3><br>
                    <p>1234 Taradale Road, </p>
                    <p>Taradale, NZ</p>
                </footer>
            </body>
            </html>                
            `
        );
    }
    function displayInvoice(dict) {
        //Open a "blank" webpage
        let invoiceWindow = window.open('', '_blank');
        // Load data from object
        let Firstname = dict[0];
        let Lastname = dict[1];
        let Streetnumber = dict[2];
        let Street = dict[3];
        let City = dict[4];
        let State = dict[5];
        let country = dict[6];
        let Postcode = dict[7];
        let Phonenumber = dict[8];
        let Email = dict[9];
        let Purchasedate = dict[10];
        let Repairdate = dict[11];
        let Warranty = dict[12];
        let IMEInumber = dict[13];
        let Make = dict[14];
        let Modelnumber = dict[15];
        let Faultcategory = dict[16];
        let Description = dict[17];
        let Bond = dict[18];
        let Servicefee = dict[19];
        let Total = dict[20];
        let GST = dict[21];
        let TotalplusGST = dict[22];
        let CourtesyPhone = document.getElementById("Phonelist").value;
        let CourtesyPhonecost = courtesyPhone.phonecost;
        let currentdate = new Date();
        // Get current date and time
        var invoicedate = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
        // Set payment date 1 week from invoicedate
        var paymentdate = (currentdate.getDate()+7) + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear();

        //Write invoice info to document
        invoiceWindow.document.write(
            `
            <html>
                <head>
                    <title>Repair Invoice</title>
                    <link rel="stylesheet" href="./static/css/invoice_styles.css">
                </head>                `
        );
        //Write the "body" section
        invoiceWindow.document.write(
            `
            <body>
                <header>
                    <h1 class="invoice-title">Repair Invoice</h1>
                    <h3> Amount due: ${TotalplusGST} </h3>
                </header>
                <div class="container1">
                    <div class="Customerdetails">
                        <h3>Customer Details</h3>
                        <p>${Firstname} ${Lastname}</p>
                        <p>${Streetnumber} ${Street}</p>
                        <p${State}</l>
                        <p>${City}&nbsp${Postcode}</p>
                        <p>${country}</p>
                        <p>${Phonenumber}</p>
                        <p>${Email}</p>
                    </div>
                    <div class="repairJobdetails">
                        <h3>Repair Details</h3>
                        <p>Job Number: </p>
                        <p>Invoice date: ${invoicedate}</p>
                        <p>Payment date: ${paymentdate} </p>
                    </div>
                </div>
                
                <hr>
                <div class="container1">
                  
                    <div class="repairDetails">
                        <h3>Repair Details: </h3>
                        <p><b>Purchase date: </b>${Purchasedate}</p>
                        <p><b>Repair date: </b>${Repairdate}</p>
                        <p><b>Under Warranty: </b>${Warranty}</p>
                        <p><b>IMEI Number: </b>${IMEInumber}</p>
                        <p><b>Device Make: </b>${Make}</p>
                        <p><b>Model Number: </b>${Modelnumber}</p>
                        <p><b>Fault Catagory: </b>${Faultcategory}</p>
                        <p><b>Description: </b>${Description}</p>
                    </div>
                    <div class="CourtesyPhone" >
                    <h3>Courtesy Phone Details: </h3>
                        <table>
                         <tr>
                          <th>ITEM</th>
                          <th>COST</th>
                         </tr>
                         <tr>
                          <td>${CourtesyPhone}</td>
                          <td>$${CourtesyPhonecost}.00</td>
                         </tr>
                         <tr>
                          <td>Charger</td>
                          <td>$30.00</td>
                         </tr>
                        </table>
                    </div>
                </div>
                <hr>
                <div class="Totals">
                        <h3>Totals: </h3>
                        <p><b>Bond: </b>${Bond}</p>
                        <p><b>Service Fee: </b>${Servicefee}</p>
                        <p><b>Total: </b>${Total}</p>
                        <p><b>GST: </b>${GST}</p>
                        <p><b>Total+GST: </b>${TotalplusGST}</p>
                    </div>
                <footer>
                    <h3>Fixit Services</h3><br>
                    <p>1234 Taradale Road, </p>
                    <p>Taradale, NZ</p>
                </footer>
            </body>
            </html>                
            `
        );
    }

    //Submit form values function
    function formSubmit() {
        // Find blanks
        findBlankInputs();
        // Check dates
        validateDates();
        // Check warranty based on valid dates
        validateWarranty();
        // Validate each field using relevant args which were set in the top of the code
        validateField(postcode.DOM_id, postcode.regex, postcode.error_id, postcode.error_message);
        validateField(firstname.DOM_id, firstname.regex, firstname.error_id, firstname.error_message);
        validateField(lastname.DOM_id, firstname.regex, lastname.error_id, firstname.error_message);
        validateField(IMEInumber.DOM_id, IMEInumber.regex, IMEInumber.error_id, IMEInumber.error_message);
        validateField(email.DOM_id, email.regex, email.error_id, email.error_message);
        validateField(phnum.DOM_id, phnum.regex, phnum.error_id, phnum.error_message);
        // If user hasn't already added phone, add it before form submission
        addCourtesyphone();
        // Final function call which eventuates with loading invoice on success=true
        getAllData();
    }