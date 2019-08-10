// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCm2b4nLDkOoaR5sl-y9f2KdsoE3E3aOk4",
    authDomain: "train-scheduler-79698.firebaseapp.com",
    databaseURL: "https://train-scheduler-79698.firebaseio.com",
    projectId: "train-scheduler-79698",
    storageBucket: "train-scheduler-79698.appspot.com",
    messagingSenderId: "56253576269",
    appId: "1:56253576269:web:76685845272e16b0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

function writeTrainData(trainName, destination, firstTrainTime, frequency)
{
    // var newEntryKey = firebase.database().ref().child('trainInfo').push().key

    firebase.database().ref('trainInfo/').push({
        name: trainName,
        destination: destination,
        firstTime: firstTrainTime,
        frequency: frequency
    });

    // return firebase.database.ref().update()
}  

// Retrieve data from the database and display it in a table
database.ref('trainInfo/').on('value', function(data)
{
    $('#train-data').empty();

    var dataObject = data.val();
    
    for (id in dataObject)
    {
        let dataDestination = dataObject[id].destination;
        let dataFirstTime = dataObject[id].firstTime;
        let dataFrequency = dataObject[id].frequency;
        let dataName = dataObject[id].name;
        let nextArrival = moment().add(parseInt(dataFrequency), 'minute'); // use moment().add(number, String) method
        let minutesAway = nextArrival.diff(moment(), 'minute');

        $('#train-data').append(
            '<tr><td>' + dataName + '</td>' // Train Name
            + '<td>' + dataDestination + '</td>' // Destination
            + '<td>' + dataFrequency + '</td>' // Frequency
            + '<td>' + nextArrival.format('hh:mm a') + '</td>' // Next Arrival
            + '<td>' + minutesAway + '</td></tr>' // Minutes Away
        );
    }
});


function toTitleCase(word)
{
    var wordArray = word.toLowerCase().split(' ');
    for (let i = 0; i < wordArray.length; i++)
    {
        wordArray[i] = wordArray[i].charAt(0).toUpperCase() + wordArray[i].slice(1);
    }
    return wordArray.join(' ')
}

// Warning if the data in the input boxes does not meet the data type criteria
function dataValidationWarning()
{   
    if (this.id == 'first-train')
    {
        var timeInput = $(this).val();
        if (!timeInput.match(/^\d{2}:\d{2}$/))
        {
            $(this).next().text("Please enter a valid time in this format HH:mm");
        }
        else
        {
            $(this).next().text('');
        }
    }
    else if (this.id == 'frequency')
    {
        if (!parseInt($(this).val()))
        {
            $(this).next().text('Please enter a number');
        }
        else
        {
            $(this).next().text('');
        }
    }
    else // if (this.id == 'train-name' || this.id == 'destination')
    {
        if ($(this).val() == '')
        {
            $(this).next().text('Please enter a valid value')
        }
        else
        {
            $(this).next().text('');
        }
    }
}

// FUNCTION to validate the data before submitting to the database. Returns true if all inputs are valid, else it returns false
function validateData(name, destination, firstTrainTime, frequency)
{
    if (name !== '' && destination !== '' && firstTrainTime.match(/^\d{2}:\d{2}$/) && parseInt(frequency))
    {
        console.log("Data has been validated");
        return true;
    }
    else
    {
        console.log("Invalid user data");
        
        return false;
    }

}


// EVENT on blur to inform the user that the data in the input box is valid/invalid
$('#destination').on('blur', dataValidationWarning)
$('#train-name').on('blur', dataValidationWarning)
$('#first-train').on('blur', dataValidationWarning)
$('#frequency').on('blur', dataValidationWarning)

// EVENT on submit button
$('#btn-submit').on('click', function(e) 
{
    e.preventDefault();
    var inputTrainName = toTitleCase($('#train-name').val());
    var inputDestination = toTitleCase($('#destination').val());
    var inputFirstTrainTime = $('#first-train').val();
    var inputFrequency = $('#frequency').val();

    if (validateData(inputTrainName, inputDestination, inputFirstTrainTime, inputFrequency))
    {
        $('#submit-data-validation').text('');
        writeTrainData(inputTrainName, inputDestination, inputFirstTrainTime, inputFrequency);
        $('input').val('');
    }  
    else
    {
        $('#submit-data-validation').text("Please submit the data in the correct format.");
    }
});



