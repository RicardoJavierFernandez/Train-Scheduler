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
        let nextArrival = moment().add(parseInt(dataFrequency), 'minute').format('HH:mm'); // use moment().add(number, String) method
        
        $('#train-data').append(
            '<tr><td>' + dataName + '</td>' // Train Name
            + '<td>' + dataDestination + '</td>' // Destination
            + '<td>' + dataFrequency + ' minutes</td>' // Frequency
            + '<td>' + nextArrival + '</td>' // Next Arrival
            + '<td>' + '-' + '</td></tr>' // Minutes Away
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

// writeUserData('test', 'test destination', 'test time', 'test frequency');

function dataValidationWarning()
{   
    if (this.id == 'first-train')
    {
        var timeInput = $(this).val();
        if (!timeInput.match(/^\d{2}:\d{2}$/))
        {
            $('#first-train-data-validation').text("Please enter a valid time in this format HH:mm");
        }
        else
        {
            $('#first-train-data-validation').text('');
        }
    }
    else if (this.id == 'frequency')
    {
        if (!parseInt($(this).val()))
        {
            $('#freq-data-validation').text('Please enter a number');
        }
        else
        {
            $('#freq-data-validation').text('');
        }
    }
}

function validateData(name, destination, firstTrainTime, frequency)
{
    if (name !== '' && destination !== '' && firstTrainTime.match(/^\d{2}:\d{2}$/) && parseInt(frequency))
    {
        console.log("Data has been validated");
        return true;
    }
    else
    {
        return false;
    }

}

function clearForm()
{
    $('#train-name').val('');
    $('#destination').val('');
    $('#first-train').val('');
    $('#frequency').val('');
}

$('#first-train').on('blur', dataValidationWarning)
$('#frequency').on('blur', dataValidationWarning)


$('#btn-submit').on('click', function(e) 
{
    e.preventDefault();
    var inputTrainName = toTitleCase($('#train-name').val());
    var inputDestination = toTitleCase($('#destination').val());
    var inputFirstTrainTime = toTitleCase($('#first-train').val());
    var inputFrequency = toTitleCase($('#frequency').val());

    if (validateData(inputTrainName, inputDestination, inputFirstTrainTime, inputFrequency))
    {
        $('#submit-data-validation').text('');
        writeTrainData(inputTrainName, inputDestination, inputFirstTrainTime, inputFrequency);
        clearForm();
    }  
    else
    {
        $('#submit-data-validation').text("Please submit the data in the correct format.");
    }
});


console.log(moment().add(30, 'minute').format('HH:mm'));


