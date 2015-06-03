function addEntries() { //store objects into array
        var i = 0;
        var entry = {};

        entry.start = document.getElementById("start").value;
        entry.end = document.getElementById("end").value;
        entry.description = document.getElementById("description").value;
        entry.tags = document.getElementById("tags").value;

        entries.push(entry);

        for (i; i < entries.length; i++) {
            var stringifyArray = entries[i].description + ", " + entries[i].tags + ", " + entries[i].start + ", " + entries[i].ends;
            var entriesContainer = document.getElementById("entriesContainer");
            var p = document.createElement('p');
            var addArray = document.createTextNode(stringifyArray);
            p.appendChild(addArray);
            document.getElementById("box").appendChild(p);

        }
        
        return i;





        function cloneRow() { //clone row function
            var row = document.getElementById("inputRow"); // find row to copy
            var table = document.getElementById("myTable"); // find table to append to
            var clone = row.cloneNode(true); // copy children too
            clone.id = "cloneRow"; // change id or other attributes/contents
            table.appendChild(clone); // add new row to end of table
        }

        function deleteRow(t) { //delete row function
            var row = t.parentNode.parentNode;
            document.getElementById("myTable").deleteRow(row.rowIndex);
        }