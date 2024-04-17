
    function generateTable() {
        var numProcesses = document.getElementById('num-processes').value.trim();
        var numResources = document.getElementById('num-resources').value.trim();
        var availableResources = document.getElementById('avail-resources').value.trim();

        var numProcessesError = document.getElementById('num-processes-error');
        var numResourcesError = document.getElementById('num-resources-error');
        var availableResourcesError = document.getElementById('avail-resources-error');

        numProcessesError.innerHTML = '';
        numResourcesError.innerHTML = '';
        availableResourcesError.innerHTML = '';

        var isValid = true;

        if (numProcesses === '') {
            numProcessesError.innerHTML = 'Please enter the number of processes';
            isValid = false;
        }

        if (numResources === '') {
            numResourcesError.innerHTML = 'Please enter the number of resources';
            isValid = false;
        }

        if (availableResources === '') {
            availableResourcesError.innerHTML = 'Please enter the initially available resources';
            isValid = false;
        } else {
            var resourcesArray = availableResources.split(/\s+/);
            // this regex /\s+/ will match one or more spaces or line breaks
            if (resourcesArray.length !== parseInt(numResources)) {
                availableResourcesError.innerHTML = 'Number of available resources should be equal to the number of resources';
                isValid = false;
            }
        }

        if (isValid) {

            // Create table for user input
            var table = '<h3>Enter Details</h3>';
            table += '<table>';
            table += '<tr><th>Process</th>';
            for (var i = 1; i <= numResources; i++) {
                table += '<th>Resource ' + i + ' (Max)</th>';
            }
            for (var i = 1; i <= numResources; i++) {
                table += '<th>Resource ' + i + ' (Allocated)</th>';
            }
            table += '</tr>';
            for (var i = 1; i <= parseInt(numProcesses); i++) {
                table += '<tr>';
                table += '<td>Process ' + i + '</td>';
                for (var j = 1; j <= parseInt(numResources); j++) {
                    table += '<td><input type="number" id="max-p' + i + '-r' + j + '"></td>';
                }
                for (var j = 1; j <= parseInt(numResources); j++) {
                    table += '<td><input type="number" id="alloc-p' + i + '-r' + j + '"></td>';
                }
                table += '</tr>';
            }
            table += '</table><br>';
            table += '<button onclick="calculate(' + parseInt(numProcesses) + ',' + parseInt(numResources) + ', \'' + availableResources + '\')">Simulate</button>';
            document.getElementById('output').innerHTML += table;
        }
    }

    function calculate(numProcesses, numResources, availableResources) {
        var maxAllocation = [];
        var currentAllocation = [];

// Extract input values
for (var i = 1; i <= numProcesses; i++) {
    var maxRow = [];
    var allocRow = [];
    for (var j = 1; j <= numResources; j++) {
        maxRow.push(parseInt(document.getElementById('max-p' + i + '-r' + j).value));
        allocRow.push(parseInt(document.getElementById('alloc-p' + i + '-r' + j).value));
    }
    maxAllocation.push(maxRow);
    currentAllocation.push(allocRow);
}

// Calculate need matrix
var needMatrix = [];
for (var i = 0; i < numProcesses; i++) {
    needMatrix[i] = [];
    for (var j = 0; j < numResources; j++) {
        needMatrix[i][j] = maxAllocation[i][j] - currentAllocation[i][j];
    }
}
// console.log(needMatrix)

// Perform Banker's Algorithm
var work = availableResources.split(/\s+/);
var worknum=[];//used to store work array of string type into num type
for(let i=0;i<work.length;i++)
worknum.push(parseInt(work[i]));

var finish = new Array(numProcesses).fill(false);
var safeSequence = [];
var count = 0;
var output1 = "";
while (count < numProcesses) {
    var found = false;
    for (var i = 0; i < numProcesses; i++) {
        if (!finish[i]) {
            var canExecute = true;
            for (var j = 0; j < numResources; j++) {
                if (needMatrix[i][j] > worknum[j]) {
                    canExecute = false;
                    break;
                }
            }
            if (canExecute) {
                output1+="<p>Process "+(i+1)+" is executing...</p>";
                for (var j = 0; j < numResources; j++) {
                    worknum[j] += currentAllocation[i][j];
                    // console.log(worknum[j])
                }
                output1+="<p>Process "+(i+1)+" execution completed</p>";
                finish[i] = true;
                safeSequence.push(i + 1);
                count++;
                found = true;
            }

        }
    }
    if (!found) {
        break;
    }
}


if (count === numProcesses) {
    output1 += "<h3>System is in safe state</h3>";
    output1 += "<p>Safe Sequence: " + safeSequence.join(" -> ") + "</p>";
} else {
    output1 += "<h3>Deadlock may occur as system is not in safe state</h3>";
}

document.getElementById('output1').innerHTML += output1;
}
