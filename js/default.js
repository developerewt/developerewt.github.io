var welcomeText = "Welcome, this is a CLI " +
                  "application created for me " +
                  "to show my work. Please, type 'help' " +
                  "that a list of commands will be displayed.";

var nbsp        = "<br>";
var nbsp2       = "<br><br>";
var tabulation  = "&nbsp;&nbsp;&nbsp;&nbsp;";

/**
 * Initialization command line.
 */
function init()
{
    document.getElementById('output').innerHTML = welcomeText;
    document.getElementById('command').focus();
    document.getElementById('output').style.height = (screen.height - 250) + 'px';
}

/**
 * Verify if the command is executed correctly.
 *
 * @param   e
 * @returns {boolean}
 */
function execute(e)
{
    if (e.keyCode == 13) {
        var command = document.getElementById("command");
        parseCommand(command);
        command.focus();
        command.value = '';
        return false;
    }
}

/**
 * Reflection function to display all functions
 * of the file.
 */
function listFunctions()
{
    var functions = [];
    for ( var i in window) {
        if((typeof window[i]).toString()=="function"){
            functions.push(window[i].name);
        }
    }

    return functions;
}

/**
 * Parse command to execute.
 *
 * @param command
 */
function parseCommand(command)
{
    var commandSyntax = command.value.split(' ');

    // The command exists...
    if (window[command.value] || window[commandSyntax[0]]) {

        // Case the command have params.
        if (commandSyntax.length > 1) {

            window[commandSyntax[0]](commandSyntax);
        } else {
            window[command.value]();
        }
    } else {
        print("Command not found. Type 'help' to display the command list.")
    }
}

/**
 * Print response command in output.
 *
 * @param response
 */
function print(response)
{
    var output  = document.getElementById('output');
    output.innerHTML += nbsp2.toString() + response.toString();
    cursorFocus('output');
}

/**
 * Focus cursor in the end of output.
 *
 * @param elem
 */
function cursorFocus(elem) {
    var objDiv = document.getElementById(elem);
    objDiv.scrollTop = objDiv.scrollHeight;
}

/**
 * Command list description.
 *
 * @returns {*[]}
 */
function commands()
{
    return [
        {
            name: "help",
            description: "Show command list of application.",
            version: "0.0.1"
        },{
            name: "clean",
            description: "Clean the output buffer",
            version: "0.0.1"
        },{
            name: "resume",
            description: "Informations about my resume.",
            version: "0.0.1"
        }
    ];
}

/**
 * Load a JSON file in callback.
 *
 * @param src
 * @param callback
 */
function loadJSON(src, callback)
{
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', src, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function readResume(feature)
{
    var htmlFeature = '';

    for (f in feature) {
        if (feature[f].constructor === Object) {
            for (x in feature[f]) {
                htmlFeature += '<b>' + titleCase(x) + ': </b>' + feature[f][x] + '<br>';
            }

            htmlFeature += '<br>';
        } else {
            htmlFeature += '<b>' + titleCase(f) + ': </b>' + feature[f] + '<br>';
        }
    }

    return htmlFeature;
}

function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//-------------------------------------
// Command list
//-------------------------------------


/**
 * Show the command list with version and description.
 */
function help() {
    var output = document.getElementById('output');
    var message = "Below, the list of possible commands:" + nbsp;
    var commandList = commands();

    for (var i = 0; i < commandList.length; i++) {
        message += '<b>' + commandList[i].name + '</b>';
        message += " (" + commandList[i].version + ")" + nbsp;
        message += tabulation + commandList[i].description + nbsp;
    }

    print(message);
}

/**
 * Clean the output.
 */
function clean()
{
    document.getElementById('output').innerHTML = welcomeText;
}

/**
 * Show resume completely or a piece.
 *
 * @param params
 */
function resume(params)
{
    loadJSON('./resume.json', function(response) {
        var r = JSON.parse(response);
        var txt = '';

        // Is there params?
        if (params != undefined) { // Yes
            for (var i = 1; i < params.length; i++) {
                var piece = '';
                if (params[i].indexOf('--') != true) {
                    piece = params[i].replace('--', '');
                } else {
                    print('The resume command list is ...');
                    break;
                }

                if (r[piece] == undefined) {
                    print('Oops... The param ' + piece + ' doesn\'t exist!');
                } else {
                    txt += '<span class="featured">' + piece.toUpperCase() + '</span><br>';
                    txt += readResume(r[piece]);
                }
            }
        }

        print(txt);

        //console.log(r.about_me.married);
    });
}
