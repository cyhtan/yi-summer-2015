var entries = [];
 var i = 0;

 function addEntry() {
  var entry = {};
  entry.description = document.getElementById("description").value;
  entry.tags = document.getElementById("tags").value;
  entry.start = document.getElementById("start").value;
  entry.ends = document.getElementById("end").value;
  entries.push(entry);
  for (i; i<entries.length; i++) {
  var tableDiv = document.getElementById("tableContainer");
  var tbl = document.createElement("table");
  tbl.className ="table";
  var tblBody = document.createElement("tbody");
  var row = document.createElement("tr");
    for (key in entries[i]) {
      var cell = document.createElement("td");
      cell.setAttribute("padding","1em");
      var cellText = document.createTextNode(entries[i][key]);
      cell.appendChild(cellText);
      row.appendChild(cell);
      console.log (entries[i][key]);
   }
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("id","deleteButton");
  deleteButton.setAttribute("value",'Delete Row');
  var cell2 = document.createElement("td");
  cell2.appendChild(deleteButton);
  row.appendChild(cell2);
  tblBody.appendChild(row);
  tbl.appendChild(tblBody);
  tableDiv.appendChild(tbl);
  tbl.setAttribute("border", "1");
  }
  return i;

  function deleteEntry() {
  var setName = getElementById("deleteButton");





}

}

